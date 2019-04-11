import { Canvas } from '../Canvas';

export abstract class Writer {
    constructor() {

    }

    abstract marshal(canvas: Canvas, resultCallback: Function);

    formatXml(xml) {
        let formatted = '';
        let reg = new RegExp("(>)(<)(\/*)", "g");
        xml = xml.replace(reg, '$1\r\n$2$3');
        let pad = 0;
        xml.split('\r\n').forEach(function (node) {
            let indent = 0;
            if (node.match(new RegExp(".+<\/\w[^>]*>$"))) {
                indent = 0;
            } else if (node.match(new RegExp("^<\/\w"))) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match(new RegExp("^<\w[^>]*[^\/]>.*$"))) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }

}
