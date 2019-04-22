/**
 * @class  .policy.canvas.DropInterceptorPolicy
 *
 * Drop interceptors are basically event handlers from which you can return a value
 * that tells   to abort what it is that it was doing.<br>
 * <br>
 * Interceptors can be registered via the registerEditPolicy method on the   canvas just like any other
 * edit policies.<br>
 * <br>
 * The <b>delegateTarget</b> method is responsible for all drop event especially to all connection and port handling.
 *
 *
 *
 * @author Andreas Herz
 * @extends  .policy.canvas.CanvasPolicy
 * @since 5.0.0
 */
import   from '../../packages'

 .policy.canvas.DropInterceptorPolicy =  .policy.canvas.CanvasPolicy.extend({

  NAME: " .policy.canvas.DropInterceptorPolicy",

  /**
   * @constructor
   *
   */
  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  },


  /**
   * @method
   * Called if the user want connect a port with any kind  .Figure.<br>
   * Return a non <b>null</b> value if the interceptor accept the connect event.<br>
   * <br>
   * It is possible to delegate the drop event to another figure if the policy
   * returns another figure. This is usefull if a figure want to accept a port
   * drop event and delegates this drop event to another port.<br>
   *
   *
   * @param { .Figure} connectInquirer the figure who wants connect
   * @param { .Figure} connectIntent the potential connect target
   *
   * @return { .Figure} the calculated connect intent or <b>null</b> if the interceptor uses the veto right
   */
  delegateTarget: function (connectInquirer, connectIntent) {
    // a composite accept any kind of figures exceptional ports
    //
    if (!(connectInquirer instanceof  .Port) && connectIntent instanceof  .shape.composite.StrongComposite) {
      return connectIntent
    }

    // Ports accepts only Ports as DropTarget
    //
    if (!(connectIntent instanceof  .Port) || !(connectInquirer instanceof  .Port)) {
      return null
    }

    // consider the max possible connections for this port
    //
    if (connectIntent.getConnections().getSize() >= connectIntent.getMaxFanOut()) {
      return null
    }

    // It is not allowed to connect two output ports
    if (connectInquirer instanceof  .OutputPort && connectIntent instanceof  .OutputPort) {
      return null
    }

    // It is not allowed to connect two input ports
    if (connectInquirer instanceof  .InputPort && connectIntent instanceof  .InputPort) {
      return null
    }

    // It is not possible to create a loop back connection at the moment.
    // Reason: no connection router implemented for this case
    if ((connectInquirer instanceof  .Port) && (connectIntent instanceof  .Port)) {
      if (connectInquirer.getParent() === connectIntent.getParent()) {
        return null
      }
    }

    // redirect the dragEnter handling to the hybrid port
    //
    if ((connectInquirer instanceof  .Port) && (connectIntent instanceof  .shape.node.Hub)) {
      return connectIntent.getHybridPort(0)
    }

    // return the connectTarget determined by the framework or delegate it to another
    // figure.
    return connectIntent
  }

})
