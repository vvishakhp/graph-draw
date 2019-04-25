import { Type, DirectRouter, ConnectionCreatePolicy, Port, Canvas, PortFeedbackPolicy, DragDropEditPolicy, CommandType } from '../../imports';


@Type('DragConnectionCreatePolicy')
export class DragConnectionCreatePolicy extends ConnectionCreatePolicy {

    mouseDraggingElement = null;
    currentDropTarget = null;
    currentTarget = null;
    mouseDownElement: any;


    onMouseDown(canvas, x, y, shiftKey, ctrlKey) {

        var port = canvas.getBestFigure(x, y);



        if (port === null) {
            return;
        }


        if (!(port instanceof Port)) {
            return;
        }


        if (port.isInDragDrop === true) {
            port.onDragEnd(x, y, shiftKey, ctrlKey);
            port.isInDragDrop = false;
        }

        if (port.isDraggable()) {
            var canDragStart = port.onDragStart(x - port.getAbsoluteX(), y - port.getAbsoluteY(), shiftKey, ctrlKey);
            if (canDragStart) {
                port.fireEvent("dragstart", { x: x - port.getAbsoluteX(), y: y - port.getAbsoluteY(), shiftKey: shiftKey, ctrlKey: ctrlKey });
            }

            // Element send a veto about the drag&drop operation
            this.mouseDraggingElement = canDragStart === false ? null : port;
            this.mouseDownElement = port;
        }
    }

    onMouseDrag(canvas: Canvas, dx: number, dy: number, dx2?: any, dy2?: any, shiftKey?: any, ctrlKey?: any) {
        try {
            if (this.mouseDraggingElement !== null) {
                var de = this.mouseDraggingElement;
                var ct = this.currentTarget;

                de.isInDragDrop = true;
                de.onDrag(dx, dy, dx2, dy2, shiftKey, ctrlKey);

                var target = canvas.getBestFigure(de.getAbsoluteX(), de.getAbsoluteY(), de);

                // the hovering element has been changed
                if (target !== ct) {
                    if (ct !== null) {
                        ct.onDragLeave(de);
                        ct.fireEvent("dragLeave", { draggingElement: de });
                        de.editPolicy.each((i, e) => {
                            if (e instanceof PortFeedbackPolicy) {
                                e.onHoverLeave(canvas, de, ct);
                            }
                        });
                    }

                    // possible hoverEnter event
                    //
                    if (target !== null) {
                        this.currentTarget = ct = target.delegateTarget(de);
                        if (ct !== null) {
                            ct.onDragEnter(de); // legacy
                            ct.fireEvent("dragEnter", { draggingElement: de });
                            de.editPolicy.each((i, e) => {
                                if (e instanceof PortFeedbackPolicy) {
                                    e.onHoverEnter(canvas, de, ct);
                                }
                            });
                        }
                    }
                    else {
                        this.currentTarget = null;
                    }
                }


                var p = canvas.fromDocumentToCanvasCoordinate(canvas.mouseDownX + (dx / canvas.zoomFactor), canvas.mouseDownY + (dy / canvas.zoomFactor));
                var target = canvas.getBestFigure(p.getX(), p.getY(), this.mouseDraggingElement);

                if (target !== this.currentDropTarget) {
                    if (this.currentDropTarget !== null) {
                        this.currentDropTarget.onDragLeave(this.mouseDraggingElement);
                        this.currentDropTarget.fireEvent("dragLeave", { draggingElement: this.mouseDraggingElement });
                        this.currentDropTarget = null;
                    }
                    if (target !== null) {
                        this.currentDropTarget = target.delegateTarget(this.mouseDraggingElement);
                        // inform all listener that the element has accept the dragEnter event
                        //
                        if (this.currentDropTarget !== null) {
                            this.currentDropTarget.onDragEnter(this.mouseDraggingElement); // legacy
                            this.currentDropTarget.fireEvent("dragEnter", { draggingElement: this.mouseDraggingElement });
                        }
                    }
                }
            }
        }
        catch (exc) {
            console.log(exc);
        }
        return null;
    }


    onMouseUp(canvas, x, y, shiftKey, ctrlKey) {
        if (this.mouseDraggingElement !== null) {

            var de = this.mouseDraggingElement;
            var ct = this.currentTarget;
            // start CommandStack transaction
            canvas.getCommandStack().startTransaction();

            de.onDragEnd(x, y, shiftKey, ctrlKey);
            // notify all installed policies
            //
            if (ct) {
                de.editPolicy.each((i, e) => {
                    if (e instanceof PortFeedbackPolicy) {
                        e.onHoverLeave(canvas, de, ct);
                    }
                });
            }

            de.editPolicy.each((i, e) => {
                if (e instanceof DragDropEditPolicy) {
                    e.onDragEnd(canvas, de, x, y, shiftKey, ctrlKey);
                }
            });

            // Reset the drag&drop flyover information
            //
            this.currentTarget = null;
            de.isInDragDrop = false;

            // fire an event
            // @since 5.3.3
            de.fireEvent("dragend", { x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey });


            // check if we drop the port onto a valid
            // drop target and create a connection if possible
            //
            if (this.currentDropTarget !== null) {
                this.mouseDraggingElement.onDrop(this.currentDropTarget, x, y, shiftKey, ctrlKey);

                this.currentDropTarget.onDragLeave(this.mouseDraggingElement);
                this.currentDropTarget.fireEvent("dragLeave", { draggingElement: this.mouseDraggingElement });

                // Ports accepts only Ports as DropTarget
                //
                if (this.currentDropTarget instanceof Port) {
                    var request = new CommandType(CommandType.CONNECT);
                    (request as any).source = this.currentDropTarget;
                    (request as any).target = this.mouseDraggingElement;
                    var command = this.mouseDraggingElement.createCommand(request);

                    if (command !== null) {
                        command.setConnection(this.createConnection());
                        canvas.getCommandStack().execute(command);
                        this.currentDropTarget.onCatch(this.mouseDraggingElement, x, y, shiftKey, ctrlKey);
                    }
                }
            }

            // end command stack trans
            canvas.getCommandStack().commitTransaction();
            this.currentDropTarget = null;
            this.mouseDraggingElement = null;
        }
    }


    createConnection() {
        var connection = super.createConnection();
        connection.setRouter(new DirectRouter());
        return connection;
    }
}