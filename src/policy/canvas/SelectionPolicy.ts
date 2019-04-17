import { CanvasPolicy } from "./CanvasPolicy";
import { Type } from "../../TypeRegistry";
import { Canvas } from "../../Canvas";
import { Figure } from "../../Figure";

@Type('SelectionPolicy')
export class SelectionPolicy extends CanvasPolicy {
  select(canvas: Canvas, figure: Figure) {

  }

  unselect(canvas: Canvas, figure: Figure) {
    canvas.getSelection().remove(figure)
    figure.unselect()
    canvas.fireEvent("unselect", { figure: figure })
  }
}





