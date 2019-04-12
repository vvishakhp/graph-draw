import { Decorator } from "./Decorator";

export class DiamondDecorator extends Decorator {
	paint(paper: RaphaelPaper) {
		var st = paper.set();

		st.push(
			paper.path(["M", this.width / 2, " ", -this.height / 2,  // Go to the top center..
				"L", this.width, " ", 0,               // ...draw line to the right middle
				"L", this.width / 2, " ", this.height / 2,   // ...bottom center...
				"L", 0, " ", 0,               // ...left middle...
				"L", this.width / 2, " ", -this.height / 2,  // and close the path
				"Z"].join(""))
		);

		st.attr({ fill: this.backgroundColor.hash(), stroke: this.color.hash() });
		return st;
	}

}
