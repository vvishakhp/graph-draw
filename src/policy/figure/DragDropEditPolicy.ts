import { FigureEditPolicy } from "./FigureEditPolicy";
import { Figure } from "../../Figure";
import { Canvas } from "../../Canvas";
import { Rectangle } from "../../geo/Rectangle";
import { Point } from "../../geo/Point";

export class DragDropEditPolicy extends FigureEditPolicy {
  moveCallback(emitter, event) {
    this.moved(emitter.getCanvas(), emitter)
  }

  onInstall(host: Figure | Canvas) {
    super.onInstall(host);
    host.on("move", this.moveCallback)
  }

  onUninstall(host: Canvas | Figure) {
    super.onUninstall(host);
    host.off(this.moveCallback);
  }

  onDragStart(canvas: Canvas, figure: Figure, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
    figure.shape.attr({
      cursor: "move"
    })

    if (figure.isMoving === true) {
      figure.setAlpha(figure.originalAlpha)
    }

    figure.originalAlpha = figure.getAlpha()
    figure.isMoving = false

    // return value since 6.1.0
    return true
  }


  onDrag(canvas, figure) {
    // enable the alpha blending of the first real move of the object
    //
    if (figure.isMoving === false) {
      figure.isMoving = true
      figure.setAlpha(figure.originalAlpha * 0.4)
    }
  }

  onDragEnd(canvas, figure, x, y, shiftKey, ctrlKey) {
    figure.shape.attr({
      cursor: "default"
    })
    figure.isMoving = false
    figure.setAlpha(figure.originalAlpha)
  }

  adjustPosition(figure, x, y) {
    // do nothing per default implementation
    if (x instanceof Point) {
      return x
    }

    return new Point(x, y)
  }

  adjustDimension(figure, w, h) {
    return new Rectangle(0, 0, w, h)
  }

  moved(canvas, figure) { }
}