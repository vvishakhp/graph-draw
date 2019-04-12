import { Spline } from './Spline';
import ArrayList from '../ArrayList';
import { Point } from '../../geo/Point';

export class CubicSpline extends Spline {
  constructor() {
    super();
  }


  generate(controlPoints: ArrayList<Point>, parts: number) {
    // Endpoints are added twice to get them include in the
    // generated array
    var cp = new ArrayList();
    cp.add(controlPoints.get(0));
    cp.addAll(controlPoints);
    cp.add(controlPoints.get(controlPoints.getSize() - 1));

    var n = cp.getSize();
    var spline = new ArrayList();
    spline.add(controlPoints.get(0));
    spline.add(this.p(1, 0, cp));

    for (var i = 1; i < n - 2; i++) {
      for (var j = 1; j <= parts; j++) {
        spline.add(this.p(i, j / parts, cp));
      }
    }
    spline.add(controlPoints.get(controlPoints.getSize() - 1));

    return spline;
  }

  p(i, t, cp) {
    var x = 0.0;
    var y = 0.0;

    var k = i - 1;
    for (var j = -2; j <= 1; j++) {
      var b = this.blend(j, t);
      var p = cp.get(k++);
      x += b * p.x;
      y += b * p.y;
    }

    return new Point(x, y);
  }

  blend(i, t) {
    if (i === -2)
      return (((-t + 3) * t - 3) * t + 1) / 6;
    else if (i === -1)
      return (((3 * t - 6) * t) * t + 4) / 6;
    else if (i === 0)
      return (((-3 * t + 3) * t + 3) * t + 1) / 6;

    return (t * t * t) / 6;
  }
}
