import { Command } from './Command';
import { Figure } from '../Figure';
import ArrayList from '../util/ArrayList';
import { Node } from '../shape/node/Node';

export class CommandAssignFigure extends Command {
  figure: Figure;
  composite: Figure;
  assignedConnections: any;
  isNode: boolean;
  oldBoundingBox: any;

  constructor(figure: Figure, composite: Figure) {
    super('Add Shapes to Composite');
    this.figure = figure
    this.composite = composite
    this.assignedConnections = new ArrayList()
    this.isNode = this.figure instanceof Node
    this.oldBoundingBox = composite.getBoundingBox()
  }

  canExecute(): boolean {
    return true;
  }

  execute() {
    this.composite.assignFigure(this.figure)

    // get all connections of the shape and check if source/target node
    // part of the composite. In this case the connection will be part of
    // the composite as well
    if (this.isNode === true) {
      let connections = this.figure.getConnections()
      let _this = this
      connections.each(function (i, connection) {
        if (connection.getSource().getParent().getComposite() === _this.composite && connection.getTarget().getParent().getComposite() === _this.composite) {
          if (connection.getComposite() !== _this.composite) {
            _this.assignedConnections.add({ oldComposite: connection.getComposite(), connection: connection })
            _this.composite.assignFigure(connection)
          }
        }
      })
    }
  }

  cancel() {
    return null;
  }
  
  undo() {
    this.composite.unassignFigure(this.figure)
    this.assignedConnections.each((i, entry) => {
      if (entry.oldComposite !== null) {
        entry.oldComposite.assignFigure(entry.connection)
      }
      else {
        entry.connection.getComposite().unassignFigure(entry.connection)
      }
    })
    this.composite.stickFigures = true
    this.composite.setBoundingBox(this.oldBoundingBox)
    this.composite.stickFigures = false
  }

  redo() {
    this.composite.setBoundingBox(this.oldBoundingBox)
    this.composite.assignFigure(this.figure)
    this.assignedConnections.each((i, entry) => this.composite.assignFigure(entry.connection))
  }
}