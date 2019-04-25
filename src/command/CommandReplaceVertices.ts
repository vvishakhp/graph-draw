import { Command, Type } from '../imports';

@Type('CommandReplaceVertices')
export class CommandReplaceVertices extends Command {
  line: any;
  originalVertices: any;
  newVertices: any;
  constructor(line, originalVertices, newVertices) {
    super('Add segment');

    this.line = line
    this.originalVertices = originalVertices
    this.newVertices = newVertices
  }

  canExecute() {
    return true;
  }


  execute() {
    this.redo()
  }


  undo() {
    this.line.setVertices(this.originalVertices)
  }


  redo() {
    this.line.setVertices(this.newVertices)
  }
}
