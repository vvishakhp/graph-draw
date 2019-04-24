import { Canvas } from "../../Canvas";
import { Port } from "../../Port";
import { Figure } from "../../Figure";
import { DragDropEditPolicy } from "../figure/DragDropEditPolicy";

export class PortFeedbackPolicy extends DragDropEditPolicy {
  onHoverEnter(canvas: Canvas, draggedFigure: Port, hoverFigure: Figure) {

  }

  onHoverLeave(canvas: Canvas, draggedFigure: Port, hoverFigure: Figure) {

  }
}