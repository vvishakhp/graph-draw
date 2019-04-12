import { Decorator } from "./Decorator";

export class BarDecorator extends Decorator {
	paint(paper: RaphaelPaper) {
		var st = paper.set();
		var path = ["M", this.width / 2, " ", -this.height / 2];  // Go to the top center..
		path.push("L", this.width / 2, " ", this.height / 2);   // ...bottom center...

		st.push(
			paper.path(path.join(""))
		);
		st.attr({ fill: this.backgroundColor.hash(), stroke: this.color.hash() });
		return st;
	}
}
