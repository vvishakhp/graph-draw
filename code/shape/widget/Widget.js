/**
 * @class  .shape.widget.Widget
 * Base class for all diagrams.
 *
 * @extends  .SetFigure
 */
import   from '../../packages'

 .shape.widget.Widget =  .SetFigure.extend({

  init: function (attr, setter, getter) {
    this._super(attr, setter, getter)
  }
})
