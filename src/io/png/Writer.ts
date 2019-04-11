import { Writer } from '../Writer';
import * as canvg from 'canvg-browser';
import { Canvas } from '../../Canvas';
import { Figure } from '../../Figure';
import { Rectangle } from '../../geo/Rectangle';

export class PngWriter extends Writer {
    marshal(canvas: Canvas | Figure, resultCallback: Function, cropBoundingBox?: Rectangle) {

        var svg = "";

        if (canvas instanceof Figure) {
            var origPos = canvas.getPosition();
            canvas.setPosition(1, 1);
            svg = "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" >"
                + canvas.shape.node.outerHTML
                + "</svg>";
            canvas.setPosition(origPos);
            canvas.initialWidth = canvas.getWidth() + 2;
            canvas.initialHeight = canvas.getHeight() + 2;
        }
        // create a snapshot of a complete canvas
        //
        else {
            canvas.hideDecoration();
            svg = canvas.getHtmlContainer().html().replace(/>\s+/g, ">").replace(/\s+</g, "<");

            // add missing namespace for images in SVG if missing
            // depends on raphaelJS version
            if (svg.indexOf("http://www.w3.org/1999/xlink") === -1) {
                svg = svg.replace("<svg ", "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" ");
            }
        }

        let canvasDomNode = $('<canvas id="canvas_png_export_for_draw2d" style="display:none"></canvas>');
        $('body').append(canvasDomNode);
        let fullSizeCanvas = $("#canvas_png_export_for_draw2d")[0] as HTMLCanvasElement;
        fullSizeCanvas.width = canvas.initialWidth;
        fullSizeCanvas.height = canvas.initialHeight;

        canvg("canvas_png_export_for_draw2d", svg, {
            ignoreMouse: true,
            ignoreAnimation: true,
            renderCallback: function () {
                try {
                    if (canvas instanceof Canvas)
                        canvas.showDecoration();

                    if (typeof cropBoundingBox !== "undefined") {
                        let sourceX = cropBoundingBox.getX();
                        let sourceY = cropBoundingBox.getY();
                        let sourceWidth = cropBoundingBox.getWidth();
                        let sourceHeight = cropBoundingBox.getHeight();

                        let croppedCanvas = document.createElement('canvas');
                        croppedCanvas.width = sourceWidth;
                        croppedCanvas.height = sourceHeight;

                        croppedCanvas.getContext("2d").drawImage(fullSizeCanvas, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

                        var dataUrl = croppedCanvas.toDataURL("image/png");
                        var base64Image = dataUrl.replace("data:image/png;base64,", "");
                        resultCallback(dataUrl, base64Image);
                    }
                    else {
                        var img = fullSizeCanvas.toDataURL("image/png");
                        resultCallback(img, img.replace("data:image/png;base64,", ""));
                    }
                }
                finally {
                    canvasDomNode.remove();
                }
            }
        });
    }

}

