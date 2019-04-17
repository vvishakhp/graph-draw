export class OutputPort extends Port {

}

/**
 * @class  .OutputPort
 * A OutputPort is the start anchor for a {@link  .Connection}.
 *
 * @author Andreas Herz
 * @extends  .Port
 */


import { Port } from './Port';

 .OutputPort =  .Port.extend({

    NAME: " .OutputPort",

    /**
     * @constructor
     * Create a new OutputPort element
     *
     * @param {Object} [attr] the configuration of the shape
     */
    init: function (attr, setter, getter) {
        this._super(attr, setter, getter);

        // responsive for the arrangement of the port
        // calculates the x/y coordinates in relation to the parent node
        this.locator = new  .layout.locator.OutputPortLocator();
    },


    /**
     * @inheritdoc
     */
    createCommand: function (request) {
        // Connect request between two ports
        //
        if (request.getPolicy() ===  .command.CommandType.CONNECT) {
            // source and target are changed.
            return new  .command.CommandConnect(request.target, request.source, request.source);
        }

        // ...else call the base class
        return this._super(request);
    }
});
