import { Rectangle } from "../../geo/Rectangle";
import { Figure } from "../../Figure";
import { SingleSelectionPolicy } from "./SingleSelectionPolicy";
import { Canvas } from "../../Canvas";
import { Connection } from "../../Connection";
import { Type } from "../../TypeRegistry";
import { Port } from "../../Port";
import { CommandType } from "../../command/CommandType";
import { Line } from "../../shape/basic/Line";
import { Rectangle as RectangleShape } from '../../shape/basic/Rectangle';

@Type('BoundingboxSelectionPolicy')
export class BoundingboxSelectionPolicy extends SingleSelectionPolicy {
  isInsideMode: (rect1: Rectangle, rect2: Rectangle) => boolean;
  intersectsMode: (rect1: Rectangle, rect2: Rectangle) => boolean;
  decision: (rect1: Rectangle, rect2: Rectangle) => boolean;
  x: number = 0;
  y: number = 0;
  canDrawBoundingBox: boolean;

  boundingBoxFigure2: RectangleShape;
  boundingBoxFigure1: RectangleShape;


  constructor() {
    super();

    this.isInsideMode = (rect1, rect2) => rect1.isInside(rect2)
    this.intersectsMode = (rect1, rect2) => rect1.intersects(rect2)
    this.decision = this.isInsideMode


    this.boundingBoxFigure1 = null


    this.canDrawBoundingBox = false
  }


  select(canvas: Canvas, figure: Figure, flag?: boolean) {
    if (canvas.getSelection().contains(figure)) {
      return // nothing to to
    }

    let oldSelection = canvas.getSelection().getPrimary()

    if (figure !== null) {
      figure.select(true) // primary selection
    }

    if (oldSelection !== figure) {
      canvas.getSelection().setPrimary(figure)


      canvas.fireEvent("select", {
        figure: figure,
        selection: canvas.getSelection()
      })
    }


    let selection = canvas.getSelection()
    canvas.getLines().each((i, line) => {
      if (line instanceof Connection) {
        if (selection.contains(line.getSource().getRoot()) && selection.contains(line.getTarget().getRoot())) {
          this.select(canvas, line, false)
        }
      }
    })
  }

  setDecisionMode(useIntersectionMode) {
    if (useIntersectionMode === true) {
      this.decision = this.intersectsMode
    } else {
      this.decision = this.isInsideMode
    }

    return this
  }


  onMouseDown(canvas, x, y, shiftKey, ctrlKey) {
    try {
      this.x = x
      this.y = y

      let currentSelection = canvas.getSelection().getAll()


      this.mouseMovedDuringMouseDown = false
      let canDragStart = true

      this.canDrawBoundingBox = false

      let figure = canvas.getBestFigure(x, y)


      while (figure !== null) {
        let delegated = figure.getSelectionAdapter()()
        if (delegated === figure) {
          break
        }
        figure = delegated
      }

      if (figure instanceof Port) {
        return // silently
      }

      this.canDrawBoundingBox = true

      if (figure !== null && figure.isDraggable()) {
        canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY(), shiftKey, ctrlKey)
        this.mouseDraggingElement = canDragStart === false ? null : figure
      }

      this.mouseDownElement = figure

      if (this.mouseDownElement !== null) {
        this.mouseDownElement.fireEvent("mousedown", {
          x: x,
          y: y,
          shiftKey: shiftKey,
          ctrlKey: ctrlKey
        })
      }

      if (shiftKey === false) {
        if (this.mouseDownElement !== null && this.mouseDownElement.isResizeHandle === false && !currentSelection.contains(this.mouseDownElement)) {
          currentSelection.each((i, figure) => {
            this.onUnselect(canvas, figure)
          })
        }
      }

      if (figure !== canvas.getSelection().getPrimary() && figure !== null && figure.isSelectable() === true) {
        this.select(canvas, figure)


        if (figure instanceof Line) {

          if (!(figure instanceof Connection)) {
            canvas.draggingLineCommand = figure.createCommand(new CommandType(CommandType.MOVE))
            if (canvas.draggingLineCommand !== null) {
              canvas.draggingLine = figure
            }
          }
        } else if (canDragStart === false) {
          figure.unselect()
        }
      }

      if (this.mouseDownElement !== null && this.mouseDownElement.isResizeHandle === false) {
        currentSelection = canvas.getSelection().getAll()
        currentSelection.each((i, figure) => {
          let fakeDragX = 1
          let fakeDragY = 1

          let handleRect = figure.getHandleBBox()
          if (handleRect !== null) {
            handleRect.translate(figure.getAbsolutePosition().scale(-1))
            fakeDragX = handleRect.x + 1
            fakeDragY = handleRect.y + 1
          }

          let canDragStart = figure.onDragStart(fakeDragX, fakeDragY, shiftKey, ctrlKey, true /*fakeFlag*/)

          if (figure instanceof Line) {
            // no special handling
          } else if (canDragStart === false) {
            this.onUnselect(canvas, figure)
          }
        })
      }
    } catch (exc) {
      console.log(exc)
      throw exc
    }
  }

  onMouseDrag(canvas: Canvas, dx: number, dy: number, dx2: number, dy2: number, shiftKey?: boolean, ctrlKey?: boolean) {
    if (this.canDrawBoundingBox === false) {
      return
    }

    try {
      super.onMouseDrag(canvas, dx, dy, dx2, dy2, shiftKey, ctrlKey)

      if (this.mouseDraggingElement === null && this.mouseDownElement === null && this.boundingBoxFigure1 === null) {
        this.boundingBoxFigure1 = new RectangleShape({
          width: 1,
          height: 1,
          x: this.x,
          y: this.y,
          bgColor: "#d4d1d4",
          alpha: 0.1
        }, {}, {});
        this.boundingBoxFigure1.setCanvas(canvas)

        this.boundingBoxFigure2 = new RectangleShape({
          width: 1,
          height: 1,
          x: this.x,
          y: this.y,
          dash: "--..",
          stroke: 0.5,
          color: "#37a8ff",
          bgColor: null
        }, {}, {})
        this.boundingBoxFigure2.setCanvas(canvas)
      }
      let abs = Math.abs
      if (this.boundingBoxFigure1 !== null) {
        this.boundingBoxFigure1.setDimension(abs(dx), abs(dy))
        this.boundingBoxFigure1.setPosition(this.x + Math.min(0, dx), this.y + Math.min(0, dy))
        this.boundingBoxFigure2.setDimension(abs(dx), abs(dy))
        this.boundingBoxFigure2.setPosition(this.x + Math.min(0, dx), this.y + Math.min(0, dy))
      }
    } catch (exc) {
      console.log(exc)
    }
  }

  onMouseUp(canvas: Canvas, x: number, y: number, shiftKey?: boolean, ctrlKey?: boolean) {
    try {

      if (this.mouseDownElement === null) {
        canvas.getSelection().getAll().each((i, figure) => {
          this.onUnselect(canvas, figure)
        })
      } else if (this.mouseDownElement instanceof ResizeHandle || (this.mouseDownElement instanceof LineResizeHandle)) {

      }

      else if (this.mouseDownElement !== null && this.mouseMovedDuringMouseDown === false) {
        let sel = canvas.getSelection().getAll()
        if (!sel.contains(this.mouseDownElement)) {
          canvas.getSelection().getAll().each((i, figure) => {
            this.onUnselect(canvas, figure)
          })
        }
      }
      super.onMouseUp(canvas, x, y, shiftKey, ctrlKey)

      if (this.boundingBoxFigure1 !== null) {

        let selectionRect = this.boundingBoxFigure1.getBoundingBox()
        canvas.getFigures().each((i, figure) => {
          if (figure.isSelectable() === true && this.decision(figure.getBoundingBox(), selectionRect)) {
            let fakeDragX = 1
            let fakeDragY = 1

            let handleRect = figure.getHandleBBox()
            if (handleRect !== null) {
              handleRect.translate(figure.getAbsolutePosition().scale(-1))
              fakeDragX = handleRect.x + 1
              fakeDragY = handleRect.y + 1
            }
            let canDragStart = figure.onDragStart(fakeDragX, fakeDragY, shiftKey, ctrlKey)
            if (canDragStart === true) {
              this.select(canvas, figure)
            }
          }
        })

        this.boundingBoxFigure1.setCanvas(null)
        this.boundingBoxFigure1 = null
        this.boundingBoxFigure2.setCanvas(null)
        this.boundingBoxFigure2 = null
      }
    } catch (exc) {
      console.log(exc)
      debugger
    }
  }
}