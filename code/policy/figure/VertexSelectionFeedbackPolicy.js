/**
 * @class  .policy.figure.VertexSelectionFeedbackPolicy
 *
 * Called by the framework if the user edit the position of a figure with a drag drop operation.
 * Sub class like SelectionEditPolicy or RegionEditPolicy cam adjust th e position of the figure or the selections handles.
 *
 * @author  Andreas Herz
 * @extends  .policy.figure.SelectionFeedbackPolicy
 */
import   from '../../packages'

 .policy.figure.VertexSelectionFeedbackPolicy =  .policy.figure.SelectionFeedbackPolicy.extend({

  NAME: " .policy.figure.VertexSelectionFeedbackPolicy",

  /**
   * @constructor
   * Creates a new Router object
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  },


  /**
   * @method
   *
   * @param { .Canvas} canvas The host canvas
   * @param { .Connection} connection the selected figure
   * @param {Boolean} isPrimarySelection
   */
  onSelect: function (canvas, connection, isPrimarySelection) {
//    	this._super(canvas, connection, isPrimarySelection);

    let points = connection.getVertices()
    for (let i = 0; i < points.getSize(); i++) {
      let handle = new  .shape.basic.VertexResizeHandle(connection, i)
      connection.selectionHandles.add(handle)
      handle.setDraggable(connection.isResizeable())
      handle.show(canvas)

      if (i !== 0) {
        let handle = new  .shape.basic.GhostVertexResizeHandle(connection, i - 1)
        connection.selectionHandles.add(handle)
        handle.setDraggable(connection.isResizeable())
        handle.show(canvas)
      }
    }

    this.moved(canvas, connection)
  },

  /**
   * @method
   * Callback method if the figure has been moved.
   *
   * @param { .Canvas} canvas The host canvas
   * @param { .Figure} figure The related figure
   */
  moved: function (canvas, figure) {
    figure.selectionHandles.each( (i, e) => e.relocate())
  }


})
