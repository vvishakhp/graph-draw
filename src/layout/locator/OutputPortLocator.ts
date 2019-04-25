import { Type, PortLocator, Figure } from '../../imports';

@Type('OutputPortLocator')
export class OutputPortLocator extends PortLocator {
  relocate(index: number, figure: Figure) {
    let node = figure.getParent()
    let dividerFactor = 1
    let thisNAME = (this as any).NAME
    let portIndex = 1
    node.getPorts().each((i, p) => {
      portIndex = (p === figure) ? dividerFactor : portIndex
      dividerFactor += p.getLocator().NAME === thisNAME ? 1 : 0
    })
    this.applyConsiderRotation(figure, node.getWidth(), (node.getHeight() / dividerFactor) * portIndex)
  }

}
