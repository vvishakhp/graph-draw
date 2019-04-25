import { Command, Type } from '../imports';


@Type('CommandMoveVertices')
export class CommandMoveVertices extends Command {
  line: any;
  oldVertices: any;
  newVertices: any;
  constructor(line) {
    super('Move vertices')

    this.line = line
    this.oldVertices = line.getVertices().clone(true)
    this.newVertices = null
  }


  updateVertices(newVertices) {
    this.newVertices = newVertices
  }


  canExecute() {
    return this.newVertices !== null
  }

  execute() {
    this.redo()
  }


  undo() {
    this.line.setVertices(this.oldVertices)
  }


  redo() {
    this.line.setVertices(this.newVertices)
  }
}
