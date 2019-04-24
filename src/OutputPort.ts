import { Port, Type, OutputPortLocator, CommandType, CommandConnect } from "./imports";


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