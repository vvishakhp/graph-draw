/**
 * @class  .layout.locator.InputPortLocator
 *
 * Repositions a Figure attached to a Connection when the
 * Connection is moved. Provides for alignment at the start
 * (source), middle, or end (target) of the Connection.
 *
 * @author Andreas Herz
 * @extend  .layout.locator.Locator
 */
import   from '../../packages'

 .layout.locator.InputPortLocator =  .layout.locator.PortLocator.extend({
  NAME: " .layout.locator.InputPortLocator",

  /**
   * @constructor
   * Default constructor for a Locator which can layout a port in context of a
   * {@link  .shape.node.Node}
   *
   */
  init: function () {
    this._super()
  },

  /**
   * @method
   * Controls the location of an {@link  .Figure}
   *
   * @param {Number} index port index of the figure
   * @param { .Figure} figure the figure to control
   *
   * @template
   **/
  relocate: function (index, figure) {
    let node = figure.getParent()

    let dividerFactor = 1
    let thisNAME = this.NAME
    let portIndex = 1
    node.getPorts().each((i, p) => {
      portIndex = (p === figure) ? dividerFactor : portIndex
      dividerFactor += p.getLocator().NAME === thisNAME ? 1 : 0
    })
    this.applyConsiderRotation(figure, 0, (node.getHeight() / dividerFactor) * portIndex)
  }

})



