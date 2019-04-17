
/**
 * @class  .layout.mesh.MeshLayouter
 * Layouter for a mesh or grid.
 *
 * @author Andreas Herz
 */
import   from '../../packages';

 .layout.mesh.MeshLayouter = Class.extend({

	/**
	 * @constructor
	 * Creates a new layouter object.
	 */
    init: function(){
    },

    /**
     * @method
     * Return a changes list for an existing mesh/canvas to ensure that the element to insert
     * did have enough space.
     *
     * @param { .Canvas} canvas the canvas to use for the analytic
     * @param { .Figure} figure The figure to add to the exising canvas
     *
     *
     * @return { .util.ArrayList} a list of changes to apply if the user want to insert he figure.
     */
    add: function( canvas, figure)
    {
    	return new  .util.ArrayList();
    }
});
