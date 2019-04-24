import { Type } from "../../TypeRegistry";
import { SelectionPolicy } from "../figure/SelectionPolicy";
import { Canvas } from "../../Canvas";
import { Figure } from "../../Figure";
import { Port } from "../../Port";
import { Line } from "../../shape/basic/Line";
import { Connection } from "../../Connection";
import { CommandType } from "../../command/CommandType";
import ArrayList from "../../util/ArrayList";

@Type('SingleSelectionPolicy')
export class SingleSelectionPolicy extends SelectionPolicy {

  mouseMovedDuringMouseDown = false
  mouseDraggingElement = null
  mouseDownElement = null

  constructor() {
    super();
  }

  select(canvas: Canvas, figure: Figure, flag?: boolean) {
    if (canvas.getSelection().contains(figure)) {
      return
    }

    let oldSelection = canvas.getSelection().getPrimary()
    if (canvas.getSelection().getPrimary() !== null) {
      this.onUnselect(canvas, canvas.getSelection().getPrimary())
    }

    if (figure !== null) {
      figure.select(true) // primary selection
    }

    canvas.getSelection().setPrimary(figure)


    if (oldSelection !== figure) {
      canvas.fireEvent("select", { figure: figure, selection: canvas.getSelection() })
    }

  }

  onMouseDown(canvas: Canvas, x: number, y: number, shiftKey?: boolean, ctrlKey?: boolean) {
    this.mouseMovedDuringMouseDown = false
    let canDragStart = true;

    let figure = canvas.getBestFigure(x, y);
    while (figure !== null) {
      let delegate = figure.getSelectionAdapter()();
      if (delegate === figure) {
        break
      }
      figure = delegate
    }

    if (figure instanceof Port) {
      return// silently
    }

    if (figure !== null && figure.isDraggable()) {
      canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY(), shiftKey, ctrlKey)
      // Element send a veto about the drag&drop operation
      this.mouseDraggingElement = canDragStart === false ? null : figure
    }

    this.mouseDownElement = figure
    if (this.mouseDownElement !== null) {
      this.mouseDownElement.fireEvent("mousedown", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })
    }

    if (figure !== canvas.getSelection().getPrimary() && figure !== null && figure.isSelectable() === true) {
      this.select(canvas, figure)

      // it's a line
      if (figure instanceof Line) {
        // you can move a line with Drag&Drop...but not a connection.
        // A Connection is fixed linked with the corresponding ports.
        //
        if (!(figure instanceof Connection)) {
          canvas.draggingLineCommand = figure.createCommand(new CommandType(CommandType.MOVE))
          if (canvas.draggingLineCommand !== null) {
            canvas.draggingLine = figure
          }
        }
      }

      else if (canDragStart === false) {
        figure.unselect()
      }
    }

  }

  onMouseDrag(canvas: Canvas, dx: number, dy: number, dx2: number, dy2: number, shiftKey: boolean, ctrlKey: boolean) {
    this.mouseMovedDuringMouseDown = true
    if (this.mouseDraggingElement !== null) {

      let sel = canvas.getSelection()
      if (!sel.contains(this.mouseDraggingElement)) {
        this.mouseDraggingElement.onDrag(dx, dy, dx2, dy2, shiftKey, ctrlKey)
      }
      else {
        sel.each(function (i, figure) {
          figure.onDrag(dx, dy, dx2, dy2, shiftKey, ctrlKey)
        })
      }

      let p = canvas.fromDocumentToCanvasCoordinate(canvas.mouseDownX + (dx / canvas.zoomFactor), canvas.mouseDownY + (dy / canvas.zoomFactor))
      let target = canvas.getBestFigure(p.getX(), p.getY(), this.mouseDraggingElement)

      if (target !== canvas.currentDropTarget) {
        if (canvas.currentDropTarget !== null) {
          canvas.currentDropTarget.onDragLeave(this.mouseDraggingElement)
          canvas.currentDropTarget.fireEvent("dragLeave", { draggingElement: this.mouseDraggingElement })
          canvas.currentDropTarget = null
        }
        if (target !== null) {
          canvas.currentDropTarget = target.delegateTarget(this.mouseDraggingElement)

          if (canvas.currentDropTarget !== null) {
            canvas.currentDropTarget.onDragEnter(this.mouseDraggingElement) // legacy
            canvas.currentDropTarget.fireEvent("dragEnter", { draggingElement: this.mouseDraggingElement })
          }
        }
      }
    }

    else if (this.mouseDownElement !== null && !(this.mouseDownElement instanceof Connection)) {
      if (this.mouseDownElement.panningDelegate !== null) {
        this.mouseDownElement.panningDelegate.fireEvent("panning", {
          dx: dx,
          dy: dy,
          dx2: dx2,
          dy2: dy2,
          shiftKey: shiftKey,
          ctrlKey: ctrlKey
        })
        this.mouseDownElement.panningDelegate.onPanning(dx, dy, dx2, dy2, shiftKey, ctrlKey)
      }
      else {
        this.mouseDownElement.fireEvent("panning", {
          dx: dx,
          dy: dy,
          dx2: dx2,
          dy2: dy2,
          shiftKey: shiftKey,
          ctrlKey: ctrlKey
        })
        this.mouseDownElement.onPanning(dx, dy, dx2, dy2, shiftKey, ctrlKey)
      }
    }
  }

  onMouseUp(canvas: Canvas, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
    if (this.mouseDraggingElement !== null) {
      let redrawConnection = new ArrayList<Line>()
      if (this.mouseDraggingElement instanceof Node) {

        canvas.lineIntersections.each(function (i, inter) {
          if (!redrawConnection.contains(inter.line)) redrawConnection.add(inter.line)
          if (!redrawConnection.contains(inter.other)) redrawConnection.add(inter.other)
        })
      }


      canvas.getCommandStack().startTransaction()

      let sel = canvas.getSelection().getAll()
      if (!sel.contains(this.mouseDraggingElement)) {
        this.mouseDraggingElement.onDragEnd(x, y, shiftKey, ctrlKey)
      }
      else {
        canvas.getSelection().getAll().each(function (i, figure) {
          figure.onDragEnd(x, y, shiftKey, ctrlKey)
        })
      }

      if (canvas.currentDropTarget !== null && !this.mouseDraggingElement.isResizeHandle) {
        this.mouseDraggingElement.onDrop(canvas.currentDropTarget, x, y, shiftKey, ctrlKey)
        canvas.currentDropTarget.onDragLeave(this.mouseDraggingElement)
        canvas.currentDropTarget.fireEvent("dragLeave", { draggingElement: this.mouseDraggingElement })
        canvas.currentDropTarget.onCatch(this.mouseDraggingElement, x, y, shiftKey, ctrlKey)
        canvas.currentDropTarget = null
      }

      canvas.getCommandStack().commitTransaction()

      if (this.mouseDraggingElement instanceof Node) {
        canvas.lineIntersections.each(function (i, inter) {
          if (!redrawConnection.contains(inter.line)) redrawConnection.add(inter.line)
          if (!redrawConnection.contains(inter.other)) redrawConnection.add(inter.other)
        })
        redrawConnection.each(function (i, line) {
          line.svgPathString = null
          line.repaint({});
        })
      }

      this.mouseDraggingElement = null
    }

    else if (this.mouseDownElement !== null && !(this.mouseDownElement instanceof Connection)) {
      if (this.mouseDownElement.panningDelegate !== null) {
        this.mouseDownElement.panningDelegate.fireEvent("panningEnd")
        this.mouseDownElement.panningDelegate.onPanningEnd()
      }
      else {
        this.mouseDownElement.fireEvent("panningEnd")
        this.mouseDownElement.onPanningEnd()
      }
    }

    // Reset the current selection if the user click in the blank canvas.
    // Don't reset the selection if the user pan the canvas
    //
    if (this.mouseDownElement === null && this.mouseMovedDuringMouseDown === false) {
      this.select(canvas, null)
    }

    if (this.mouseDownElement !== null) {
      this.mouseDownElement.fireEvent("mouseup", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey })
    }

    this.mouseDownElement = null
    this.mouseMovedDuringMouseDown = false
  }


  onClick(figure: Figure, mouseX: number, mouseY: number, shiftKey?: boolean, ctrlKey?: boolean) {
    if (figure !== null) {
      figure.fireEvent("click", {
        figure: figure,
        x: mouseX,
        y: mouseY,
        relX: mouseX - figure.getAbsoluteX(),
        relY: mouseY - figure.getAbsoluteY(),
        shiftKey: shiftKey,
        ctrlKey: ctrlKey
      })

      figure.onClick()
    }
  }

  onDoubleClick(figure: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) {
    if (figure !== null) {
      figure.fireEvent("dblclick", { x: mouseX, y: mouseY, shiftKey: shiftKey, ctrlKey: ctrlKey })
      figure.onDoubleClick()
    }
  }

}
