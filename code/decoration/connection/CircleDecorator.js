/**
 * @class  .decoration.connection.CircleDecorator
 *
 * See the example:
 *
 *     @example preview small frame
 *
 *     // create and add two nodes which contains Ports (In and OUT)
 *     //
 *     var start = new  .shape.node.Start();
 *     var end   = new  .shape.node.End();

 *     // ...add it to the canvas
 *     canvas.add( start, 50,50);
 *     canvas.add( end, 230,80);
 *
 *     // Create a Connection and connect the Start and End node
 *     //
 *     var c = new  .Connection();
 *
 *     // toggle from ManhattenRouter to DirectRouter to show the rotation of decorations
 *     c.setRouter(new  .layout.connection.DirectRouter());
 *
 *     // Set the endpoint decorations for the connection
 *     //
 *     c.setSourceDecorator(new  .decoration.connection.CircleDecorator());
 *     c.setTargetDecorator(new  .decoration.connection.CircleDecorator());
 *     // Connect the endpoints with the start and end port
 *     //
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *
 *     // and finally add the connection to the canvas
 *     canvas.add(c);
 *
 * @inheritable
 * @author Andreas Herz
 * @extend  .decoration.connection.Decorator
 */
import   from '../../packages';


 .decoration.connection.CircleDecorator =  .decoration.connection.Decorator.extend({

	NAME : " .decoration.connection.CircleDecorator",

	/**
	 * @constructor
	 *
	 * @param {Number} [width] the width of the arrow
	 * @param {Number} [height] the height of the arrow
	 */
    init: function(width, height)
    {
        this._super( width, height);
    },

	/**
	 * Draw a filled circle decoration.
     *
	 * @param {Raphael} paper the raphael paper object for the paint operation
	 **/
	paint: function(paper)
	{
        var st = paper.set();

		st.push(paper.circle(0, 0, this.width/2));
        st.attr({fill:this.backgroundColor.hash(),stroke:this.color.hash()});

		return st;
	}
});






