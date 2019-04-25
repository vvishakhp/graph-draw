import { Command, Type, Figure } from '../imports';


@Type('CommandMove')
export class CommandMove extends Command {


  private figure: Figure;
  private oldX: number;
  private oldY: number;
  private newX: number;
  private newY: number;


  constructor(figure: Figure, x: number = undefined, y: number = undefined) {
    super('Move shape');
    this.figure = figure
    if (typeof x === "undefined") {
      this.oldX = figure.getX()
      this.oldY = figure.getY()
    }
    else {
      this.oldX = x
      this.oldY = y
    }
  }


  setPosition(x: number, y: number) {
    this.newX = x;
    this.newY = y;
  }

  canExecute() {
    return this.newX !== this.oldX || this.newY !== this.oldY
  }


  execute() {
    this.redo()
  }

  undo() {
    this.figure.setPosition(this.oldX, this.oldY)
  }

  redo() {
    this.figure.setPosition(this.newX, this.newY)
  }
}

