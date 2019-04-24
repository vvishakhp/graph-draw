import { Command } from "./Command";
import { Type } from "../TypeRegistry";
@Type('CommandRotate')
export class CommandRotate extends Command {
  figure: any;
  oldAngle: any;
  newAngle: any;
  constructor(figure, angle) {
    super('Rotate')
    this.figure = figure

    this.oldAngle = figure.getRotationAngle()
    this.newAngle = angle
  }


  canExecute() {
    return this.oldAngle !== this.newAngle
  }


  execute() {
    this.redo()
  }


  undo() {
    this.rotate(this.oldAngle)
  }


  redo() {
    this.rotate(this.newAngle)
  }

  rotate(angle) {
    let w = this.figure.getWidth()
    let h = this.figure.getHeight()

    this.figure.setRotationAngle(angle)

    this.figure.setDimension(h, w)

    this.figure.portRelayoutRequired = true
  }
}