import { EditPolicy, Type, Figure, Canvas, Color, Base64Util } from "../../imports";


@Type('CanvasPolicy')
export class CanvasPolicy extends EditPolicy {
  protected canvas = null;

  onInstall(canvas) {
    this.canvas = canvas;
  }

  onUninstall(canvas) {
    this.canvas = null;
  }

  onClick(figure: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) {

  }

  onMouseMove(Canvas: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) {

  }

  onDoubleClick(figure: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) {

  }

  onMouseDown(figure: Canvas, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) {

  }

  onMouseDrag(figure: Canvas, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) {

  }

  onMouseUp(figure: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) {

  }

  onRightMouseDown(figure: Figure, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) {

  }

  onMouseWheel(wheelDelta: number, mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean) {

  }
  snap(canvas, figure, modifiedPos, originalPos) {

  }

  createMonochromGif(w, h, d, color: Color) {
    color = color.clone();
    var r = String.fromCharCode(w % 256) + String.fromCharCode(w / 256) + String.fromCharCode(h % 256) + String.fromCharCode(h / 256)

    var gif = "GIF89a" + r + "\xf0\0\0\xff\xff\xff" + String.fromCharCode(color.getRed()) + String.fromCharCode(color.getGreen()) + String.fromCharCode(color.getBlue()) + "\x21\xf9\u{4}\u{1}\0\0\0,\0\0\0\0" + r + "\0\u{2}"

    var b: any = {
      bit: 1,
      byte_: 0,
      data: "",

      writeBit: (b) => {
        if (b) b.byte_ |= b.bit
        b.bit <<= 1
        if (b.bit == 256) {
          b.bit = 1
          b.data += String.fromCharCode(b.byte_)
          b.byte_ = 0
        }
      },

      get: () => {
        let result = ""
        let data = b.data
        if (b.bit != 1) {
          data += String.fromCharCode(b.byte_)
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