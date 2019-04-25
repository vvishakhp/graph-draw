import { Type, PortLocator, Figure } from '../../imports';

@Type('InputPortLocator')
export class InputPortLocator extends PortLocator {
  relocate(index: number, figure: Figure) {
    let node = figure.getParent()

    let dividerFactor = 1
    let thisNAME = (this as any).NAME
    let portIndex = 1
    node.getPorts().each((i, p) => {
      portIndex = (p === figure) ? dividerFactor : portIndex
      dividerFactor += p.getLocator().NAME === thisNAME ? 1 : 0
    })
    this.applyConsiderRotation(figure, 0, (node.getHeight() / dividerFactor) * portIndex)
  }
}
