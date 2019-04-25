export class Color {

    private hashString = null;

    private red: number;
    private green: number;
    private blue: number;

    constructor(red: number | Color | string = null, green: number = null, blue: number = null) {
        if (red === null && green === null && blue === null) {
            this.hashString = "none";
        } else {
            this.red = (red || 0) as number;
            this.green = green || 0;
            this.blue = blue || 0;
        }

        if (red instanceof Color) {
            this.red = red.getRed();
            this.green = red.getGreen();
            this.blue = red.getBlue();
        } else if (typeof red === 'string') {
            let cl = this.hex2rgb(red);
            this.red = cl[0];
            this.green = cl[1];
            this.blue = cl[2];
        }

        this.hash();
    }

    getGreen() {
        return this.green;
    }

    getRed() {
        return this.red;
    }

    getBlue() {
        return this.blue;
    }

    getHTMLStyle() {
        return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    }

    getIdealTextColor() {
        let nThreshold = 105;
        let bgDelta = (this.red * 0.299) + (this.green * 0.587) + (this.blue * 0.114);
        return (255 - bgDelta < nThreshold) ? new Color(0, 0, 0) : new Color(255, 255, 255);
    }

    hex2rgb(hexColor: string) {
        hexColor = hexColor.replace("#", "");
        return (
            {
                0: parseInt(hexColor.substr(0, 2), 16),
                1: parseInt(hexColor.substr(2, 2), 16),
                2: parseInt(hexColor.substr(4, 2), 16)
            }
        );
    }

    hex() {
        return (this.int2hex(this.red) + this.int2hex(this.green) + this.int2hex(this.blue))
    }

    hash() {
        if (this.hashString != 'none') {
            this.hashString = '#' + this.hex();
        }
        return this.hashString;
    }

    int2hex(v: number) {
        v = Math.round(Math.min(Math.max(0, v), 255));
        return ("0123456789ABCDEF".charAt((v - v % 16) / 16) + "0123456789ABCDEF".charAt(v % 16));
    }

    darker(fraction: number) {
        if (this.hashString === "none")
            return this;

        var red = parseInt(Math.round(this.getRed() * (1.0 - fraction)) + '');
        var green = parseInt(Math.round(this.getGreen() * (1.0 - fraction)) + '');
        var blue = parseInt(Math.round(this.getBlue() * (1.0 - fraction)) + '');

        if (red < 0) red = 0; else if (red > 255) red = 255;
        if (green < 0) green = 0; else if (green > 255) green = 255;
        if (blue < 0) blue = 0; else if (blue > 255) blue = 255;

        return new Color(red, green, blue);
    }

    lighter(fraction: number) {
        if (this.hashString === "none")
            return this;

        var red = parseInt(Math.round(this.getRed() * (1.0 + fraction)) + '');
        var green = parseInt(Math.round(this.getGreen() * (1.0 + fraction)) + '');
        var blue = parseInt(Math.round(this.getBlue() * (1.0 + fraction)) + '');

        if (red < 0) red = 0; else if (red > 255) red = 255;
        if (green < 0) green = 0; else if (green > 255) green = 255;
        if (blue < 0) blue = 0; else if (blue > 255) blue = 255;

        return new Color(red, green, blue);
    }

    fadeTo(color: Color, percent: number) {
        var r = Math.floor(this.red + (percent * (color.red - this.red)) + .5);
        var g = Math.floor(this.green + (percent * (color.green - this.green)) + .5);
        var b = Math.floor(this.blue + (percent * (color.blue - this.blue)) + .5);

        return new Color(r, g, b);
    }

    equals(o: Color) {
        if (!(o instanceof Color)) {
            return false;
        }
        return this.hash() == o.hash();
    }

    clone(): Color {
        return new Color(this.red, this.green, this.blue);
    }
}

