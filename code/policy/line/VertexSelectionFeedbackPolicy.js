/**
 * @class  .policy.line.VertexSelectionFeedbackPolicy
 *
 * Feedback and edit policy for the VertexRouter.
 *
 * @author  Andreas Herz
 * @extends  .policy.line.LineSelectionFeedbackPolicy
 */
import   from '../../packages'

 .policy.line.VertexSelectionFeedbackPolicy =  .policy.line.LineSelectionFeedbackPolicy.extend({

  NAME: " .policy.line.VertexSelectionFeedbackPolicy",

  /**
   * @constructor
   *
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  },


  /**
   * @method
   *
   * @param { .Canvas} canvas the related canvas
   * @param { .Connection} figure the selected figure
   * @param {Boolean} isPrimarySelection
   */
  onSelect: function (canvas, figure, isPrimarySelection) {
    let startHandle = new  .shape.basic.LineStartResizeHandle(figure)
    let endHandle = new  .shape.basic.LineEndResizeHandle(figure)
    figure.selectionHandles.add(startHandle)
    figure.selectionHandles.add(endHandle)

    let points = figure.getVertices()
    let count = points.getSize() - 1
    let i = 1
    for (; i < count; i++) {
      figure.selectionHandles.add(new  .shape.basic.VertexResizeHandle(figure, i))
      figure.selectionHandles.add(new  .shape.basic.GhostVertexResizeHandle(figure, i - 1))
    }

    figure.selectionHandles.add(new  .shape.basic.GhostVertexResizeHandle(figure, i - 1))

    figure.selectionHandles.each( (i, e) => {
      e.setDraggable(figure.isResizeable())
      e.show(canvas)
    })

    this.moved(canvas, figure)
  }

})
