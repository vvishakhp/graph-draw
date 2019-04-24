import {
  Port, Type, InputPortLocator,
  CommandType, CommandConnect
} from "./imports";



@Type('InputPort')
export class InputPort extends Port {

  locator = new InputPortLocator();
  createCommand(request) {
    if (request.getPolicy() === CommandType.CONNECT) {
      return new CommandConnect(request.source, request.target, request.source)
    }
    return super.createCommand(request)
  }
}