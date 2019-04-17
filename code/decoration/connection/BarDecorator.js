/**
 * @class  .decoration.connection.BarDecorator
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
 *     c.setSourceDecorator(new  .decoration.connection.BarDecorator());
 *     c.setTargetDecorator(new  .decoration.connection.BarDecorator());
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


 .decoration.connection.BarDecorator =  .decoration.connection.Decorator.extend({

	NAME : " .decoration.connection.BarDecorator",

	/**
	 * @constructor
	 *
	 * @param {Number} [width] the width of the bar
	 * @param {Number} [height] the height of the bar
	 */
	init: function(width, height)
	{
        this._super( width, height);
	},

	/**
	 * @method
	 * Draw a bar decoration.
	 *
	 *
	 * @param {Raphael} paper the raphael paper object for the paint operation
	 **/
	paint: function(paper)
	{
		var st = paper.set();
		var path = ["M", this.width/2," " , -this.height/2];  // Go to the top center..
		path.push(  "L", this.width/2, " ", this.height/2);   // ...bottom center...

		st.push(
	        paper.path(path.join(""))
		);
		st.attr({fill:this.backgroundColor.hash(),stroke:this.color.hash()});
		return st;
	}

});

