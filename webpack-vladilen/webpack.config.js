const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    context: path.resolve(__dirname, 'src'), // корневая папка исходников для сборки (путь должен быть абсолютным)
    mode: 'development',
    entry: {
        main: './index.js',
        analytics: './analytics.js'
    },
    output: {
        filename: '[name].bundle.[contenthash].js',
        path: path.resolve(__dirname, 'dist') // корневая папка для билда (путь должен быть абсолютным
    },
    plugins: [
        new HTMLWebpackPlugin({ // цепляет HTML-файлы в качестве исходников
            template: './index.html'
        }),
        new CleanWebpackPlugin() // чистит старые сборки файлов из optput-папки
    ],
    module: {
        rules: [
            {
                test: /\.css$/, // регулярник для выбора типа файлов по расширрению
                use: ['style-loader', 'css-loader'] // какие лоадеры применять (применяется справа-налево) - css грузит файл, а style - подключает в шапку
            }
        ]
    }
}