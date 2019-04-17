export class HybridPort extends Port {

}

/**
 * @class  .HybridPort
 * A HybridPort can work as Input and as Output port in the same way for a {@link  .Connection}.
 *
 * @author Andreas Herz
 * @extends  .Port
 */

import   from 'packages';
import { Port } from './Port';

 .HybridPort =  .Port.extend({

   NAME: " .HybridPort",

   /**
    * @constructor
    * Create a new HybridPort element
    *
    * @param {Object} [attr] the configuration of the shape
    */
   init: function (attr, setter, getter) {
      this._super(attr, setter, getter);

      // responsive for the arrangement of the port
      // calculates the x/y coordinates in relation to the parent node
      this.locator = new  .layout.locator.InputPortLocator();
   },

   /**
    * @inheritdoc
    */
   createCommand: function (request) {
      // Connect request between two ports
      //
      if (request.getPolicy() ===  .command.CommandType.CONNECT) {

         if (request.source.getParent().getId() === request.target.getParent().getId()) {
            return null;
         }

         if (request.source instanceof  .InputPort) {
            // This is the difference to the InputPort implementation of createCommand.
            return new  .command.CommandConnect(request.target, request.source, request.source);
         }
         else if (request.source instanceof  .OutputPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new  .command.CommandConnect(request.source, request.target, request.source);
         }
         else if (request.source instanceof  .HybridPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new  .command.CommandConnect(request.target, request.source, request.source);
         }

         return null;
      }

      // ...else call the base class
      return this._super(request);
   }
});
