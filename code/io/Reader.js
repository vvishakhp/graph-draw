
/**
 * @class  .io.Reader
 * Template class for general import of a document into the canvas.
 *
 * @author andreas Herz
 */
import   from '../packages';


 .io.Reader = Class.extend({

    /**
     * @constructor
     * @private
     */
    init: function(){

    },

    /**
     * @method
     *
     * Restore the canvas from a given String.
     *
     * @param { .Canvas} canvas the canvas to restore
     * @param {Object} document the document to read
     *
     * @return { .util.ArrayList} the added elements
     * @template
     */
    unmarshal: function(canvas, document){
        // do nothing. Inherit classes must implement this method
    }

});
