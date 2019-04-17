/**
 * @class  .shape.icon.Question2

 * See the example:
 *
 *     @example preview small frame
 *
 *     let icon =  new  .shape.icon.Question2();
 *     icon.setDimension(150,100);
 *     canvas.add(icon,50,10);
 *
 * @inheritable
 * @author Andreas Herz
 * @extends  .shape.icon.Icon
 */
import   from '../../packages'

 .shape.icon.Question2 =  .shape.icon.Icon.extend({
  NAME: " .shape.icon.Question2",

  /**
   *
   * @constructor
   * Creates a new figure element which are not assigned to any canvas.
   *
   * @param {Object} attr the configuration of the shape
   */
  init: function (attr, setter, getter) {
    this._super(extend({width: 50, height: 50}, attr), setter, getter)
  },

  /**
   * @private
   * @returns
   */
  createSet: function () {
    return this.canvas.paper.path("M26.711,14.086L16.914,4.29c-0.778-0.778-2.051-0.778-2.829,0L4.29,14.086c-0.778,0.778-0.778,2.05,0,2.829l9.796,9.796c0.778,0.777,2.051,0.777,2.829,0l9.797-9.797C27.488,16.136,27.488,14.864,26.711,14.086zM16.431,21.799c-0.248,0.241-0.543,0.362-0.885,0.362c-0.343,0-0.638-0.121-0.886-0.362c-0.247-0.241-0.371-0.533-0.371-0.876s0.124-0.638,0.371-0.885c0.248-0.248,0.543-0.372,0.886-0.372c0.342,0,0.637,0.124,0.885,0.372c0.248,0.247,0.371,0.542,0.371,0.885S16.679,21.558,16.431,21.799zM18.911,15.198c-0.721,0.716-1.712,1.147-2.972,1.294v2.027h-0.844v-3.476c0.386-0.03,0.768-0.093,1.146-0.188c0.38-0.095,0.719-0.25,1.019-0.464c0.312-0.227,0.555-0.5,0.729-0.822c0.174-0.322,0.261-0.77,0.261-1.346c0-0.918-0.194-1.623-0.582-2.113c-0.389-0.49-0.956-0.735-1.701-0.735c-0.281,0-0.527,0.042-0.738,0.124s-0.366,0.16-0.464,0.234c0.031,0.146,0.072,0.357,0.124,0.633c0.052,0.275,0.078,0.486,0.078,0.633c0,0.226-0.098,0.433-0.294,0.619c-0.195,0.187-0.479,0.28-0.853,0.28c-0.33,0-0.565-0.113-0.706-0.339s-0.211-0.489-0.211-0.789c0-0.244,0.067-0.484,0.201-0.72c0.135-0.235,0.346-0.463,0.633-0.684c0.245-0.195,0.577-0.364,0.995-0.504c0.419-0.141,0.854-0.211,1.308-0.211c0.647,0,1.223,0.103,1.724,0.308c0.502,0.205,0.914,0.479,1.238,0.822c0.337,0.355,0.586,0.755,0.748,1.198c0.162,0.444,0.243,0.926,0.243,1.446C19.994,13.558,19.633,14.482,18.911,15.198z")
  }
})

