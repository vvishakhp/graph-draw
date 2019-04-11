import ArrayList from "../ArrayList";

export abstract class Spline {
    constructor() {

    }

    abstract generate(controlPoints: ArrayList<any>, parts: number);
}