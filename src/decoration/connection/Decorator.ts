import { Color } from '../../imports';

export abstract class Decorator {

	width: number;
	height: number;
	color: any;
	backgroundColor: any;

	constructor(width?: number, height?: number) {

		if (typeof width === "undefined" || width < 1) {
			this.width = 20;
		}
		else {
			this.width = width;
		}

		if (typeof height === "undefined" || height < 1) {
			this.height = 15;
		}
		else {
			this.height = height;
		}

		this.color = new Color(0, 0, 0);
		this.backgroundColor = new Color(250, 250, 250);
	}

	abstract paint(paper: RaphaelPaper);

	setColor(c: Color) {
		this.color = c.clone();

		return this;
	}

	setBackgroundColor(c: Color) {
		this.backgroundColor = c.clone();

		return this;
	}

	setDimension(width: number, height: number) {
		this.width = width;
		this.height = height;

		return this;
	}
}
