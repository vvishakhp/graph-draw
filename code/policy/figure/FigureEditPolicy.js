/**
 * @class  .policy.figure.FigureEditPolicy
 *
 * Called by the framework if the user edit the position of a figure with a drag drop operation.
 * Sub class like SelectionEditPolicy or RegionEditPolicy can adjust the position of the figure
 * or the selections handles.
 *
 * @author  Andreas Herz
 * @extends  .policy.EditPolicy
 * @since 4.4.0
 */
import   from '../../packages'

 .policy.figure.FigureEditPolicy =  .policy.EditPolicy.extend({

  NAME: " .policy.figure.FigureEditPolicy",

  /**
   * @constructor
   * Creates a new Router object
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  },

  /**
   * @method
   * Called if the user press the right mouse on the figure.<br>
   * You can either override the "onContextMenu" method of the figure or install an editor policy and override this method.
   * Booth is valid and possible.
   *
   * @param { .Figure| .shape.basic.Line} figure the figure below the mouse
   * @param {Number} x the x-coordinate of the mouse down event
   * @param {Number} y the y-coordinate of the mouse down event
   * @param {Boolean} shiftKey true if the shift key has been pressed during this event
   * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
   * @template
   * @since 4.4.0
   */
  onRightMouseDown: function (figure, x, y, shiftKey, ctrlKey) {
  }
})
