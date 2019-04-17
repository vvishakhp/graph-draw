/**
 * @class  .layout.anchor.ConnectionAnchor
 *  An object to which a {@link  .Connection} will be anchored.
 *
 * @inheritable
 * @author Andreas Herz
 */
import   from '../../packages'


 .layout.anchor.ConnectionAnchor = Class.extend({
  NAME: " .layout.anchor.ConnectionAnchor",

  /**
   * @constructor
   *
   * @param { .Figure} owner the figure to use for the anchor calculation
   */
  init: function (owner) {
    this.owner = owner
  },

  /**
   * @method
   * Returns the location where the Connection should be anchored in absolute coordinates.
   * The anchor may use the given reference Point to calculate this location.
   *
   * @param { .geo.Point} reference the opposite reference point
   * @param { .Connection} inquiringConnection the connection who ask for the location.
   *
   * @return { .geo.Point}
   */
  getLocation: function (reference, inquiringConnection) {
    // return the center of the owner/port.
    return this.getReferencePoint(inquiringConnection)
  },

  /**
   * @method
   * Returns the Figure that contains this ConnectionAnchor.
   *
   * @return { .Figure} The Figure that contains this ConnectionAnchor
   */
  getOwner: function () {
    return this.owner
  },

  /**
   * @method
   * Set the owner of the Anchor.
   *
   * @param { .Figure} owner the new owner of the anchor locator
   */
  setOwner: function (owner) {
    if (typeof owner === "undefined") {
      throw "Missing parameter for 'owner' in ConnectionAnchor.setOwner"
    }
    this.owner = owner
  },

  /**
   * @method
   * Returns the bounds of this Anchor's owner.  Subclasses can override this method
   * to adjust the box. Maybe you return the box of the port parent (the parent figure)
   *
   * @return { .geo.Rectangle} The bounds of this Anchor's owner
   */
  getBox: function () {
    return this.getOwner().getAbsoluteBounds()
  },

  /**
   * @method
   * Returns the reference point for this anchor in absolute coordinates. This might be used
   * by another anchor to determine its own location.
   *
   * @param { .Connection} [inquiringConnection] the connection who ask for the location.
   *
   * @return { .geo.Point} The reference Point
   */
  getReferencePoint: function (inquiringConnection) {
    return this.getOwner().getAbsolutePosition()
  }
})
