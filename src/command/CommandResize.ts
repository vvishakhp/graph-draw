import { Command } from "./Command";
import { Type } from "../TypeRegistry";
import { Figure } from "../Figure";

@Type('CommandResize')
export class CommandResize extends Command {

  figure: Figure;
  oldWidth: number;
  oldHeight: number;
  newWidth: number;
  newHeight: number;

  constructor(figure, width?: number, height?: number) {
    super("Resize Figure")
    this.figure = figure

    if (typeof width === "undefined") {
      this.oldWidth = figure.getWidth()
      this.oldHeight = figure.getHeight()
    }
    else {
      this.oldWidth = width
      this.oldHeight = height
    }
  }


  setDimension(width, height) {
    this.newWidth = width | 0
    this.newHeight = height | 0
  }


  canExecute() {

    return this.newWidth !== this.oldWidth || this.newHeight !== this.oldHeight
  }


  execute() {
    this.redo()
  }


  undo() {
    this.figure.setDimension(this.oldWidth, this.oldHeight)
  }

  redo() {
    this.figure.setDimension(this.newWidth, this.newHeight)
  }
}