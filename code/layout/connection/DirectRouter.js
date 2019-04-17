/**
 * @class  .layout.connection.DirectRouter
 *
 * Router for direct connections between two ports. Beeline
 * <br>
 * <br>
 * See the example:
 *
 *     @example preview small frame
 *
 *     let createConnection=function(){
 *        let con = new  .Connection();
 *        con.setRouter(new  .layout.connection.DirectRouter());
 *        return con;
 *     };
 *
 *     // install a custom connection create policy
 *     //
 *     canvas.installEditPolicy(  new  .policy.connection.DragConnectionCreatePolicy({
 *            createConnection: createConnection
 *     }));
 *
 *     // create and add two nodes which contains Ports (In and OUT)
 *     //
 *     let start = new  .shape.node.Start();
 *     let end   = new  .shape.node.End();

 *     // ...add it to the canvas
 *     canvas.add( start, 50,50);
 *     canvas.add( end, 230,80);
 *
 *     // first Connection
 *     //
 *     let c = createConnection();
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *     canvas.add(c);
 *
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends   .layout.connection.ConnectionRouter
 */
import   from '../../packages'


 .layout.connection.DirectRouter =  .layout.connection.ConnectionRouter.extend({

  NAME: " .layout.connection.DirectRouter",

  /**
   * @constructor
   * Creates a new Router object
   */
  init: function () {
    this._super()
  },


  /**
   * @method
   * Callback method if the router has been assigned to a connection.
   *
   * @param { .Connection} connection The assigned connection
   * @template
   * @since 2.7.2
   */
  onInstall: function (connection) {
    connection.installEditPolicy(new  .policy.line.LineSelectionFeedbackPolicy())
  },


  /**
   * @method
   * Invalidates the given Connection
   */
  invalidate: function () {
  },


  /**
   * @inheritdoc
   */
  route: function (connection, routingHints) {
    let start = connection.getStartPosition()
    let end = connection.getEndPosition()

    // required for hit tests
    //
    connection.addPoint(start)
    connection.addPoint(end)

    // calculate the path
    let path = ["M", start.x, " ", start.y]
    path.push("L", end.x, " ", end.y)

    connection.svgPathString = path.join("")
  }
})
