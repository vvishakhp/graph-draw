import { CanvasPolicy } from "./CanvasPolicy";
import { Type } from "../../TypeRegistry";
import { Canvas } from "../../Canvas";

@Type('KeyboardPolicy')
export class KeyboardPolicy extends CanvasPolicy {
  onKeyUp(canvas: Canvas, keyCode: number, shiftKey: boolean, ctrlKey: boolean) {

  }

  onKeyDown(canvas: Canvas, keyCode: number, shiftKey: boolean, ctrlKey: boolean) {

  }
}
