import { Type, Locator, Figure } from '../../imports';

@Type('PortLocator')
export class PortLocator extends Locator {
  applyConsiderRotation(port: Figure, x: number, y: number) {
    let parent = port.getParent()

    // determine the width/height before manipulate the 
    // matrix of the shape
    let halfW = parent.getWidth() / 2
    let halfH = parent.getHeight() / 2

    let rotAngle = parent.getRotationAngle()
    let m = Raphael.matrix(1, 0, 0, 1, 0, 0);
    m.rotate(rotAngle, halfW, halfH)
    if (rotAngle === 90 || rotAngle === 270) {
      let ratio = parent.getHeight() / parent.getWidth()
      m.scale(ratio, 1 / ratio, halfW, halfH)
    }

    port.setPosition(m.x(x, y), m.y(x, y))
  }
}