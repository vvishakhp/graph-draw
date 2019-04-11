import { Writer } from '../Writer';
import { Canvas } from '../../Canvas';
import Base64Util from '../../util/Base64';

export class SvgWriter extends Writer {
    marshal(canvas: Canvas, resultCallback: Function) {
        var s = canvas.getPrimarySelection();
        canvas.setCurrentSelection(null);
        var svg = canvas.getHtmlContainer().html()
            .replace(/>\s+/g, ">")
            .replace(/\s+</g, "<");
        svg = this.formatXml(svg);
        svg = svg.replace(/<desc>.*<\/desc>/g, "<desc>RPA Genie</desc>");

        canvas.setCurrentSelection(s);

        var base64Content = Base64Util.encode(svg);
        resultCallback(svg, base64Content);
    }
}
