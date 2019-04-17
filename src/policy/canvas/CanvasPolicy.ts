import { EditPolicy } from "../EditPolicy";
import { Type } from "../../TypeRegistry";
import { Figure } from "../../Figure";
import { Canvas } from "../../Canvas";
import Base64Util from "../../util/Base64";
import { Color } from "../../util/Color";

@Type('CanvasPolicy')
export class CanvasPolicy extends EditPolicy {
  protected canvas = null;

  onInstall(canvas) {
    this.canvas = canvas;
  }

  onUninstall(canvas) {
    this.canvas = null;
  }

  onClick(figure: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) { }
  onMouseMove(Canvas: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) { }
  onDoubleClick(figure: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) { }
  onMouseDown(figure: Canvas, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) { }
  onMouseDrag(figure: Canvas, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) { }
  onMouseUp(figure: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) { }
  onRightMouseDown(figure: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) { }
  onMouseWheel(wheelDelta: number, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) { }
  snap(canvas, figure, modifiedPos, originalPos) {
  }

  createMonochromGif(w, h, d, color: Color) {
    color = color.clone();
    var r = String.fromCharCode(w % 256) + String.fromCharCode(w / 256) + String.fromCharCode(h % 256) + String.fromCharCode(h / 256)

    var gif = "GIF89a" + r + "\xf0\0\0\xff\xff\xff" + String.fromCharCode(color.getRed()) + String.fromCharCode(color.getGreen()) + String.fromCharCode(color.getBlue()) + "\x21\xf9\u{4}\u{1}\0\0\0,\0\0\0\0" + r + "\0\u{2}"

    var b = {
      bit: 1,
      byte_: 0,
      data: "",

      writeBit: function (b) {
        if (b) this.byte_ |= this.bit
        this.bit <<= 1
        if (this.bit == 256) {
          this.bit = 1
          this.data += String.fromCharCode(this.byte_)
          this.byte_ = 0
        }
      },

      get: function () {
        let result = ""
        let data = this.data
        if (this.bit != 1) {
          data += String.fromCharCode(this.byte_)
        }
        for (var i = 0; i < data.length + 1; i += 255) {
          let chunklen = data.length - i
          if (chunklen < 0) chunklen = 0
          if (chunklen > 255) chunklen = 255
          result += String.fromCharCode(chunklen) + data.substring(i, i + 255)
        }
        return result + "\0"
      }
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        b.writeBit(d[x + w * y])
        b.writeBit(0)
        b.writeBit(0)
        b.writeBit(0)
        b.writeBit(0)
        b.writeBit(1)
      }
    }
    gif += b.get() + ";"

    return "data:image/gif;base64," + Base64Util.encode(gif);
  }
}