import { Command, Type, Canvas, Selection } from '../imports';


@Type('CommandUngroup')
export class CommandUngroup extends Command {
  group: any;
  canvas: any;
  figures: any;
  constructor(canvas: Canvas, group) {
    super('Ungroup')
    if (group instanceof Selection) {
      this.group = group.getAll().first()
    }
    else {
      this.group = group
    }

    this.canvas = canvas
    this.figures = this.group.getAssignedFigures().clone()
  }



  canExecute() {
    return !this.figures.isEmpty()
  }


  execute() {
    this.redo()
  }

  undo() {
    let _this = this
    this.figures.each((i, figure) => {
      _this.group.assignFigure(figure)
    })
    this.canvas.add(this.group)
    this.canvas.setCurrentSelection(this.group)
  }


  redo() {
    let _this = this
    this.figures.each((i, figure) => {
      _this.group.unassignFigure(figure)
    })

    this.canvas.setCurrentSelection(this.figures)
    this.canvas.remove(this.group)
  }
}