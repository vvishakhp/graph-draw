import { Decorator } from "./Decorator";

export class CircleDecorator extends Decorator {
	paint(paper: RaphaelPaper) {
		var st = paper.set();

		st.push(paper.circle(0, 0, this.width / 2));
		st.attr({ fill: this.backgroundColor.hash(), stroke: this.color.hash() });

		return st;
	}
}
