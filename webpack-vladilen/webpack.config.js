const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const optimization = (env)=>{
    let setts = {
        // чтобы например jquery билдился не во все точки входа (index, analytics), а только в одну
        splitChunks: {
            chunks: 'all'
        },
    }
    if (env.production) {
        // минимизация CSS и JS
        setts['minimize'] = true;
        setts['minimizer'] = [
            new CssMinimizerPlugin(), // CSS
            new TerserPlugin() // JS
        ]
    }
    return setts;
}

module.exports = env => {
    // development: env.development === true
    // production: env.production === true
    // console.log('webpack.config.js env.production =', env.production, 'env.development =', env.development);
    return {

        // корневая папка исходников для сборки (путь должен быть абсолютным), чтобы не писать везде path.resolve(__dirname, 'src')
        context: path.resolve(__dirname, 'src'),

        // или production
        mode: 'development',

        // точки входа
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
                template: './index.html',
                minify: false // включает минификацию html (по-умолчанию true в production и false в development)
            }),

            // сохраняет загруженные лоадером css-ки в отдельные файлы
            new MiniCssExtractPlugin({
                filename: '[name].bundle.[contenthash].css',
            }),

            // чистит старые сборки файлов из optput-папки
            new CleanWebpackPlugin(),

            // копирует из src в dist/build
            new CopyWebpackPlugin({
                patterns: [
                    {
                        //from: path.resolve(__dirname, 'src/favicon.ico'),
                        from: './favicon.ico',
                        to: path.resolve(__dirname, 'dist')
                    }
                ]
            })
        ],

        // изменения в реальном времени с module hot replacement (в package.json скрипт watch)
        // но эти изменения в папку build/dist не попадают, они остаются в оперативке, и нужно делать обачный билд (dev/prod)
        devServer: {
            open: true, // открывать окно юраузера при запуске
            port: 4200,
        },

        optimization: optimization(env),

        // лоадеры
        // несколько лоадеров в массиве применяются справа-налево
        module: {
            rules: [
                {
                    test: /\.css$/, // регулярник для выбора типа файлов по расширрению
                    //use: ['style-loader', 'css-loader'] // css-* грузит файл, а style-* - подключает в шапку ИНЛАЙНОВО
                    // вариант с выгрузкой CSS в отдельные файлы (а не илайново в шапку)
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '', // без этого параметра компиляция завершается с ошибкой
                            },
                        },
                        'css-loader',
                    ]
                },
                {
                    test: /\.(png)|(jpg)|(jpeg)|(svg)|(gif)$/, // картиноки
                    use: ['file-loader']
                },
                {
                    test: /\.(ttf)|(woff)|(eot)$/, // шрифты
                    use: ['file-loader']
                },
                {
                    test: /\.xml$/, // xml
                    use: ['xml-loader']
                },
                {
                    test: /\.csv$/, // csv
                    use: ['csv-loader'] // требует для своей работы papaparse, т.е. ставить нужно csv-loader и papaparse
                }
            ]
        }
    }
}