/**
 * @class  .command.CommandStackEvent
 * Event class which will be fired for every CommandStack operation. Required for CommandStackListener.
 */
import   from '../packages'

 .command.CommandStackEvent = Class.extend({
  NAME: " .command.CommandStackEvent",

  /**
   * @constructor
   * Create a new CommandStack objects which can be execute via the CommandStack.
   * @param { .command.Command} command the related command
   * @param {Number} details the current state of the command execution
   *
   */
  init: function (stack, command, details, action) {
    this.stack = stack
    this.command = command
    this.details = details // deprecated
    this.action = action
  },


  /**
   * @method
   * Return the corresponding stack of the event.
   *
   * @return { .command.CommandStack}
   **/
  getStack: function () {
    return this.stack
  },


  /**
   * @method
   * Returns null or a Command if a command is relevant to the current event.
   *
   * @return { .command.Command}
   **/
  getCommand: function () {
    return this.command
  },

  /**
   * @method
   * Returns an integer identifying the type of event which has occurred.
   * Defined by {@link  .command.CommandStack}.
   *
   * @return {Number}
   **/
  getDetails: function () {
    return this.details
  },


  /**
   * @method
   * Returns true if this event is fired after the stack having changed.
   *
   * @return {Boolean} true if post-change event
   **/
  isPostChangeEvent: function () {
    return 0 !== (this.getDetails() &  .command.CommandStack.POST_MASK)
  },

  /**
   * @method
   * Returns true if this event is fired prior to the stack changing.
   *
   * @return {Boolean} true if pre-change event
   **/
  isPreChangeEvent: function () {
    return 0 !== (this.getDetails() &  .command.CommandStack.PRE_MASK)
  }
})
