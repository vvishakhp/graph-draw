$(function () {

    /**
     * 
     * @param {string} name 
     */
    var getObject = function (name) {
        return name.split('.').reduce((prev, curr) => prev[curr], window);
    };

    $('#start').click(function () {
        var name = prompt('Give me a name to start', 'draw2d.Figure');
        var cls = getObject(name);

        var proto = cls.prototype;

        
        Object.keys(proto).forEach(function (key) {
            $('#code').append('\n\n' + processObject(proto[key]));
        });
    });

    var processObject = function (obj) {
        if (typeof (obj) === "function") {
            return obj.toString().replace('function ', '');
        } else return '';
    };
})