
/**
 * @class  .policy.figure.HBusSelectionFeedbackPolicy
 *
 *
 * @author Andreas Herz
 * @extends  .policy.figure.BusSelectionFeedbackPolicy
 */
import   from '../../packages';

 .policy.figure.HBusSelectionFeedbackPolicy =  .policy.figure.BusSelectionFeedbackPolicy.extend({

    NAME : " .policy.figure.HBusSelectionFeedbackPolicy",
    /**
     * @constructor
     * Creates a new Router object
     */
    init: function( attr, setter, getter)
    {
        this._super( attr, setter, getter);
    },

    /**
     * @method
     * Callback if the figure has been moved
     *
     * @param figure
     *
     * @template
     */
    moved: function(canvas, figure){
        if(figure.selectionHandles.isEmpty()){
            return; // silently
        }
        var r4= figure.selectionHandles.find(function(handle){return handle.type===4});
        var r8= figure.selectionHandles.find(function(handle){return handle.type===8});

        r4.setDimension(r4.getWidth(), figure.getHeight());
        r8.setDimension(r4.getWidth(), figure.getHeight());

        this._super(canvas,figure);
     }


});
