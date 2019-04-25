import { Type, ZoomPolicy, Point, Canvas, shifty } from '../../imports'


@Type('WheelZoomPolicy')
export class WheelZoomPolicy extends ZoomPolicy {
  center: Point;
  debouncedZoomedCallback: () => void;

  constructor() {
    super();
    this.center = null
    this.debouncedZoomedCallback = this._debounce(() => {
      let canvas = this.canvas
      if (canvas !== null) {
        canvas.fireEvent("zoomed", { value: canvas.zoomFactor })
      }
      this.center = null
    }, 200);
  }

  onInstall(canvas: Canvas) {
    super.onInstall(canvas)

    canvas.setZoom(1, false)
    canvas['__wheelZoom'] = 1
  }

  onUninstall(canvas: Canvas) {
    super.onUninstall(canvas);
    delete canvas['__wheelZoom'];
  }

  onMouseWheel(wheelDelta: number, x: number, y: number, shiftKey?: boolean, ctrlKey?: boolean) {
    if (shiftKey === false) {
      return true
    }

    wheelDelta = wheelDelta / 1024

    let newZoom = ((Math.min(5, Math.max(0.1, this.canvas.zoomFactor + wheelDelta)) * 10000 | 0) / 10000)
    if (this.center === null) {
      this.center = new Point();
      let client: Point = this.canvas.fromCanvasToDocumentCoordinate(x, y)

      this.center.setX(x); this.center.setY(y);
      (this.center as any).clientX = client.getX();
      (this.center as any).clientY = client.getY();
    }
    this._zoom(newZoom, this.center)
    this.debouncedZoomedCallback()

    return false
  }

  setZoom(zoomFactor: number, animated: boolean) {


    let scrollTop = this.canvas.getScrollTop()
    let scrollLeft = this.canvas.getScrollLeft()
    let scrollWidth = this.canvas.getScrollArea().width()
    let scrollHeight = this.canvas.getScrollArea().width()
    let centerY = scrollTop + (scrollHeight / 2) * this.canvas.zoomFactor
    let centerX = scrollLeft + (scrollWidth / 2) * this.canvas.zoomFactor

    if (animated) {
      let myTweenable = new shifty.Tweenable()
      myTweenable.tween({
        from: { 'x': this.canvas.zoomFactor },
        to: { 'x': zoomFactor },
        duration: 300,
        easing: "easeOutSine",
        step: params => {
          this._zoom(params.x, { clientY: centerY, clientX: centerX });
        },
        finish: state => {
          this.debouncedZoomedCallback()
        }
      })
    }
    else {
      this._zoom(zoomFactor, { x: centerX, y: centerY })
      this.debouncedZoomedCallback()
    }
  }


  _zoom(zoom: number, center: Point | any) {
    let canvas = this.canvas

    if (zoom === canvas.zoomFactor) {
      return
    }

    canvas.zoomFactor = zoom

    canvas.paper.setViewBox(0, 0, canvas.initialWidth, canvas.initialHeight)

    canvas.html
      .find("svg")
      .attr({
        'width': canvas.initialWidth / zoom,
        'height': canvas.initialHeight / zoom
      })

    if (center.clientX) {
      let coordsAfter = canvas.fromCanvasToDocumentCoordinate(center.x, center.y)
      canvas.scrollTo(this.canvas.getScrollTop() - (center.clientY - coordsAfter.y), canvas.getScrollLeft() - (center.clientX - coordsAfter.x))
    }

    canvas.fireEvent("zoom", { value: canvas.zoomFactor })
  }


  _debounce(func, wait, immediate?: boolean) {
    let timeout
    let context = this;
    return function () {
      let args = arguments
      let later = () => {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      let callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }
}
