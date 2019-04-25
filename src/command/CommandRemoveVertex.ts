import { Command, Type } from '../imports';

@Type('CommandRemoveVertex')
export class CommandRemoveVertex extends Command {
  line: any;
  index: any;
  oldPoint: any;
  constructor(line, index) {
    super('Remove Vertex')

    this.line = line
    this.index = index
    this.oldPoint = line.getVertices().get(index).clone()
  }

  canExecute() {

    return true
  }


  execute() {
    this.redo()
  }


  undo() {
    this.line.insertVertexAt(this.index, this.oldPoint.x, this.oldPoint.y)
  }


  redo() {
    this.line.removeVertexAt(this.index)
  }
}