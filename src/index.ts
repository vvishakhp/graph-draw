import $ = require('./util/jquery_extentions');
import { Canvas, RectangleShape, Color, Circle } from './imports';
$(() => {
    var c = new Canvas('holder', 3000, 3000);
    var rect = new Circle({ 'fill': '#a0a0a0' }, {}, {});
    c.add(rect, 200, 200);
    rect.setBackgroundColor(new Color(50, 0, 0));
    console.log(rect);
});