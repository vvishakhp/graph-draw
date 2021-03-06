/**
 * @class  .layout.connection.ManhattanConnectionRouter
 * Provides a {@link  .Connection} with an orthogonal route between the Connection's source
 * and target anchors.
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     // Override the default connection type. This is used during drag&drop operations of ports.
 *     //
 *     let createConnection=function(sourcePort, targetPort){
 *        // return my special kind of connection
 *        let con = new  .Connection();
 *        con.setRouter(new  .layout.connection.ManhattanConnectionRouter());
 *        return con;
 *     };
 *
 *     // Install a special policy into the canvas to use my own implementation of connection
 *     // if we drag&drop a port
 *     //
 *     canvas.installEditPolicy(  new  .policy.connection.DragConnectionCreatePolicy({
 *           createConnection: createConnection
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
 * @inheritable
 * @author Andreas Herz
 *
 * @extends   .layout.connection.ConnectionRouter
 */
import   from '../../packages'


 .layout.connection.ManhattanConnectionRouter =  .layout.connection.ConnectionRouter.extend({
  NAME: " .layout.connection.ManhattanConnectionRouter",

  MINDIST: 20,
  TOL: 0.1,
  TOLxTOL: 0.01,
  TOGGLE_DIST: 20,

  /**
   * @constructor
   * Creates a new Router object.
   *
   */
  init: function () {
    this._super()
  },


  /**
   * @method
   * Callback method if the router has been assigned to a connection.
   *
   * @param { .Connection} connection The assigned connection
   * @since 2.7.2
   */
  onInstall: function (connection) {
    connection.installEditPolicy(new  .policy.line.LineSelectionFeedbackPolicy())
  },

  /**
   * @inheritdoc
   */
  route: function (conn, routingHints) {
    let fromPt = conn.getStartPosition()
    let fromDir = conn.getSource().getConnectionDirection(conn.getTarget())

    let toPt = conn.getEndPosition()
    let toDir = conn.getTarget().getConnectionDirection(conn.getSource())

    // calculate the lines between the two points.
    //
    this._route(conn, toPt, toDir, fromPt, fromDir)
    this._paint(conn)
  },

  /**
   * @method
   * Internal routing algorithm.
   *
   * @private
   * @param { .Connection} conn
   * @param { .geo.Point} fromPt
   * @param {Number} fromDir
   * @param { .geo.Point} toPt
   * @param {Number} toDir
   */
  _route: function (conn, fromPt, fromDir, toPt, toDir) {
    // fromPt is an x,y to start from.
    // fromDir is an angle that the first link must
    //
    let UP =  .geo.Rectangle.DIRECTION_UP
    let RIGHT =  .geo.Rectangle.DIRECTION_RIGHT
    let DOWN =  .geo.Rectangle.DIRECTION_DOWN
    let LEFT =  .geo.Rectangle.DIRECTION_LEFT

    let xDiff = fromPt.x - toPt.x
    let yDiff = fromPt.y - toPt.y
    let point
    let dir
    let pos

    if (((xDiff * xDiff) < (this.TOLxTOL)) && ((yDiff * yDiff) < (this.TOLxTOL))) {
      conn.addPoint(new  .geo.Point(toPt.x, toPt.y))
      return
    }

    if (fromDir === LEFT) {
      if ((xDiff > 0) && ((yDiff * yDiff) < this.TOL) && (toDir === RIGHT)) {
        point = toPt
        dir = toDir
      }
      else {
        if (xDiff < 0) {
          point = new  .geo.Point(fromPt.x - this.MINDIST, fromPt.y)
        }
        else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
          point = new  .geo.Point(toPt.x, fromPt.y)
        }
        else if (fromDir === toDir) {
          pos = Math.min(fromPt.x, toPt.x) - this.MINDIST
          point = new  .geo.Point(pos, fromPt.y)
        }
        else {
          point = new  .geo.Point(fromPt.x - (xDiff / 2), fromPt.y)
        }

        if (yDiff > 0) {
          dir = UP
        }
        else {
          dir = DOWN
        }
      }
    }
    else if (fromDir === RIGHT) {
      if ((xDiff < 0) && ((yDiff * yDiff) < this.TOL) && (toDir === LEFT)) {
        point = toPt
        dir = toDir
      }
      else {
        if (xDiff > 0) {
          point = new  .geo.Point(fromPt.x + this.MINDIST, fromPt.y)
        }
        else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
          point = new  .geo.Point(toPt.x, fromPt.y)
        }
        else if (fromDir === toDir) {
          pos = Math.max(fromPt.x, toPt.x) + this.MINDIST
          point = new  .geo.Point(pos, fromPt.y)
        }
        else {
          point = new  .geo.Point(fromPt.x - (xDiff / 2), fromPt.y)
        }

        if (yDiff > 0) {
          dir = UP
        }
        else {
          dir = DOWN
        }
      }
    }
    else if (fromDir === DOWN) {
      if (((xDiff * xDiff) < this.TOL) && (yDiff < 0) && (toDir === UP)) {
        point = toPt
        dir = toDir
      }
      else {
        if (yDiff > 0) {
          point = new  .geo.Point(fromPt.x, fromPt.y + this.MINDIST)
        }
        else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
          point = new  .geo.Point(fromPt.x, toPt.y)
        }
        else if (fromDir === toDir) {
          pos = Math.max(fromPt.y, toPt.y) + this.MINDIST
          point = new  .geo.Point(fromPt.x, pos)
        }
        else {
          point = new  .geo.Point(fromPt.x, fromPt.y - (yDiff / 2))
        }

        if (xDiff > 0) {
          dir = LEFT
        }
        else {
          dir = RIGHT
        }
      }
    }
    else if (fromDir === UP) {
      if (((xDiff * xDiff) < this.TOL) && (yDiff > 0) && (toDir === DOWN)) {
        point = toPt
        dir = toDir
      }
      else {
        if (yDiff < 0) {
          point = new  .geo.Point(fromPt.x, fromPt.y - this.MINDIST)
        }
        else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
          point = new  .geo.Point(fromPt.x, toPt.y)
        }
        else if (fromDir === toDir) {
          pos = Math.min(fromPt.y, toPt.y) - this.MINDIST
          point = new  .geo.Point(fromPt.x, pos)
        }
        else {
          point = new  .geo.Point(fromPt.x, fromPt.y - (yDiff / 2))
        }

        if (xDiff > 0) {
          dir = LEFT
        }
        else {
          dir = RIGHT
        }
      }
    }
    this._route(conn, point, dir, toPt, toDir)
    conn.addPoint(fromPt)
  }

})
