import Raphael = require('raphael');

// extending raphael with a polygon function
Raphael.fn.polygon = (pointString) => {
  var poly = ['M'];
  var point = pointString.split(' ');

  for (var i = 0; i < point.length; i++) {
    var c = point[i].split(',');
    for (var j = 0; j < c.length; j++) {
      var d = parseFloat(c[j]);
      if (!isNaN(d))
        poly.push(d + '');
    };
    if (i == 0)
      poly.push('L');
  }
  poly.push('Z');

  return this.path(poly);
};



// hacking RaphaelJS to support groups of elements
//
(() => {
  Raphael.fn.group = (f, g) => {
    var enabled = document.getElementsByTagName("svg").length > 0;
    if (!enabled) {
      // return a stub for VML compatibility
      return {
        add: () => {
          // intentionally left blank
        }
      };
    }
    var i;
    this.svg = "http://www.w3.org/2000/svg";
    this.defs = document.getElementsByTagName("defs")[f];
    this.svgcanv = document.getElementsByTagName("svg")[f];
    this.group = document.createElementNS(this.svg, "g");
    for (i = 0; i < g.length; i++) {
      this.group.appendChild(g[i].node);
    }
    this.svgcanv.appendChild(this.group);
    this.group.translate = (c, a) => {
      this.setAttribute("transform", "translate(" + c + "," + a + ") scale(" + this.getAttr("scale").x + "," + this.getAttr("scale").y + ")");
    };
    this.group.rotate = (c, a, e) => {
      this.setAttribute("transform", "translate(" + this.getAttr("translate").x + "," + this.getAttr("translate").y + ") scale(" + this.getAttr("scale").x + "," + this.getAttr("scale").y + ") rotate(" + c + "," + a + "," + e + ")");
    };
    this.group.scale = (c, a) => {
      this.setAttribute("transform", "scale(" + c + "," + a + ") translate(" + this.getAttr("translate").x + "," + this.getAttr("translate").y + ")");
    };
    this.group.push = (c) => {
      this.appendChild(c.node);
    };
    this.group.getAttr = (c) => {
      this.previous = this.getAttribute("transform") ? this.getAttribute("transform") : "";
      var a = [], e, h, j;
      a = this.previous.split(" ");
      for (i = 0; i < a.length; i++) {
        if (a[i].substring(0, 1) == "t") {
          var d = a[i], b = [];
          b = d.split("(");
          d = b[1].substring(0, b[1].length - 1);
          b = [];
          b = d.split(",");
          e = b.length === 0 ? { x: 0, y: 0 } : { x: b[0], y: b[1] };
        } else {
          if (a[i].substring(0, 1) === "r") {
            d = a[i];
            b = d.split("(");
            d = b[1].substring(0, b[1].length - 1);
            b = d.split(",");
            h = b.length === 0 ? { x: 0, y: 0, z: 0 } : { x: b[0], y: b[1], z: b[2] };
          } else {
            if (a[i].substring(0, 1) === "s") {
              d = a[i];
              b = d.split("(");
              d = b[1].substring(0, b[1].length - 1);
              b = d.split(",");
              j = b.length === 0 ? { x: 1, y: 1 } : { x: b[0], y: b[1] };
            }
          }
        }
      }
      if (typeof e === "undefined") {
        e = { x: 0, y: 0 };
      }
      if (typeof h === "undefined") {
        h = { x: 0, y: 0, z: 0 };
      }
      if (typeof j === "undefined") {
        j = { x: 1, y: 1 };
      }

      if (c == "translate") {
        var k = e;
      } else {
        if (c == "rotate") {
          k = h;
        } else {
          if (c == "scale") {
            k = j;
          }
        }
      }
      return k;
    };
    this.group.copy = (el) => {
      this.copy = el.node.cloneNode(true);
      this.appendChild(this.copy);
    };
    return this.group;
  };
})();

/**
* adding support method to check if the node is already visible
**/
(() => {
  Raphael.el.isVisible = function () {
    return (this.node.style.display !== "none");
  }
})();


export default Raphael;