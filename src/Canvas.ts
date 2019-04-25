import {
    $, Raphael, UUID, RegionEditPolicy, ArrayList, KeyboardPolicy,
    LineShape, CommandStack, WheelZoomPolicy, DefaultKeyboardPolicy,
    BoundingboxSelectionPolicy, DropInterceptorPolicy, ComposedConnectionCreatePolicy,
    DragConnectionCreatePolicy, ClickConnectionCreatePolicy, CanvasSelectionPolicy,
    ZoomPolicy, ConnectionCreatePolicy, Rectangle, Point, PolyLine, Connection, Figure,
    Selection, Node
} from './imports';

export interface AttributeCollection {
    [key: string]: any;
}

export class Canvas {
    private html: JQuery<HTMLElement>;
    private canvasId: string;
    private initialWidth: number;
    private initialHeight: number;
    paper: any;
    zoomPolicy: any;
    zoomFactor: number;
    selection: Selection;
    currentDropTarget: any;
    currentHoverFigure: any;
    regionDragDropConstraint: any;
    static figure: any;
    eventSubscriptions: {};
    editPolicy: any;
    figures: any;
    lines: ArrayList<LineShape>;
    commonPorts: any;
    resizeHandles: any;
    commandStack: any;
    linesToRepaintAfterDragDrop: any;
    lineIntersections: any;
    static canvas: any;
    static connection: any;
    mouseDown: boolean;
    mouseDownX: number;
    mouseDownY: number;
    mouseDragDiffX: number;
    mouseDragDiffY: number;
    keyupCallback: (event: any) => void;
    keydownCallback: (event: any) => void;
    scrollArea: JQuery<any>;
    draggingLineCommand: any;
    draggingLine: LineShape;

    constructor(canvasId: HTMLElement | string, width: number, height: number) {


        this.setScrollArea(document.body)
        this.canvasId = (typeof canvasId === 'string') ? canvasId : UUID();
        this.html = $("#" + canvasId)
        this.html.attr('id', this.canvasId);
        this.html.css({ "cursor": "default" })
        if (!isNaN(parseFloat(width + '')) && !isNaN(parseFloat(height + ''))) {
            this.initialWidth = width
            this.initialHeight = height
        }
        else {
            this.initialWidth = this.getWidth()
            this.initialHeight = this.getHeight()
        }

        this.html.css({ "-webkit-tap-highlight-color": "rgba(0,0,0,0)" });

        ($(this.html) as any).droppable({
            accept: '.graph_droppable',
            over: (event, ui) => {
                this.onDragEnter(ui.draggable)
            },
            out: (event, ui) => {
                this.onDragLeave(ui.draggable)
            },
            drop: (event, ui) => {
                event = this._getEvent(event)
                let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                this.onDrop(ui.draggable, pos.getX(), pos.getY(), event.shiftKey, event.ctrlKey)
            }
        });


        ($(".graph_droppable") as any).draggable({
            appendTo: "body",
            stack: "body",
            zIndex: 27000,
            helper: "clone",
            drag: (event, ui) => {
                event = this._getEvent(event)
                let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                this.onDrag(ui.draggable, pos.getX(), pos.getY(), event.shiftKey, event.ctrlKey)
            },
            stop: (e, ui) => {
            },
            start: (e, ui) => {
                $(ui.helper).addClass("shadow")
            }
        })


        if (!isNaN(parseFloat(height + ''))) {
            this.paper = Raphael(this.canvasId, width, height)
        }
        else {
            this.paper = Raphael(this.canvasId, this.getWidth(), this.getHeight())
        }

        this.paper.canvas.style.position = "absolute"

        // Status handling
        //
        this.zoomPolicy = null // default ZoomEditPolicy
        this.zoomFactor = 1.0 // range [0.001..10]
        this.selection = new Selection()
        this.currentDropTarget = null
        this.currentHoverFigure = null

        // installed to all added figures to avoid that a figure can be placed outside the canvas area
        // during a drag&drop operation
        this.regionDragDropConstraint = new RegionEditPolicy(0, 0, this.getWidth(), this.getHeight())

        // event handling since version 5.0.0
        this.eventSubscriptions = {}

        this.editPolicy = new ArrayList()

        // internal document with all figures, ports, ....
        //
        this.figures = new ArrayList()
        this.lines = new ArrayList() // crap - why are connections not just figures. Design by accident
        this.commonPorts = new ArrayList()

        // all visible resize handles which can be drag&drop around. Selection handles like AntRectangleSelectionFeedback
        // are not part of this collection. Required for hitTest only
        this.resizeHandles = new ArrayList()

        // The CommandStack for undo/redo operations
        //
        this.commandStack = new CommandStack()

        // INTERSECTION/CROSSING handling for connections and lines
        //
        this.linesToRepaintAfterDragDrop = new ArrayList()
        this.lineIntersections = new ArrayList()

        this.installEditPolicy(new WheelZoomPolicy())
        this.installEditPolicy(new DefaultKeyboardPolicy())
        this.installEditPolicy(new BoundingboxSelectionPolicy())
        this.installEditPolicy(new DropInterceptorPolicy())
        this.installEditPolicy(new ComposedConnectionCreatePolicy(
            [
                new DragConnectionCreatePolicy(),
                new ClickConnectionCreatePolicy()
            ])
        )


        this.commandStack.addEventListener((event) => {
            if (event.isPostChangeEvent() === true) {
                this.calculateConnectionIntersection()
                this.linesToRepaintAfterDragDrop.each((i, line) => {
                    line.svgPathString = null
                    line.repaint()
                })
                this.linesToRepaintAfterDragDrop = new ArrayList()
            }
        })

        // DragDrop status handling
        //
        this.mouseDown = false
        this.mouseDownX = 0
        this.mouseDownY = 0
        this.mouseDragDiffX = 0
        this.mouseDragDiffY = 0

        this.html.bind("mouseup touchend", (event) => {
            if (this.mouseDown === false) {
                return
            }

            event = this._getEvent(event)
            this.calculateConnectionIntersection()

            this.mouseDown = false
            let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
            this.editPolicy.each((i, policy) => {
                policy.onMouseUp(this, pos.getX(), pos.getY(), event.shiftKey, event.ctrlKey)
            })

            this.mouseDragDiffX = 0
            this.mouseDragDiffY = 0
        })

        this.html.bind("mousemove touchmove", (event) => {
            event = this._getEvent(event)
            let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
            if (this.mouseDown === false) {
                // mouseEnter/mouseLeave events for Figures. Don't use the Raphael or DOM native functions.
                // Raphael didn't work for Rectangle with transparent fill (events only fired for the border line)
                // DOM didn't work well for lines. No eclipse area - you must hit the line exact to retrieve the event.
                // In this case I implement my own stuff...again and again.
                //
                // don't break the main event loop if one element fires an error during enter/leave event.
                try {
                    let hover = this.getBestFigure(pos.getX(), pos.getY())
                    if (hover !== this.currentHoverFigure && this.currentHoverFigure !== null) {
                        this.currentHoverFigure.onMouseLeave() // deprecated
                        this.currentHoverFigure.fireEvent("mouseleave")
                        this.fireEvent("mouseleave", { figure: this.currentHoverFigure })
                    }
                    if (hover !== this.currentHoverFigure && hover !== null) {
                        hover.onMouseEnter()
                        hover.fireEvent("mouseenter")
                        this.fireEvent("mouseenter", { figure: hover })
                    }
                    this.currentHoverFigure = hover
                }
                catch (exc) {
                    // just write it to the console
                    console.log(exc)
                }

                this.editPolicy.each((i, policy) => {
                    policy.onMouseMove(this, pos.getX(), pos.getY(), event.shiftKey, event.ctrlKey)
                })

                this.fireEvent("mousemove", {
                    x: pos.getX(),
                    y: pos.getY(),
                    shiftKey: event.shiftKey,
                    ctrlKey: event.ctrlKey,
                    hoverFigure: this.currentHoverFigure
                })
            }
            else {
                let diffXAbs = (event.clientX - this.mouseDownX) * this.zoomFactor
                let diffYAbs = (event.clientY - this.mouseDownY) * this.zoomFactor
                this.editPolicy.each((i, policy) => {
                    policy.onMouseDrag(this, diffXAbs, diffYAbs, diffXAbs - this.mouseDragDiffX, diffYAbs - this.mouseDragDiffY, event.shiftKey, event.ctrlKey)
                })
                this.mouseDragDiffX = diffXAbs
                this.mouseDragDiffY = diffYAbs
                this.fireEvent("mousemove", {
                    x: pos.getX(),
                    y: pos.getY(),
                    shiftKey: event.shiftKey,
                    ctrlKey: event.ctrlKey,
                    hoverFigure: this.currentHoverFigure
                })
            }
        })

        this.html.bind("mousedown touchstart", (event) => {
            try {
                let pos = null
                switch (event.which) {
                    case 1: //touch pressed
                    case 0: //Left mouse button pressed
                        try {
                            event.preventDefault()
                            event = this._getEvent(event)
                            this.mouseDownX = event.clientX
                            this.mouseDownY = event.clientY
                            this.mouseDragDiffX = 0
                            this.mouseDragDiffY = 0
                            pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                            this.mouseDown = true
                            this.editPolicy.each((i, policy) => {
                                policy.onMouseDown(this, pos.x, pos.y, event.shiftKey, event.ctrlKey)
                            })
                        }
                        catch (exc) {
                            console.log(exc)
                        }
                        break
                    case 3: //Right mouse button pressed
                        event.preventDefault()
                        if (typeof event.stopPropagation !== "undefined")
                            event.stopPropagation()
                        event = this._getEvent(event)
                        pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                        this.onRightMouseDown(pos.x, pos.y, event.shiftKey, event.ctrlKey)
                        return false
                        break
                    case 2:
                        //Middle mouse button pressed
                        break
                    default:
                    //You have a strange mouse
                }
            }
            catch (exc) {
                console.log(exc)
            }
        })


        // Catch the dblclick and route them to the Canvas hook.
        //
        this.html.on("dblclick", (event) => {
            event = this._getEvent(event)

            this.mouseDownX = event.clientX
            this.mouseDownY = event.clientY
            let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
            this.onDoubleClick(pos.getX(), pos.getY(), event.shiftKey, event.ctrlKey)
        })


        // Catch the click event and route them to the canvas hook
        //
        this.html.on("click", (event) => {
            event = this._getEvent(event)

            // fire only the click event if we didn't move the mouse (drag&drop)
            //
            if (this.mouseDownX === event.clientX || this.mouseDownY === event.clientY) {
                let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                this.onClick(pos.getX(), pos.getY(), event.shiftKey, event.ctrlKey)
            }
        })


        this.html.on('MozMousePixelScroll DOMMouseScroll mousewheel', (e) => {
            let event = this._getEvent(e)
            let pos = this.fromDocumentToCanvasCoordinate(event.originalEvent.clientX, event.originalEvent.clientY)

            let delta = 0
            if (e.type == 'mousewheel') {
                delta = ((e.originalEvent as any).wheelDelta * -1)
            }
            else if (e.type == 'DOMMouseScroll') {
                delta = 40 * (e.originalEvent as any).detail
            }

            let returnValue = this.onMouseWheel(delta, pos.getX(), pos.getY(), event.shiftKey, event.ctrlKey)

            if (returnValue === false) {
                e.preventDefault()
            }
        })

        // Catch the keyUp and CTRL-key and route them to the Canvas hook.
        //
        this.keyupCallback = (event) => {
            // don't initiate the delete command if the event comes from an INPUT field. In this case the user want delete
            // a character in the input field and not the related shape
            let target = $(event.target)
            if (!target.is("input") && !target.is("textarea")) {
                this.editPolicy.each((i, policy) => {
                    if (policy instanceof KeyboardPolicy) {
                        policy.onKeyUp(this, event.keyCode, event.shiftKey, event.ctrlKey)
                    }
                })
            }
        }
        $(document).bind("keyup", this.keyupCallback)

        // Catch the keyDown and CTRL-key and route them to the Canvas hook.
        //
        this.keydownCallback = (event) => {
            // don't initiate the delete command if the event comes from an INPUT field. In this case the user want delete
            // a character in the input field and not the related shape
            let target = $(event.target)
            if (!target.is("input") && !target.is("textarea")) {
                this.editPolicy.each((i, policy) => {
                    if (policy instanceof KeyboardPolicy) {
                        policy.onKeyDown(this, event.keyCode, event.shiftKey, event.ctrlKey)
                    }
                })
            }
        }
        $(document).bind("keydown", this.keydownCallback)

    }

    destroy() {
        this.clear()
        $(document).unbind("keydown", this.keydownCallback)
        $(document).unbind("keyup", this.keyupCallback)
        // reset the event handlers of the canvas without any notice
        //
        this.eventSubscriptions = {}

        try {
            this.paper.remove()
        } catch (exc) {

        }
    }

    clear() {
        this.fireEvent("clear")

        let _this = this

        this.lines.clone().each((i, e) => {
            _this.remove(e)
        })

        this.figures.clone().each((i, e) => {
            _this.remove(e)
        })

        this.zoomFactor = 1.0
        this.selection.clear()
        this.currentDropTarget = null

        // internal document with all figures, ports, ....
        //
        this.figures = new ArrayList()
        this.lines = new ArrayList()
        this.commonPorts = new ArrayList()

        this.commandStack.markSaveLocation()

        // INTERSECTION/CROSSING handling for connections and lines
        //
        this.linesToRepaintAfterDragDrop = new ArrayList()
        this.lineIntersections = new ArrayList()

        // Inform all listener that the selection has been cleanup. Normally this will be done
        // by the edit policies of the canvas..but exceptional this is done in the clear method as well -
        // Design flaw.
        this.fireEvent("select", { figure: null })

        return this
    }

    hideDecoration() {

    }

    showDecoration() {

    }

    calculateConnectionIntersection() {

        this.lineIntersections = new ArrayList()
        let lines = this.getLines().clone()
        while (lines.getSize() > 0) {
            let l1 = lines.removeElementAt(0)
            lines.each((ii, l2) => {
                let partInter = l1.intersection(l2)
                if (partInter.getSize() > 0) {
                    this.lineIntersections.add({ line: l1, other: l2, intersection: partInter })
                    this.lineIntersections.add({ line: l2, other: l1, intersection: partInter })
                }
            })
        }

        return this
    }

    installEditPolicy(policy) {

        // a canvas can handle only one selection policy
        //
        if (policy instanceof CanvasSelectionPolicy) {
            // reset old selection before install new selection strategy
            this.getSelection().getAll().each((i, figure) => {
                figure.unselect()
            })

            // remove existing selection policy
            this.editPolicy.grep((p) => {
                let stay = !(p instanceof CanvasSelectionPolicy)
                if (stay === false) {
                    p.onUninstall(this)
                }
                return stay
            })
        }
        // only one zoom policy at once
        //
        else if (policy instanceof ZoomPolicy) {
            // remove existing zoom policy
            this.editPolicy.grep((p) => {
                let stay = !(p instanceof ZoomPolicy)
                if (stay === false) {
                    p.onUninstall(this)
                }
                return stay
            })
            this.zoomPolicy = policy
        }
        else if (policy instanceof ConnectionCreatePolicy) {
            this.editPolicy.grep((p) => {
                let stay = !(p instanceof ConnectionCreatePolicy)
                if (stay === false) {
                    p.onUninstall(this)
                }
                return stay
            })
        }
        else if (policy instanceof DropInterceptorPolicy) {

        }

        policy.onInstall(this)
        this.editPolicy.add(policy)

        return this
    }

    uninstallEditPolicy(policy) {
        if (policy === null) {
            return
        }

        let removed = this.editPolicy.remove(policy)
        if (removed !== null) {
            removed.onUninstall(this)
            if (removed instanceof ZoomPolicy) {
                this.zoomPolicy = null
            }
        }
        else {
            let _this = this
            let name = (typeof policy === "string") ? policy : policy.NAME
            this.editPolicy.grep((p) => {
                if (p.NAME === name) {
                    p.onUninstall(_this)
                    if (p instanceof ZoomPolicy) {
                        _this.zoomPolicy = null
                    }
                    return false
                }
                return true
            })
        }
        return this
    }

    getDropInterceptorPolicies() {
        return this.editPolicy.clone().grep((p) => {
            return (p instanceof DropInterceptorPolicy)
        })
    }

    setZoom(zoomFactor, animated) {
        if (this.zoomPolicy) {
            this.zoomPolicy.setZoom(zoomFactor, animated)
        }
    }

    getZoom() {
        return this.zoomFactor
    }

    getDimension() {
        return new Rectangle(0, 0, this.initialWidth, this.initialHeight)
    }

    setDimension(dim, height) {
        if (typeof dim === "undefined") {
            let widths = this.getFigures().clone().map((f) => {
                return f.getAbsoluteX() + f.getWidth()
            })
            let heights = this.getFigures().clone().map((f) => {
                return f.getAbsoluteY() + f.getHeight()
            })
            this.initialHeight = Math.max(...heights.asArray())
            this.initialWidth = Math.max(...widths.asArray())
        }
        else if (dim instanceof Rectangle) {
            this.initialWidth = dim.getWidth()
            this.initialHeight = dim.getHeight()
        }
        else if (typeof dim.width === "number" && typeof dim.height === "number") {
            this.initialWidth = dim.width
            this.initialHeight = dim.height
        }
        else if (typeof dim === "number" && typeof height === "number") {
            this.initialWidth = dim
            this.initialHeight = height
        }
        this.html.css({ "width": this.initialWidth + "px", "height": this.initialHeight + "px" })
        this.paper.setSize(this.initialWidth, this.initialHeight)
        this.setZoom(this.zoomFactor, false)

        return this
    }

    fromDocumentToCanvasCoordinate(x, y) {
        return new Point(
            (x - this.getAbsoluteX() + this.getScrollLeft()) * this.zoomFactor,
            (y - this.getAbsoluteY() + this.getScrollTop()) * this.zoomFactor)
    }

    fromCanvasToDocumentCoordinate(x, y) {
        return new Point(
            ((x * (1 / this.zoomFactor)) + this.getAbsoluteX() - this.getScrollLeft()),
            ((y * (1 / this.zoomFactor)) + this.getAbsoluteY() - this.getScrollTop()))
    }

    getHtmlContainer() {
        return this.html
    }

    _getEvent(event) {

        if (typeof event.originalEvent !== "undefined") {
            if (event.originalEvent.touches && event.originalEvent.touches.length) {
                return event.originalEvent.touches[0]
            } else if (event.originalEvent.changedTouches && event.originalEvent.changedTouches.length) {
                return event.originalEvent.changedTouches[0]
            }
        }
        return event
    }

    setScrollArea(elementSelector) {
        this.scrollArea = $(elementSelector)

        return this
    }

    getScrollArea() {
        return this.scrollArea
    }

    getScrollLeft() {
        return this.getScrollArea().scrollLeft()
    }

    getScrollTop() {
        return this.getScrollArea().scrollTop()
    }

    setScrollLeft(left) {
        this.getScrollArea().scrollLeft()

        return this
    }

    setScrollTop(top) {
        this.getScrollArea().scrollTop()

        return this
    }

    scrollTo(top, left) {
        this.getScrollArea().scrollTop(top)
        this.getScrollArea().scrollLeft(left)

        return this
    }

    getAbsoluteX() {
        return this.html.offset().left
    }

    getAbsoluteY() {
        return this.html.offset().top
    }

    getWidth() {
        return this.html.width()
    }

    getHeight() {
        return this.html.height()
    }

    add(figure: Figure, x?, y?) {
        if (figure.getCanvas() === this) {
            return
        }

        if (figure instanceof LineShape) {
            this.lines.add(figure)
            this.linesToRepaintAfterDragDrop = this.lines
        }
        else {
            this.figures.add(figure)
            if (typeof y !== "undefined") {
                figure.setPosition(x, y)
            }
            else if (typeof x !== "undefined") {
                figure.setPosition(x)
            }
        }
        figure.setCanvas(this)


        figure.installEditPolicy(this.regionDragDropConstraint)


        figure.getShapeElement()


        figure.repaint()


        this.fireEvent("figure:add", { figure: figure, canvas: this })


        figure.fireEvent("added", { figure: figure, canvas: this })


        figure.fireEvent("move", { figure: figure, dx: 0, dy: 0 })

        if (figure instanceof PolyLine) {
            this.calculateConnectionIntersection()
            this.linesToRepaintAfterDragDrop.each((i, line) => {
                line.svgPathString = null
                line.repaint()
            })
            this.linesToRepaintAfterDragDrop = new ArrayList()
        }

        return this
    }

    remove(figure) {

        if (figure.getCanvas() !== this) {
            return this
        }


        let _this = this
        if (this.getSelection().contains(figure, false)) {
            this.editPolicy.each((i, policy) => {
                if (typeof policy.unselect === "function") {
                    policy.unselect(_this, figure)
                }
            })
        }

        if (figure instanceof LineShape) {
            this.lines.remove(figure)
        }
        else {
            this.figures.remove(figure)
        }

        figure.setCanvas(null)

        if (figure instanceof Connection) {
            figure.disconnect()
        }

        this.fireEvent("figure:remove", { figure: figure })

        figure.fireEvent("removed", { figure: figure, canvas: this })

        return this
    }

    getLines() {
        return this.lines
    }

    getFigures() {
        return this.figures
    }

    getLine(id) {
        let count = this.lines.getSize()
        for (let i = 0; i < count; i++) {
            let line = this.lines.get(i)
            if (line.getId() === id) {
                return line
            }
        }
        return null
    }

    getFigure(id) {
        let figure = null
        this.figures.each((i, e) => {
            if (e.id === id) {
                figure = e
                return false
            }
        })
        return figure
    }

    getIntersection(line) {
        let result = new ArrayList()

        this.lineIntersections.each((i, entry) => {
            if (entry.line === line) {
                entry.intersection.each((i, p) => {
                    result.add({ x: p.x, y: p.y, justTouching: p.justTouching, other: entry.other })
                })
            }
        })

        return result
    }

    snapToHelper(figure, pos) {
        // disable snapToPos if we have sleect more than one element
        // which are currently in Drag&Drop operation
        //
        if (this.getSelection().getSize() > 1) {
            return pos
        }

        let _this = this
        let orig = pos.clone()
        this.editPolicy.each((i, policy) => {
            pos = policy.snap(_this, figure, pos, orig)
        })

        return pos
    }

    registerPort(port) {
        // All elements have the same drop targets.
        //
        if (!this.commonPorts.contains(port)) {
            this.commonPorts.add(port)
        }

        return this
    }

    unregisterPort(port) {
        this.commonPorts.remove(port)

        return this
    }

    getAllPorts() {
        return this.commonPorts
    }

    getCommandStack() {
        return this.commandStack
    }

    getPrimarySelection() {
        return this.selection.getPrimary()
    }

    getSelection() {
        return this.selection
    }

    setCurrentSelection(object) {
        // deselect the current selected figures
        //
        this.selection.each((i, e) => {
            this.editPolicy.each((i, policy) => {
                if (typeof policy.unselect === "function") {
                    policy.unselect(this, e)
                }
            })
        }, false)
        this.addSelection(object)

        return this
    }

    addSelection(object) {
        let _this = this

        let add = (i, figure) => {
            _this.editPolicy.each((i, policy) => {
                if (typeof policy.select === "function") {
                    policy.select(_this, figure)
                }
            })
        }

        if (object instanceof ArrayList) {
            object.each(add)
        }
        else {
            add(0, object)
        }

        return this

    }

    getBestFigure(x, y, blacklist?, whitelist?) {
        if (!Array.isArray(blacklist)) {
            if (blacklist)
                blacklist = [blacklist]
            else
                blacklist = []
        }

        if (!Array.isArray(whitelist)) {
            if (whitelist)
                whitelist = [whitelist]
            else
                whitelist = []
        }

        let result = null
        let testFigure = null


        let isInList = (testFigure, list) => {
            for (let i = 0, len = list.length; i < len; i++) {
                let considering = list[i]
                if (typeof considering === "function") {
                    if (testFigure instanceof considering) {
                        return true
                    }
                }
                else if ((considering === testFigure) || (considering.contains(testFigure))) {
                    return true
                }
            }
            return false
        }
        let isInBlacklist = (item) => {
            return isInList(item, blacklist)
        }
        // empty whitelist means that every kind of object is allowed
        let isInWhitelist = whitelist.length === 0 ? () => {
            return true
        } : (item) => {
            return isInList(item, whitelist)
        }


        // tool method to check recursive a figure for hitTest
        //
        let checkRecursive = (children) => {
            children.each((i, e) => {
                let c = e.figure
                checkRecursive(c.children)
                if (result === null && c.isVisible() && c.hitTest(x, y) && !isInBlacklist(c) && isInWhitelist(c)) {
                    result = c
                }
                return result === null // break the each-loop if we found an element
            })
        }


        // ResizeHandles
        //
        for (let i = 0, len = this.resizeHandles.getSize(); i < len; i++) {
            testFigure = this.resizeHandles.get(i)
            if (testFigure.isVisible() && testFigure.hitTest(x, y) && !isInBlacklist(testFigure) && isInWhitelist(testFigure)) {
                return testFigure
            }
        }

        // Checking ports
        //
        for (let i = 0, len = this.commonPorts.getSize(); i < len; i++) {
            let port = this.commonPorts.get(i)
            // check first a children of the figure
            //
            checkRecursive(port.children)

            if (result === null && port.isVisible() && port.hitTest(x, y) && !isInBlacklist(port) && isInWhitelist(port)) {
                result = port
            }

            if (result !== null) {
                return result
            }
        }



        for (let i = (this.figures.getSize() - 1); i >= 0; i--) {
            let figure = this.figures.get(i)

            checkRecursive(figure.children)


            if (result === null && figure.isVisible() && figure.hitTest(x, y) && !isInBlacklist(figure) && isInWhitelist(figure)) {
                result = figure
            }

            if (result !== null) {
                let resultLine = this.getBestLine(x, y, result)
                // conflict between line and normal shape -> calculate the DOM index and return the higher (on Top)
                // element
                if (resultLine !== null) {
                    let lineIndex = $(resultLine.shape.node).index()
                    let resultIndex = $(result.shape.node).index()
                    if (resultIndex < lineIndex) {
                        return resultLine
                    }
                }

                return result
            }
        }


        let count = this.lines.getSize()
        for (let i = 0; i < count; i++) {
            let line = this.lines.get(i)

            checkRecursive(line.children)

            if (result !== null) {
                return result
            }
        }


        result = this.getBestLine(x, y, blacklist, whitelist)
        if (result !== null) {
            return result
        }

        return result
    }

    getBestLine(x, y, lineToIgnore?, whitelist?) {
        if (!Array.isArray(lineToIgnore)) {
            if (lineToIgnore instanceof Figure) {
                lineToIgnore = [lineToIgnore]
            }
            else {
                lineToIgnore = []
            }
        }
        let count = this.lines.getSize()

        for (let i = 0; i < count; i++) {
            let line = this.lines.get(i)
            if (line.isVisible() === true && line.hitTest(x, y) === true && $.inArray(line, lineToIgnore) === -1) {
                return line
            }
        }
        return null
    }

    onDragEnter(draggedDomNode) {
    }

    onDrag(draggedDomNode, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
    }

    onDragLeave(draggedDomNode) {
    }

    onDrop(droppedDomNode, x, y, shiftKey, ctrlKey) {
    }

    onDoubleClick(x, y, shiftKey, ctrlKey) {

        let figure = this.getBestFigure(x, y)


        if (figure === null) {
            figure = this.getBestLine(x, y)
        }

        this.fireEvent("dblclick", { figure: figure, x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })

        this.editPolicy.each((i, policy) => {
            policy.onDoubleClick(figure, x, y, shiftKey, ctrlKey)
        })
    }

    onClick(x, y, shiftKey, ctrlKey) {

        let figure = this.getBestFigure(x, y)

        this.fireEvent("click", {
            figure: figure,
            x: x,
            y: y,
            relX: figure !== null ? x - figure.getAbsoluteX() : 0,
            relY: figure !== null ? y - figure.getAbsoluteY() : 0,
            shiftKey: shiftKey,
            ctrlKey: ctrlKey
        })


        this.editPolicy.each((i, policy) => {
            policy.onClick(figure, x, y, shiftKey, ctrlKey)
        })
    }

    onRightMouseDown(x, y, shiftKey, ctrlKey) {
        let figure = this.getBestFigure(x, y)
        this.fireEvent("contextmenu", { figure: figure, x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })

        if (figure !== null) {
            figure.fireEvent("contextmenu", { figure: figure, x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })

            figure.onContextMenu(x, y)

            figure.editPolicy.each((i, policy) => {
                policy.onRightMouseDown(figure, x, y, shiftKey, ctrlKey)
            })
        }


        this.editPolicy.each((i, policy) => {
            policy.onRightMouseDown(figure, x, y, shiftKey, ctrlKey)
        })

    }

    onMouseWheel(wheelDelta, x, y, shiftKey, ctrlKey) {
        let returnValue = true
        this.fireEvent("wheel", { wheelDelta: wheelDelta, x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })

        this.editPolicy.each((i, policy) => {
            returnValue = policy.onMouseWheel(wheelDelta, x, y, shiftKey, ctrlKey) && returnValue
        })

        return returnValue
    }

    fireEvent(event, args?) {
        if (typeof this.eventSubscriptions[event] === 'undefined') {
            return
        }

        let subscribers = this.eventSubscriptions[event]
        for (let i = 0; i < subscribers.length; i++) {
            try {
                subscribers[i](this, args)
            }
            catch (exc) {
                console.log(exc)
                console.log(subscribers[i])
            }
        }
    }

    on(event, callback) {
        let events = event.split(" ")
        for (let i = 0; i < events.length; i++) {
            if (typeof this.eventSubscriptions[events[i]] === 'undefined') {
                this.eventSubscriptions[events[i]] = []
            }
            this.eventSubscriptions[events[i]].push(callback)
        }
        return this
    }

    off(eventOrFunction) {
        if (typeof eventOrFunction === "undefined") {
            this.eventSubscriptions = {}
        }
        else if (typeof eventOrFunction === 'string') {
            this.eventSubscriptions[eventOrFunction] = []
        }
        else {
            for (let event in this.eventSubscriptions) {
                this.eventSubscriptions[event] = this.eventSubscriptions[event].filter((callback) => {
                    return callback !== eventOrFunction
                })
            }
        }

        return this
    }

    onKeyDown(keyCode: any, ctrl: any) {
        throw new Error("Method not implemented.");
    }
}