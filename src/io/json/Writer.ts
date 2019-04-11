import { Writer } from '../Writer';
import Base64Util from '../../util/Base64';

export class JsonWriter extends Writer {
    marshal(canvas: import("../../Canvas").Canvas, resultCallback: Function) {
        var result = [];

        canvas.getFigures().each(function (i, figure) {
            result.push(figure.getPersistentAttributes());
        });

        canvas.getLines().each(function (i, element) {
            result.push(element.getPersistentAttributes());
        });

        var base64Content = Base64Util.encode(JSON.stringify(result, null, 2));

        resultCallback(result, base64Content);
    }
}
