import { Point } from '../geo/Point';
import { Command } from './Command';
import { Figure } from '../Figure';
import { Canvas } from '../Canvas';


export class CommadAdd extends Command {
  figure: any;
  canvas: any;
  pos: Point;

  constructor(canvas: Canvas, figure: Figure, x: number, y: number) {
    super("Add Shape");
    this.figure = figure
    this.canvas = canvas
    this.pos = new Point(x, y)
  }

  canExecute(): boolean {
    return this.figure.getCanvas() === null;
  }

  execute() {
    this.canvas.add(this.figure, this.pos.getX(), this.pos.getY())
  }

  cancel() {
    return null;
  }
  undo() {
    this.execute()
  }
  redo() {
    this.canvas.remove(this.figure);
  }
}