import { Canvas } from '../Canvas';


export abstract class Reader {
    constructor() {

    }

    abstract unmarshal(canvas: Canvas, document);
}
