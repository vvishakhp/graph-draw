

/**
 * @class  .geo.Ray
 * A ray is a line starting in [0,0,] with some additional
 * helper functions required for some router.
 * 
 * @inheritable
 * @extends  .geo.Point
 * @author Andreas Herz
 */
import   from '../packages';


 .geo.Ray =  .geo.Point.extend({

    NAME : " .geo.Ray",
    
    /**
     * @constructor 
     * Creates a ray object. 
     * 
     * @param {Number} x
     * @param {Number} y
     */
    init: function( x, y)
    {
        this._super(x,y);
    },
    
    
    isHorizontal: function()
    {
       return this.x != 0;
    },
    
    similarity: function( otherRay)
    {
       return Math.abs(this.dot(otherRay));
    },
    
    getAveraged: function( otherRay)
    {
        return new  .geo.Ray((this.x + otherRay.x) / 2, (this.y + otherRay.y) / 2);
    }

});
