import { Figure } from '../../imports';

export class ConnectionAnchor {
  constructor(private owner: Figure) {

  }


  getLocation(reference, inquiringConnection) {
    return this.getReferencePoint(inquiringConnection)
  }


  getOwner() {
    return this.owner
  }


  setOwner(owner) {
    if (typeof owner === "undefined") {
      throw "Missing parameter for 'owner' in ConnectionAnchor.setOwner"
    }
    this.owner = owner
  }


  getBox() {
    return this.getOwner().getAbsoluteBounds()
  }


  getReferencePoint(inquiringConnection) {
    return this.getOwner().getAbsolutePosition()
  }
}
