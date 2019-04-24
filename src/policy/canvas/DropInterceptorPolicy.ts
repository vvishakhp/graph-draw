import { Type } from "../../TypeRegistry";
import { CanvasPolicy } from "./CanvasPolicy";
import { Port } from "../../Port";
import { OutputPort } from "../../OutputPort";
import { InputPort } from "../../InputPort";
import { StrongComposite } from "../../shape/composite/StrongComposite";

@Type('DropInterceptorPolicy')
export class DropInterceptorPolicy extends CanvasPolicy {

  delegateTarget(connectInquirer, connectIntent) {
    // a composite accept any kind of figures exceptional ports
    //
    if (!(connectInquirer instanceof Port) && connectIntent instanceof StrongComposite) {
      return connectIntent
    }


    if (!(connectIntent instanceof Port) || !(connectInquirer instanceof Port)) {
      return null
    }


    if (connectIntent.getConnections().getSize() >= connectIntent.getMaxFanOut()) {
      return null
    }


    if (connectInquirer instanceof OutputPort && connectIntent instanceof OutputPort) {
      return null
    }


    if (connectInquirer instanceof InputPort && connectIntent instanceof InputPort) {
      return null
    }


    if ((connectInquirer instanceof Port) && (connectIntent instanceof Port)) {
      if (connectInquirer.getParent() === connectIntent.getParent()) {
        return null
      }
    }

    if ((connectInquirer instanceof Port) && (connectIntent instanceof Hub)) {
      return connectIntent.getHybridPort(0)
    }

    return connectIntent
  }

}