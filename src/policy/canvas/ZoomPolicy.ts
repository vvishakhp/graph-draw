import { CanvasPolicy } from "./CanvasPolicy";
import { Type } from "../../TypeRegistry";
import { Canvas } from "../../Canvas";
const shifty = require('shifty');


@Type('ZoomPolicy')
export class ZoomPolicy extends CanvasPolicy {
  onInstall(canvas: Canvas) {
    super.onInstall(canvas);
    canvas.setZoom(1, true);
  }

  onUninstall(canvas: Canvas) {
    super.onUninstall(canvas);
  }

  setZoom(zoomFactor, animated) {
    let canvas = this.canvas

    let _zoom = function (z) {
      canvas.zoomFactor = Math.min(Math.max(0.01, z), 10)

      let viewBoxWidth = (canvas.initialWidth * (canvas.zoomFactor)) | 0
      let viewBoxHeight = (canvas.initialHeight * (canvas.zoomFactor)) | 0

      canvas.paper.setViewBox(0, 0, viewBoxWidth, viewBoxHeight)

      canvas.fireEvent("zoom", { value: canvas.zoomFactor })
    }

    if (animated) {
      let myTweenable = new shifty.Tweenable()
      myTweenable.tween({
        from: { 'x': canvas.zoomFactor },
        to: { 'x': zoomFactor },
        duration: 300,
        easing: "easeOutSine",
        step: params => _zoom(params.x),
        finish: state => canvas.fireEvent("zoomed", { value: canvas.zoomFactor })
      })
    }
    else {
      _zoom(zoomFactor)
      canvas.fireEvent("zoomed", { value: canvas.zoomFactor })
    }
  }
}