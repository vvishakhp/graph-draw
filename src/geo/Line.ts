import { Point } from '../imports';

const Line = {

  inverseLerp: (X1, Y1, X2, Y2, px, py) => {
    let nenner = Math.abs(X2 - X1)
    let zaehler = Math.abs(X2 - px)
    if (nenner === 0) {
      nenner = Math.abs(Y2 - Y1)
      zaehler = Math.abs(Y2 - py)
      if (nenner === 0) {
        return 1
      }
    }

    return zaehler / nenner
  },


  pointProjection: (X1, Y1, X2, Y2, px, py) => {
    let r = new Point(0, 0)
    if (X1 === X2 && Y1 === Y2) X1 -= 0.00001

    let U = ((px - X1) * (X2 - X1)) + ((py - Y1) * (Y2 - Y1))

    let Udenom = Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2)

    U /= Udenom

    r.setX(X1 + (U * (X2 - X1)));
    r.setY(Y1 + (U * (Y2 - Y1)));

    let minx, maxx, miny, maxy

    minx = Math.min(X1, X2)
    maxx = Math.max(X1, X2)

    miny = Math.min(Y1, Y2)
    maxy = Math.max(Y1, Y2)

    let isValid = (r.getX() >= minx && r.getX() <= maxx) && (r.getY() >= miny && r.getY <= maxy)

    return isValid ? r : null
  },

  distance: (X1, Y1, X2, Y2, px, py) => {
    // Adjust vectors relative to X1,Y1
    // X2,Y2 becomes relative vector from X1,Y1 to end of segment
    X2 -= X1
    Y2 -= Y1
    // px,py becomes relative vector from X1,Y1 to test point
    px -= X1
    py -= Y1
    let dotprod = px * X2 + py * Y2
    let projlenSq
    if (dotprod <= 0.0) {
      // px,py is on the side of X1,Y1 away from X2,Y2
      // distance to segment is length of px,py vector
      // "length of its (clipped) projection" is now 0.0
      projlenSq = 0.0
    } else {
      // switch to backwards vectors relative to X2,Y2
      // X2,Y2 are already the negative of X1,Y1=>X2,Y2
      // to get px,py to be the negative of px,py=>X2,Y2
      // the dot product of two negated vectors is the same
      // as the dot product of the two normal vectors
      px = X2 - px
      py = Y2 - py
      dotprod = px * X2 + py * Y2
      if (dotprod <= 0.0) {
        // px,py is on the side of X2,Y2 away from X1,Y1
        // distance to segment is length of (backwards) px,py vector
        // "length of its (clipped) projection" is now 0.0
        projlenSq = 0.0
      } else {
        // px,py is between X1,Y1 and X2,Y2
        // dotprod is the length of the px,py vector
        // projected on the X2,Y2=>X1,Y1 vector times the
        // length of the X2,Y2=>X1,Y1 vector
        projlenSq = dotprod * dotprod / (X2 * X2 + Y2 * Y2)
      }
    }
    // Distance to line is now the length of the relative point
    // vector minus the length of its projection onto the line
    // (which is zero if the projection falls outside the range
    //  of the line segment).
    let lenSq = px * px + py * py - projlenSq
    if (lenSq < 0) {
      lenSq = 0
    }
    return Math.sqrt(lenSq)
  }
};


export default Line;
