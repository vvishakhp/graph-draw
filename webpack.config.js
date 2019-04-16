var path = require('path');
var webpack = require('webpack');

var env = {
    dev: true
};

var config = {
    mode: env.dev ? 'development' : 'production',
    entry: './src/index',
    devtool: 'inline-source-map',
    output: {
        filename: 'ts-graph.js',
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [{
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.xml'],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    plugins: [
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        })
    ],
};


module.exports = config;