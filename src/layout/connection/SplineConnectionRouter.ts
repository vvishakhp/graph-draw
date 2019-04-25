import { Type, ManhattanConnectionRouter, CubicSpline, LineSelectionFeedbackPolicy, ArrayList } from '../../imports';

@Type('SplineConnectionRouter')
export class SplineConnectionRouter extends ManhattanConnectionRouter {

  spline = new CubicSpline();

  constructor() {
    super();
    this.MINDIST = 50;
  }

  onInstall(connection) {
    connection.installEditPolicy(new LineSelectionFeedbackPolicy())
  }

  /**
   * @inheritdoc
   */
  route(conn, routingHints) {
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
    conn.lineSegments = new ArrayList()
    conn.vertices = new ArrayList()

    let splinePoints = this.spline.generate(ps, 8)
    splinePoints.each((i, e) => {
      conn.addPoint(e)
    })

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
}
