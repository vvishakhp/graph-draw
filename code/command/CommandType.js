/**
 * @class  .command.CommandType
 *
 * EditPolicies should determine an Figures editing capabilities.
 * It is possible to implement an Figure such that it handles all editing
 * responsibility.<br>
 * However, it is much more flexible and object-oriented to use
 * EditPolicies. Using policies, you can pick and choose the editing behavior for
 * an Figure without being bound to its class hierarchy. Code reuse is increased,
 * and code management is easier.
 *
 * @author Andreas Herz
 */
import   from '../packages'


 .command.CommandType = Class.extend({

  NAME: " .command.CommandType",

  /**
   * @constructor
   * Create a new edit policy object
   *
   * @param {String} policy
   */
  init: function (policy) {
    this.policy = policy
  },

  /**
   * @method
   * Return the String representation of the policy
   *
   * @return {String}
   **/
  getPolicy: function () {
    return this.policy
  }
})

 .command.CommandType.DELETE = "DELETE"
 .command.CommandType.MOVE = "MOVE"
 .command.CommandType.CONNECT = "CONNECT"
 .command.CommandType.MOVE_BASEPOINT = "MOVE_BASEPOINT"
 .command.CommandType.MOVE_VERTEX = "MOVE_VERTEX"
 .command.CommandType.MOVE_VERTICES = "MOVE_VERTICES"
 .command.CommandType.MOVE_GHOST_VERTEX = "MOVE_GHOST_VERTEX"
 .command.CommandType.RESIZE = "RESIZE"
 .command.CommandType.RESET = "RESET"
 .command.CommandType.ROTATE = "ROTATE"


