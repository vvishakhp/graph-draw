/**
 * @class  .layout.connection.RubberbandRouter
 * Router for direct connections between two ports with a rubber band effect
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     let RubberConnection=  .Connection.extend({
 *         NAME: "RubberConnection",
 *
 *         init:function(attr, setter, getter)
 *         {
 *           this._super(extend({
 *               color: "#33691e",
 *               stroke:1,
 *               outlineStroke:0,
 *               outlineColor:null
 *           },attr),
 *           setter,
 *           getter);
 *
 *
 *           this.setRouter(new  .layout.connection.RubberbandRouter());
 *         },
 *
 *         repaint:function(attributes)
 *         {
 *             if (this.repaintBlocked===true || this.shape === null){
 *                 return;
 *             }
 *             attributes= attributes || {};
 *             // enrich the rendering with a "fill" attribute
 *             if(typeof attributes.fill === "undefined"){
 *             	   attributes.fill = "#aed581";
 *             }
 *             this._super(attributes);
 *        }
 *     });
 *
 *     let createConnection=function(){
 *        let con = new RubberConnection();
 *        return con;
 *     };
 *
 *     // install a custom connection create policy
 *     //
 *     canvas.installEditPolicy(  new  .policy.connection.DragConnectionCreatePolicy({
 *            createConnection: createConnection
 *     }));
 *
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

 .layout.connection.RubberbandRouter =  .layout.connection.ConnectionRouter.extend({

  NAME: " .layout.connection.RubberbandRouter",

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
    let thickness = 10

    let start = connection.getStartPoint()
    let end = connection.getEndPoint()

    // 1. Calculate the vector AB→ by subtracting the coordinates of A from the coordinates of B.
    //    Let's say you get (u,v) as the vector components.
    //
    // 2. normalize the vector (u,v,) to a length of |1|
    //
    // 3. The vector (−v,u) is AB→ rotated by 90 degrees counterclockwise. (Why? Look up "rotation matrix").
    //
    // 4. Add (−v,u) to A to get C. Also add (−v,u) to B to get D.

    let uv = end.subtract(start)
    let uv2 = uv.clone()
    let length = uv.length()

    let strength = 1 - Math.min(0.75, (1 / 500 * length))
    let first = start.lerp(end, 0.25 * strength)     // go closer to the start point if the strength grows
    let second = start.lerp(end, 0.5)
    let third = start.lerp(end, 1 - (0.25 * strength)) // go closer to the end point if the strengths grows

    thickness = Math.max(5, thickness * strength)

    uv.x = uv.x / length * thickness
    uv.y = uv.y / length * thickness

    uv2.x = uv2.x / length * (thickness * (strength))
    uv2.y = uv2.y / length * (thickness * (strength))

    // anchor points for the 180 arc at the start point of the connection
    //
    let start90 = new  .geo.Point(-uv.y + start.x, uv.x + start.y)
    let start270 = new  .geo.Point(uv.y + start.x, -uv.x + start.y)

    // anchor point in the first segment ( on the upside/downside) of the connection
    //
    let first90 = new  .geo.Point(-uv2.y + first.x, uv2.x + first.y)
    let first270 = new  .geo.Point(uv2.y + first.x, -uv2.x + first.y)

    // center upside/downside anchor point of the connection
    //
    let second90 = new  .geo.Point(-uv2.y + second.x, uv2.x + second.y)
    let second270 = new  .geo.Point(uv2.y + second.x, -uv2.x + second.y)

    // anchor point in the third segment of the connection
    //
    let third90 = new  .geo.Point(-uv2.y + third.x, uv2.x + third.y)
    let third270 = new  .geo.Point(uv2.y + third.x, -uv2.x + third.y)

    // anchor point for the 180 arc at the end
    //
    let end90 = new  .geo.Point(-uv.y + end.x, uv.x + end.y)
    let end270 = new  .geo.Point(uv.y + end.x, -uv.x + end.y)

    // required for hit tests
    //
    connection.addPoint(start)
    connection.addPoint(end)

    // calculate the path
    let path = ["M", start90.x, ",", start90.y]
    path.push("A", thickness, ",", thickness, "0 0 1 ", start270.x, ",", start270.y)
    path.push("C", start270.x, ",", start270.y, first270.x, ",", first270.y, second270.x, ",", second270.y)
    path.push("C", second270.x, ",", second270.y, third270.x, ",", third270.y, end270.x, ",", end270.y)
    path.push("A", thickness, ",", thickness, "0 0 1", end90.x, ",", end90.y)
    path.push("C", end90.x, ",", end90.y, third90.x, ",", third90.y, second90.x, ",", second90.y)
    path.push("C", second90.x, ",", second90.y, first90.x, ",", first90.y, start90.x, ",", start90.y)

    connection.svgPathString = path.join(" ")
  }
})
