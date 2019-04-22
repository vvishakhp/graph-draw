import $ = require('./util/jquery_extentions');
import { Canvas } from './Canvas';


$(function () {
    new Canvas('holder', 3000, 3000);
});