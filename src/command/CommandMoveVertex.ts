import { Command, Type, Point } from '../imports';


@Type('CommandMoveVertex')
export class CommandMoveVertex extends Command {
  line: any;
  index: number;
  newPoint: any;
  origPoint: any;
  constructor(line) {
    super('CommandMoveVertex')

    this.line = line
    this.index = -1
    this.newPoint = null
  }

  setIndex(index) {
    this.index = index
    this.origPoint = this.line.getVertices().get(this.index).clone()
  }

  updatePosition(x, y) {
    this.newPoint = new Point(x, y)
  }

  canExecute() {
    return this.index !== -1 && this.newPoint !== null
  }

  execute() {
    this.redo()
  }

  undo() {
    this.line.setVertex(this.index, this.origPoint.x, this.origPoint.y)
  }


  redo() {
    this.line.setVertex(this.index, this.newPoint.x, this.newPoint.y)
  }
}