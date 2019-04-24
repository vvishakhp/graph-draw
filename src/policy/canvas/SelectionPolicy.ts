import { Type } from "../../TypeRegistry";
import { Canvas } from "../../Canvas";
import { Figure } from "../../Figure";
import { CanvasPolicy } from "./CanvasPolicy";

@Type('CanvasSelectionPolicy')
export class CanvasSelectionPolicy extends CanvasPolicy {

  constructor(attr, setter, getter) {
    super(attr, setter, getter);
  }

  select(canvas: Canvas, figure: Figure) {

  }

  unselect(canvas: Canvas, figure: Figure) {
    canvas.getSelection().remove(figure)
    figure.unselect()
    canvas.fireEvent("unselect", { figure: figure })
  }
}





