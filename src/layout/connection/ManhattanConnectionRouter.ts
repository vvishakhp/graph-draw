import { Type, ConnectionRouter, LineSelectionFeedbackPolicy, Direction, Point } from '../../imports';
@Type('ManhattanConnectionRouter')
export class ManhattanConnectionRouter extends ConnectionRouter {
  MINDIST = 20
  TOL = 0.1
  TOLxTOL = 0.01
  TOGGLE_DIST = 20


  onInstall(connection) {
    connection.installEditPolicy(new LineSelectionFeedbackPolicy())
  }


  route(conn, routingHints) {
    let fromPt = conn.getStartPosition()
    let fromDir = conn.getSource().getConnectionDirection(conn.getTarget())

    let toPt = conn.getEndPosition()
    let toDir = conn.getTarget().getConnectionDirection(conn.getSource())


    this._route(conn, toPt, toDir, fromPt, fromDir)
    this._paint(conn)
  }


  _route(conn, fromPt, fromDir, toPt, toDir) {
    // fromPt is an x,y to start from.
    // fromDir is an angle that the first link must
    //
    let UP = Direction.DIRECTION_UP
    let RIGHT = Direction.DIRECTION_RIGHT
    let DOWN = Direction.DIRECTION_DOWN
    let LEFT = Direction.DIRECTION_LEFT

    let xDiff = fromPt.x - toPt.x
    let yDiff = fromPt.y - toPt.y
    let point
    let dir
    let pos

    if (((xDiff * xDiff) < (this.TOLxTOL)) && ((yDiff * yDiff) < (this.TOLxTOL))) {
      conn.addPoint(new Point(toPt.x, toPt.y))
      return
    }

    if (fromDir === LEFT) {
      if ((xDiff > 0) && ((yDiff * yDiff) < this.TOL) && (toDir === RIGHT)) {
        point = toPt
        dir = toDir
      }
      else {
        if (xDiff < 0) {
          point = new Point(fromPt.x - this.MINDIST, fromPt.y)
        }
        else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
          point = new Point(toPt.x, fromPt.y)
        }
        else if (fromDir === toDir) {
          pos = Math.min(fromPt.x, toPt.x) - this.MINDIST
          point = new Point(pos, fromPt.y)
        }
        else {
          point = new Point(fromPt.x - (xDiff / 2), fromPt.y)
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
          point = new Point(fromPt.x + this.MINDIST, fromPt.y)
        }
        else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
          point = new Point(toPt.x, fromPt.y)
        }
        else if (fromDir === toDir) {
          pos = Math.max(fromPt.x, toPt.x) + this.MINDIST
          point = new Point(pos, fromPt.y)
        }
        else {
          point = new Point(fromPt.x - (xDiff / 2), fromPt.y)
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
          point = new Point(fromPt.x, fromPt.y + this.MINDIST)
        }
        else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
          point = new Point(fromPt.x, toPt.y)
        }
        else if (fromDir === toDir) {
          pos = Math.max(fromPt.y, toPt.y) + this.MINDIST
          point = new Point(fromPt.x, pos)
        }
        else {
          point = new Point(fromPt.x, fromPt.y - (yDiff / 2))
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
          point = new Point(fromPt.x, fromPt.y - this.MINDIST)
        }
        else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
          point = new Point(fromPt.x, toPt.y)
        }
        else if (fromDir === toDir) {
          pos = Math.min(fromPt.y, toPt.y) - this.MINDIST
          point = new Point(fromPt.x, pos)
        }
        else {
          point = new Point(fromPt.x, fromPt.y - (yDiff / 2))
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


}