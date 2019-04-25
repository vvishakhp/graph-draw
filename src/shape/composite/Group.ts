import { Type, StrongComposite, extend, CommandType, CommandDeleteGroup } from '../../imports';


@Type('Group')
export class Group extends StrongComposite {
  stickFigures: boolean;
  constructor(attr, setter, getter) {
    super(extend({ bgColor: null, color: null, resizeable: false }, attr), setter, getter)
    this.stickFigures = false
  }



  isMemberSelectable(figure, selectable) {
    return false
  }

  isMemberDraggable(figure, draggable) {
    return false
  }


  setPosition(x, y) {
    let oldX = this.x
    let oldY = this.y


    super.setPosition(x, y);

    let dx = this.x - oldX
    let dy = this.y - oldY

    if (dx === 0 && dy === 0) {
      return this
    }

    if (this.stickFigures === false) {
      this.assignedFigures.each((i, figure) => {
        figure.translate(dx, dy)
      })
    }

    return this
  }


  assignFigure(figure) {
    if (!this.assignedFigures.contains(figure)) {
      let _this = this
      this.stickFigures = true
      if (this.assignedFigures.isEmpty() === true) {
        this.setBoundingBox(figure.getBoundingBox())
      }
      else {
        this.setBoundingBox(this.getBoundingBox().merge(figure.getBoundingBox()))
      }
      this.assignedFigures.add(figure)
      figure.setComposite(this)
      figure.setSelectionAdapter(() => {
        return _this
      })
      this.stickFigures = false
    }
    return this
  }


  unassignFigure(figure) {
    if (this.assignedFigures.contains(figure)) {
      this.stickFigures = true
      figure.setComposite(null)
      figure.setSelectionAdapter(null)
      this.assignedFigures.remove(figure)
      if (!this.assignedFigures.isEmpty()) {
        let box = this.assignedFigures.first().getBoundingBox()
        this.assignedFigures.each((i, figure) => {
          box.merge(figure.getBoundingBox())
        })
        this.setBoundingBox(box)
      }
      this.stickFigures = false
    }

    return this
  }


  createCommand(request) {
    if (request === null) {
      return null
    }

    if (request.getPolicy() === CommandType.DELETE) {
      if (!this.isDeleteable()) {
        return null
      }
      return new CommandDeleteGroup(this)
    }

    return super.createCommand(request)
  }
}





