import { Type } from "./TypeRegistry";
import { Port } from "./Port";
import { InputPortLocator } from "./layout/locator/InputPortLocator";
import { CommandType } from "./command/CommandType";
import { CommandConnect } from "./command/CommandConnect";


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