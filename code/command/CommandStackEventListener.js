/**
 * @class  .command.CommandStackEventListener
 *
 * Event class which will be fired for every CommandStack operation. Required for CommandStackListener.
 * @author Andreas Herz
 */
import   from '../packages'


 .command.CommandStackEventListener = Class.extend({
  NAME: " .command.CommandStackEventListener",

  /**
   * @constructor
   * Creates a new Listener Object
   *
   */
  init: function () {
  },

  /**
   * @method
   * Sent when an event occurs on the command stack.  .command.CommandStackEvent.getDetail()
   * can be used to identify the type of event which has occurred.
   *
   * @template
   *
   * @param { .command.CommandStackEvent} event
   **/
  stackChanged: function (event) {
  }

})
