import { Type } from "../TypeRegistry";
import { Command } from "./Command";

@Type('CommandMoveLine')
export class CommandMoveLine extends Command {
  line: any;
  dx: number;
  dy: number;
  constructor(figure) {
    super('Move Line')
    this.line = figure
    this.dx = 0
    this.dy = 0
  }


  setTranslation(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  canExecute() {
    return this.dx !== 0 && this.dy !== 0
  }


  execute() {
    this.redo()
  }


  undo() {
    let _this = this
    this.line.getVertices().each(function (i, e) {
      e.translate(-_this.dx, -_this.dy)
    })
    this.line.svgPathString = null
    this.line.setPosition(this.line.getStartPosition())
  }


  redo() {
    let _this = this
    this.line.getVertices().each(function (i, e) {
      e.translate(_this.dx, _this.dy)
    })
    this.line.svgPathString = null

    this.line.setPosition(this.line.getStartPosition())
  }
}
