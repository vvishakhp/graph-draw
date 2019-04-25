import { Type, Command, Group, Selection } from '../imports';

@Type('CommandGroup')
export class CommandGroup extends Command {
  figures: any;
  canvas: any;
  group: any;
  constructor(canvas, figures: Selection) {
    super('Group items');

    if (figures instanceof Selection) {
      this.figures = figures.getAll()
    }
    else {
      this.figures = figures
    }

    this.figures.grep((figure) => {
      return figure.getComposite() === null
    })

    this.canvas = canvas
    this.group = new Group({}, {}, {})

  }

  canExecute() {
    return !this.figures.isEmpty()
  }

  execute() {
    this.redo();
  }

  undo() {
    let _this = this
    this.figures.each((i, figure) => {
      _this.group.unassignFigure(figure)
    })

    this.canvas.remove(this.group)
    this.canvas.setCurrentSelection(this.figures)
  }

  redo() {
    let _this = this
    this.figures.each((i, figure) => {
      _this.group.assignFigure(figure)
    })

    this.canvas.add(this.group)
    this.canvas.setCurrentSelection(this.group)
  }


}
