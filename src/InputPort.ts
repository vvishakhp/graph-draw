/// TODO

import   from 'packages'

export class InputPort {

}

/**
 * @class  .InputPort
 * A InputPort is the start anchor for a {@link  .Connection}.
 *
 * @author Andreas Herz
 * @extend  .Port
 */


  =  .Port.extend({

  NAME: " .InputPort",

  /**
   * @constructor
   * Create a new InputPort element
   *
   * @param {Object} [attr] the configuration of the shape
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)

    // responsive for the arrangement of the port
    // calculates the x/y coordinates in relation to the parent node
    this.locator = new  .layout.locator.InputPortLocator()
  },


  /**
   * @inheritdoc
   */
  createCommand: function (request) {
    // Connect request between two ports
    //
    if (request.getPolicy() ===  .command.CommandType.CONNECT) {
      return new  .command.CommandConnect(request.source, request.target, request.source)
    }

    // ...else call the base class
    return this._super(request)
  }
})
