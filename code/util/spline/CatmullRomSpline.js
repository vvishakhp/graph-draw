/**
 * @class  .util.spline.CatmullRomSpline
 *
 * A catmull-rom spline object.
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends  .util.spline.CubicSpline
 */
import   from '../../packages';

 .util.spline.CatmullRomSpline =  .util.spline.CubicSpline.extend(
{
    NAME : " .util.spline.CatmullRomSpline",

    /**
     * @constructor
     */
    init: function()
    {
        this._super();
    },


    blend: function(i, t) {
        if (i == -2)
            return ((-t + 2) * t - 1) * t / 2;
        else if (i == -1)
            return (((3 * t - 5) * t) * t + 2) / 2;
        else if (i == 0)
            return ((-3 * t + 4) * t + 1) * t / 2;
        else
            return ((t - 1) * t * t) / 2;
    }

});
