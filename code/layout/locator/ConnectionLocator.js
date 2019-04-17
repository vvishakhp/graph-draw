/**
 * @class  .layout.locator.ConnectionLocator
 *
 * Repositions a Figure attached to a Connection when the
 * Connection is moved. Provides for alignment at the start
 * (source), middle, or end (target) of the Connection.
 *
 * @author Andreas Herz
 * @extend  .layout.locator.Locator
 */
import   from '../../packages'

 .layout.locator.ConnectionLocator =  .layout.locator.Locator.extend({
  NAME: " .layout.locator.ConnectionLocator",

  /**
   * @constructor
   * Default constructor for a Locator which can layout a figure in context of a
   * {@link  .Connector}
   */
  init: function () {
    this._super()
  }

})
