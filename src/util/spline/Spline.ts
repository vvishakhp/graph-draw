import { ArrayList } from '../../imports';

export abstract class Spline {
    constructor() {

    }

    abstract generate(controlPoints: ArrayList<any>, parts: number);
}