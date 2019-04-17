
/**
 * @class  .policy.figure.VerticalEditPolicy
 *
 * An EditPolicy for use with Figures. With this edit policy you can move the shape only in a vertical manner.
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *
 *       // add some demo figure to the canvas
 *       var circle =new  .shape.basic.Circle({diameter:50, x:10, y:30});
 *       canvas.add(circle);
 *
 *       // add the edit policy to the shape. At this point you can move the shape only
 *       // horizontal
 *       circle.installEditPolicy(new  .policy.figure.VerticalEditPolicy());
 *
 *
 * @author Andreas Herz
 *
 * @extends  .policy.figure.DragDropEditPolicy
 */
import   from '../../packages';

 .policy.figure.VerticalEditPolicy =  .policy.figure.DragDropEditPolicy.extend({

    NAME : " .policy.figure.VerticalEditPolicy",

    /**
     * @constructor
     * Creates a new constraint object
     */
    init: function( attr, setter, getter)
    {
        this._super( attr, setter, getter);
    },


    /**
     * @method
     * It is only possible to drag&drop the element in a vertical line
     *
     * @param { .Figure} figure
     * @param {Number| .geo.Point} x
     * @param {number} [y]
     * @returns { .geo.Point} the constraint position of the figure
     */
    adjustPosition: function(figure, x, y)
    {
        return new  .geo.Point(figure.getX(),y);
    }

});
