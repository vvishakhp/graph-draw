import { Type, Command, Point, LineShape } from '../imports';

export class CommandAddVertex extends Command {

  line: any;
  index: number;
  newPoint: Point;
  constructor(line: LineShape, index: number, x: number, y: number) {
    super('Add Vertex');
    this.line = line;
    this.index = index
    this.newPoint = new Point(x, y)
  }

  canExecute() {
    return true;
  }

  execute() {
    this.redo();
  }

  cancel() {
    return null;
  }

  undo() {
    this.line.removeVertexAt(this.index);
  }

  redo() {
    this.line.insertVertexAt(this.index, this.newPoint.getX, this.newPoint.getY())
  }
}
