import { Command } from "./Command";
import { Figure } from "../Figure";
import { Rectangle } from "../geo/Rectangle";

export class CommandBoundingBox extends Command {

  figure: Figure;
  oldBoundingBox: any;
  newBoundingBox: Rectangle;


  constructor(figure: Figure, boundingBox: Rectangle) {
    super("Resize Shape");
    this.figure = figure
    this.oldBoundingBox = this.figure.getBoundingBox()
    this.newBoundingBox = boundingBox
  }


  canExecute() {
    return !this.oldBoundingBox.equals(this.newBoundingBox)
  }

  execute() {
    this.redo()
  }

  undo() {
    this.figure.setBoundingBox(this.oldBoundingBox)
  }


  redo() {
    this.figure.setBoundingBox(this.newBoundingBox)
  }

  cancel() {
    return null;
  }
}
