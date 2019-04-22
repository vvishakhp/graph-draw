/**
 * @class  .policy.canvas.ExtendedKeyboardPolicy
 * Extended keyboard policy to <b>delete</b> and <b>group</b> figures in the canvas.
 * <br>
 * Keyboard commands
 * <ul>
 *    <li>DEL    - delete selection</li>
 *    <li>Ctrl+G - group/ungroup selection</li>
 *    <li>Ctrl+B - send current selection in the background (toBack)</li>
 *    <li>Ctrl+F - send current selection in the foreground (toFront)</li>
 * </ul>
 *
 * @author Andreas Herz
 * @extends  .policy.canvas.KeyboardPolicy
 */
import   from '../../packages'

 .policy.canvas.ExtendedKeyboardPolicy =  .policy.canvas.KeyboardPolicy.extend({

  NAME: " .policy.canvas.ExtendedKeyboardPolicy",

  /**
   * @constructor
   */
  init: function () {
    this._super()
  },

  /**
   * @method
   * Callback if the user press a key
   *
   * @param { .Canvas} canvas the related canvas
   * @param {Number} keyCode the pressed key
   * @param {Boolean} shiftKey true if the shift key has been pressed during this event
   * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
   * @private
   **/
  onKeyDown: function (canvas, keyCode, shiftKey, ctrlKey) {
    if (canvas.getPrimarySelection() !== null && ctrlKey === true) {
      switch (keyCode) {

        case 71: // G
          if (canvas.getPrimarySelection() instanceof  .shape.composite.Group && canvas.getSelection().getSize() === 1) {
            canvas.getCommandStack().execute(new  .command.CommandUngroup(canvas, canvas.getPrimarySelection()))
          }
          else {
            canvas.getCommandStack().execute(new  .command.CommandGroup(canvas, canvas.getSelection()))
          }
          break
        case 66: // B
          canvas.getPrimarySelection().toBack()
          break
        case 70: // F
          canvas.getPrimarySelection().toFront()
      }
    }
    else {
      this._super(canvas, keyCode, shiftKey, ctrlKey)
    }
  }


})
