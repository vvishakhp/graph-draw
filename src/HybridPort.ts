import {
   InputPortLocator, Type, Port, CommandType, InputPort,
   CommandConnect, OutputPort
} from "./imports";

@Type('HybridPort')
export class HybridPort extends Port {
   locator: InputPortLocator;
   constructor(attr, setter, getter) {
      super(attr, setter, getter);
      this.locator = new InputPortLocator();
   }



   createCommand(request) {
      if (request.getPolicy() === CommandType.CONNECT) {

         if (request.source.getParent().getId() === request.target.getParent().getId()) {
            return null;
         }

         if (request.source instanceof InputPort) {
            return new CommandConnect(request.target, request.source, request.source);
         }
         else if (request.source instanceof OutputPort) {
            return new CommandConnect(request.source, request.target, request.source);
         }
         else if (request.source instanceof HybridPort) {
            return new CommandConnect(request.target, request.source, request.source);
         }

         return null;
      }


      return super.createCommand(request);
   }
}
