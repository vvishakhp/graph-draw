import { } from '../../imports';
export class ArrowDecorator extends Decorator {
	paint(paper: RaphaelPaper) {
		var st = paper.set();

		st.push(paper.path(["M0 0",
			"L", this.width, " ", -this.height / 2,
			"L", this.width, " ", this.height / 2,
			"L0 0"].join("")));

		st.attr({ fill: this.backgroundColor.hash(), stroke: this.color.hash() });

		return st;
	}
}