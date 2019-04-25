import { Spline, ArrayList, Point } from '../../imports';

export class BezierSpline extends Spline {
  generate(controlPoints: import("../ArrayList").default<any>, parts: number) {
    let n = controlPoints.getSize();
    let spline = new ArrayList();

    spline.add(this.p(0, 0, controlPoints));

    for (let i = 0; i < n - 3; i += 3) {
      for (let j = 1; j <= parts; j++) {
        spline.add(this.p(i, j / parts, controlPoints));
      }
    }

    return spline;
  }

  p(i, t, cp) {
    let x = 0.0;
    let y = 0.0;

    let k = i;
    for (let j = 0; j <= 3; j++) {
      let b = this.blend(j, t);
      let p = cp.get(k++);
      x += b * p.x;
      y += b * p.y;
    }

    return new Point(x, y);
  }

  blend(i, t) {
    if (i == 0) return (1 - t) * (1 - t) * (1 - t);
    else if (i == 1) return 3 * t * (1 - t) * (1 - t);
    else if (i == 2) return 3 * t * t * (1 - t);
    else return t * t * t;
  }

}
