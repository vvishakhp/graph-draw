import { PortLocator } from "./PortLocator";
import { Figure } from "../../Figure";
import { Type } from "../../TypeRegistry";

@Type('XYAbsPortLocator');
export class XYAbsPortLocator extends PortLocator {

  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    super();
    this.x = x
    this.y = y
  }

  relocate(index: number, figure: Figure) {
    this.applyConsiderRotation(figure, this.x, this.y)
  }
}
