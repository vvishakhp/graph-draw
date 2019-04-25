import { SelectionFeedbackPolicy, RectangleShape, LineShape, Figure, Point, Type } from '../../imports';


@Type('AntSelectionFeedbackPolicy')
export class AntSelectionFeedbackPolicy extends SelectionFeedbackPolicy {
  onSelect(canvas, figure, isPrimarySelection) {
    if (figure.selectionHandles.isEmpty()) {
      let box: any = new RectangleShape({ bgColor: null, dasharray: "- ", color: "#2C70FF" }, {}, {})
      box.hide = () => {
        box.setCanvas(null)
      }
      box.show = (canvas) => {
        box.setCanvas(canvas)
        box.shape.toFront()
      }
      box.show(canvas)
      figure.selectionHandles.add(box)


      if (figure.getParent() !== null) {
        let line: any = new LineShape({ opacity: 0.5, bgColor: null, dasharray: "- ", color: "#2C70FF" }, {}, {})
        line.show = (canvas) => line.setCanvas(canvas)
        line.hide = () => line.setCanvas(null)
        line.show(canvas)
        figure.selectionHandles.add(line)
        this._updateBeeLine(line, figure)
      }
    }
    this.moved(canvas, figure)
  }

  moved(canvas, figure) {
    if (figure.selectionHandles.isEmpty()) {
      return // silently
    }

    let margin = 2
    let box = figure.selectionHandles.first()
    box.setPosition(figure.getAbsolutePosition().translate(-margin, -margin))
    box.setDimension(figure.getWidth() + margin * 2, figure.getHeight() + margin * 2)
    box.setRotationAngle(figure.getRotationAngle())

    if (figure.selectionHandles.getSize() > 1) {
      this._updateBeeLine(figure.selectionHandles.get(1), figure)
    }
  }

  _updateBeeLine(line, figure: Figure) {
    let parent = figure.getParent()

    if (parent === null) {
      return
    }

    if (parent instanceof LineShape) {
      let center = figure.getBoundingBox().getCenter()
      let projection: Point = parent.pointProjection(center.getX(), center.getY()) as any;
      if (projection === null) {
        let p1 = line.getStartPosition()
        let p2 = line.getEndPosition()
        let d1 = center.distence(p1)
        let d2 = center.distence(p1)
        projection = d1 < d2 ? p1 : p2
      }
      let intersection = figure.getBoundingBox().intersectionWithLine(center, projection)
      if (intersection.getSize() > 0) {
        line.setStartPosition(figure.getBoundingBox().intersectionWithLine(center, projection).get(0))
          .setEndPosition(projection)
      }
      else {
        line.setStartPosition(figure.getBoundingBox().getCenter())
          .setEndPosition(projection)
      }
    }
    else {
      let rect1 = figure.getBoundingBox(),
        rect2 = parent.getBoundingBox()

      let center1 = rect1.getCenter()
      let center2 = rect2.getCenter()
      // the rectangle overlaps -> return the center of booth
      if (rect1.intersects(rect2)) {
        line.setStartPosition(center1)
          .setEndPosition(center2)
      }
      // one rect is inside the other rect
      //
      else if (rect1.hitTest(center2) || rect2.hitTest(center1)) {
        line.setStartPosition(center1)
          .setEndPosition(center2)
      }
      else {
        rect1.scale(3, 3)
        rect2.scale(3, 3)

        line.setStartPosition(rect1.intersectionWithLine(center1, center2).get(0))
          .setEndPosition(rect2.intersectionWithLine(center1, center2).get(0))
      }
    }
  }
} 
