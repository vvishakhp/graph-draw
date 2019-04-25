import { Type, PortLocator, Figure } from '../../imports';

@Type('XYRelPortLocator')
export class XYRelPortLocator extends PortLocator {
  private x: number; y: number;
  constructor(xPercent: number, yPercent: number) {
    super();
    this.x = xPercent;
    this.y = yPercent;
  }

  relocate(index: number, figure: Figure) {
    let parent = figure.getParent()

    this.applyConsiderRotation(
      figure,
      parent.getWidth() / 100 * this.x,
      parent.getHeight() / 100 * this.y
    )
  }
}
