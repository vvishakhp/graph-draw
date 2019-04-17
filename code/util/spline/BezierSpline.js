/**
 * @class  .util.spline.BezierSpline
 *
 * A bezier spline object.
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends  .util.spline.Spline
 */

import   from '../../packages';

 .util.spline.BezierSpline =  .util.spline.Spline.extend(
{
    NAME : " .util.spline.BezierSpline",

    /**
     * @constructor
     */
    init: function()
    {
        this._super();
    },



    /**
     * Create a spline based on the given control points.
     * The generated curve starts in the first control point and ends
     * in the last control point.
     *
     * @param {Array} controlPoints  Control points of spline (x0,y0,z0,x1,y1,z1,...).
     * @param {Number} parts Number of parts to divide each leg into.
     *
     * @returns {Array} the new generated array with new  .geo.Point
     */
    generate: function(controlPoints, parts)
    {
      var n = controlPoints.getSize();
      var spline = new  .util.ArrayList();

      spline.add(this.p(0, 0, controlPoints));

      for (var i = 0; i < n - 3; i += 3) {
        for (var j = 1; j <= parts; j++) {
           spline.add(this.p (i, j /  parts, controlPoints));
        }
      }

  //    spline.add(controlPoints.get(controlPoints.getSize()-1));

      return spline;
    },



    p: function( i,  t,  cp)
    {
      var x = 0.0;
      var y = 0.0;

      var k = i;
      for (var j = 0; j <= 3; j++) {
        var b = this.blend (j, t);
        var p = cp.get(k++);
        x += b * p.x;
        y += b * p.y;
     }

      return new  .geo.Point( x, y);
    },



    blend: function ( i,  t)
    {
      if      (i == 0) return (1 - t) * (1 - t) * (1 - t);
      else if (i == 1) return 3 * t * (1 - t) * (1 - t);
      else if (i == 2) return 3 * t * t * (1 - t);
      else             return t * t * t;
    }
});
