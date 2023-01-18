
module.exports = {
    productionSourceMap: false,
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'assets',
    devServer: {
        port: 8080,
        host: '0.0.0.0',
        https: false,
        open: true,
        proxy: {
            "/api": { "target": "http://localhost:8088/" }
        }
    },
}
