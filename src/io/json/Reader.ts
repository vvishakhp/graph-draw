import { Reader } from '../Reader';
import { Canvas } from '../../Canvas';
import ArrayList from '../../util/ArrayList';
import { createInstenceFromType } from '../../TypeRegistry';


export class JsonReader extends Reader {
    unmarshal(canvas: Canvas, json: any) {
        // throw new Error('Not implimented');

        var _this = this;
        var result = new ArrayList();

        if (typeof json === "string") {
            json = JSON.parse(json);
        }

        var node = null;
        json.forEach((element) => {
            try {
                let o = _this.createFigureFromElement(element) || _this.createFigureFromType(element.type);
                let source = null;
                let target = null;
                for (let i in element) {
                    var val = element[i];
                    if (i === "source") {
                        node = canvas.getFigure(val.node);
                        if (node === null) {
                            throw "Source figure with id '" + val.node + "' not found";
                        }
                        source = node.getPort(val.port);
                        if (source === null) {
                            throw "Unable to find source port '" + val.port + "' at figure '" + val.node + "' to unmarschal '" + element.type + "'";
                        }
                    }
                    else if (i === "target") {
                        node = canvas.getFigure(val.node);
                        if (node === null) {
                            throw "Target figure with id '" + val.node + "' not found";
                        }
                        target = node.getPort(val.port);
                        if (target === null) {
                            throw "Unable to find target port '" + val.port + "' at figure '" + val.node + "' to unmarschal '" + element.type + "'";
                        }
                    }
                }
                if (source !== null && target !== null) {
                    // don't change the order or the source/target set.
                    // TARGET must always be the second one because some applications needs the "source"
                    // port in the "connect" event of the target.
                    o.setSource(source);
                    o.setTarget(target);
                }
                o.setPersistentAttributes(element);
                canvas.add(o);
                result.add(o);
            }
            catch (exc) {
                console.error(element, "Unable to instantiate figure type '" + element.type + "' with id '" + element.id + "' during unmarshal by JsonReader Skipping figure..");
                console.error(exc);
                console.warn(element);
            }
        });

        // restore group assignment
        //
        json.forEach(element => {
            if (typeof element.composite !== "undefined") {
                let figure = canvas.getFigure(element.id);
                if (figure === null) {
                    figure = canvas.getLine(element.id);
                }
                let group = canvas.getFigure(element.composite);
                group.assignFigure(figure);
            }
        });

        // recalculate all crossings and repaint the connections with
        // possible crossing decoration
        canvas.calculateConnectionIntersection();
        canvas.getLines().each((i, line) => {
            line.svgPathString = null;
            line.repaint();
        });
        canvas.linesToRepaintAfterDragDrop = canvas.getLines().clone();

        canvas.showDecoration();

        return result;
    }

    createFigureFromElement(element: any) {
        console.error('This method is not implimented. Please do not use this');
        return null;
    }

    createFigureFromType(type: string) {
        return createInstenceFromType(type);
    }
}