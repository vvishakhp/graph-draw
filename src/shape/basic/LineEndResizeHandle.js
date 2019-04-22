/**
 * @class  .shape.basic.LineEndResizeHandle
 *
 * Selection handle for connections and normal lines.
 *
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .shape.basic.LineResizeHandle
 */
import   from '../../packages'

 .shape.basic.LineEndResizeHandle =  .shape.basic.LineResizeHandle.extend({
  NAME: " .shape.basic.LineEndResizeHandle",

  init: function (figure) {
    this._super({owner: figure, index: figure.getVertices().getSize() - 1})
  },


  /**
   * @method
   * Return the Port assigned to this ResizeHandle if the line is an instance of  .Connection
   *
   * @return { .Port}
   */
  getRelatedPort: function () {
    if (this.owner instanceof  .Connection) {
      return this.owner.getTarget()
    }

    return null
  },

  /**
   * @method
   * Return the peer Port assigned to this ResizeHandle if the line is an instance of  .Connection
   *
   * @returns { .Port}
   */
  getOppositePort: function () {
    if (this.owner instanceof  .Connection) {
      return this.owner.getSource()
    }

    return null
  },


  /**
   * @method
   * Called from the framework during a drag&drop operation
   *
   * @param {Number} dx the x difference between the start of the drag drop operation and now
   * @param {Number} dy the y difference between the start of the drag drop operation and now
   * @param {Number} dx2 The x diff since the last call of this dragging operation
   * @param {Number} dy2 The y diff since the last call of this dragging operation
   * @return {Boolean}
   * @private
   **/
  onDrag: function (dx, dy, dx2, dy2) {
    this._super(dx, dy, dx2, dy2)

    let objPos = this.owner.getEndPoint().clone()
    objPos.translate(dx2, dy2)

    if (this.command !== null) {
      this.command.updatePosition(objPos)
    }

    this.owner.setEndPoint(objPos)

    this.owner.isMoving = true

    return true
  },

  /**
   * @method
   * Resizehandle has been drop on a InputPort/OutputPort.
   *
   * @param { .Figure} dropTarget
   * @param {Number} x the x-coordinate of the mouse up event
   * @param {Number} y the y-coordinate of the mouse up event
   * @param {Boolean} shiftKey true if the shift key has been pressed during this event
   * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
   * @private
   **/
  onDrop: function (dropTarget, x, y, shiftKey, ctrlKey) {
    this.owner.isMoving = false

    if (this.owner instanceof  .Connection && this.command !== null) {
      this.command.setNewPorts(this.owner.getSource(), dropTarget)
      this.getCanvas().getCommandStack().execute(this.command)
    }
    this.command = null
  },

  /**
   * @method
   * Controls the location of the resize handle
   *
   **/
  relocate: function () {

    let resizeWidthHalf = this.getWidth() / 2
    let resizeHeightHalf = this.getHeight() / 2

    let anchor = this.owner.getEndPoint()

    this.setPosition(anchor.x - resizeWidthHalf, anchor.y - resizeHeightHalf)

    return this
  }
})
