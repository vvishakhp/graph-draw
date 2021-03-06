/**
 * @class  .layout.connection.SplineConnectionRouter
 *
 * A ManhattanConnectionRouter with an spline interpolation between the bend points.
 *
 *     @example preview small frame
 *
 *     let createConnection=function(){
 *        let con = new  .Connection();
 *        con.setRouter(new  .layout.connection.SplineConnectionRouter());
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
 *     let f1 = new  .shape.analog.OpAmp({x:10, y:10});
 *     let f2 = new  .shape.analog.ResistorVertical({angle:90, height:20, x:300, y:150});
 *
 *     // ...add it to the canvas
 *     //
 *     canvas.add( f1);
 *     canvas.add( f2);
 *
 *     // first Connection
 *     //
 *     let c = createConnection();
 *     c.setSource(f1.getOutputPort(0));
 *     c.setTarget(f2.getHybridPort(0));
 *     canvas.add(c);
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .layout.connection.ManhattanConnectionRouter
 */
import   from '../../packages'

 .layout.connection.SplineConnectionRouter =  .layout.connection.ManhattanConnectionRouter.extend({

  NAME: " .layout.connection.SplineConnectionRouter",

  /**
   * @constructor Creates a new Router object
   */
  init: function () {
    this._super()

//        this.spline = new  .util.spline.CatmullRomSpline();
    this.spline = new  .util.spline.CubicSpline()
//        this.spline = new  .util.spline.BezierSpline();

    this.MINDIST = 50
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
   * @inheritdoc
   */
  route: function (conn, routingHints) {
    let i
    let fromPt = conn.getStartPoint()
    let fromDir = conn.getSource().getConnectionDirection(conn.getTarget())

    let toPt = conn.getEndPoint()
    let toDir = conn.getTarget().getConnectionDirection(conn.getSource())

    // calculate the manhatten bend points between start/end.
    //
    this._route(conn, toPt, toDir, fromPt, fromDir)

    let ps = conn.getVertices()

    conn.oldPoint = null
    conn.lineSegments = new  .util.ArrayList()
    conn.vertices = new  .util.ArrayList()

    let splinePoints = this.spline.generate(ps, 8)
    splinePoints.each(function (i, e) {
      conn.addPoint(e)
    })

    // calculate the path string for the SVG rendering
    //
    ps = conn.getVertices()
    let length = ps.getSize()
    let p = ps.get(0)
    let path = ["M", p.x, " ", p.y]
    for (i = 1; i < length; i++) {
      p = ps.get(i)
      path.push("L", p.x, " ", p.y)
    }
    conn.svgPathString = path.join("")
  }
})
