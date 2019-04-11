import { Point } from "./Point";

export class Ray extends Point {
    constructor(x: number, y: number) {
        super(x, y);
    }

    isHorizontal() {
        return this.x != 0;
    }

    similarity(otherRay: Ray) {
        return Math.abs(this.dot(otherRay));
    }

    getAveraged(other: Ray) {
        return new Ray((this.x + other.x) / 2, (this.y + other.y) / 2);
    }
}