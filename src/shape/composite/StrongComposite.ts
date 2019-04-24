import { Type, ArrayList, Figure, Composite } from '../../imports';

@Type('StrongComposite')
export class StrongComposite extends Composite {

  assignedFigures: ArrayList<Figure>;

  contains(containedFigure) {
    for (let i = 0, len = this.assignedFigures.getSize(); i < len; i++) {
      let child = this.assignedFigures.get(i)
      if (child === containedFigure || child.contains(containedFigure)) {
        return true
      }
    }
    return super.contains(containedFigure)
  }

  assignFigure(figure) {
    return this
  }


  unassignFigure(figure) {
    return this
  }


  getAssignedFigures() {
    return this.assignedFigures
  }



  onDrop(dropTarget, x, y, shiftKey, ctrlKey) {
  }


  onCatch(droppedFigure, x, y, shiftKey, ctrlKey) {
  }

  toFront(figure: Figure) {
    super.toFront(figure);

    let figures = this.getAssignedFigures().clone()
    figures.sort((a, b) => {
      // return 1  if a before b
      // return -1 if b before a
      return a.getZOrder() > b.getZOrder() ? -1 : 1
    })
    let _this = this
    figures.each(function (i, f) {
      f.toFront(_this)
    })

    return this
  }


  toBack(figure) {
    super.toBack(figure)

    let figures = this.getAssignedFigures().clone()
    figures.sort(function (a, b) {
      return a.getZOrder() > b.getZOrder() ? -1 : 1
    })

    let _this = this
    figures.each(function (i, f) {
      f.toBack(_this)
    })

    return this
  }
}



