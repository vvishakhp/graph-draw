import { Type, SetFigure, extend } from '../../imports';

@Type('Composite')
export class Composite extends SetFigure {
  constructor(attr, setter, getter) {
    super(extend({ stroke: 1, "color": "#f0f0f0" }, attr), setter, getter);
  }


  onDoubleClick() {
  }


  isMemberSelectable(figure, selectable) {
    return selectable
  }


  isMemberDraggable(figure, draggable) {
    return draggable
  }



  setCanvas(canvas) {
    super.setCanvas(canvas)

    if (canvas !== null) {
      this.toBack(null)
    }
    return this;
  }

}