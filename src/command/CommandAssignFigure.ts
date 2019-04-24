import { Command } from './Command';
import { Figure } from '../Figure';
import ArrayList from '../util/ArrayList';
import { Node } from '../shape/node/Node';
import { Composite } from '../shape/composite/Composite';
import { SetFigure } from '../SetFigure';

export class CommandAssignFigure extends Command {
  figure: Node;
  composite: any;
  assignedConnections: any;
  isNode: boolean;
  oldBoundingBox: any;

  constructor(figure: Node, composite: Composite) {
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

    if (this.isNode === true) {
      let connections = this.figure.getConnections()
      connections.each((i, connection) => {
        if (connection.getSource().getParent().getComposite() === this.composite && connection.getTarget().getParent().getComposite() === this.composite) {
          if (connection.getComposite() !== this.composite) {
            this.assignedConnections.add({ oldComposite: connection.getComposite(), connection: connection })
            this.composite.assignFigure(connection)
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