import { Type } from "./TypeRegistry";
import { Port } from "./Port";
import { OutputPortLocator } from "./layout/locator/OutputPortLocator";
import { CommandConnect } from "./command/CommandConnect";
import { CommandType } from "./command/CommandType";

@Type('OutputPort')
export class OutputPort extends Port {
    locator = new OutputPortLocator();

    createCommand(request) {
        if (request.getPolicy() === CommandType.CONNECT) {
            return new CommandConnect(request.target, request.source, request.source);
        }
        return super.createCommand(request);
    }

}