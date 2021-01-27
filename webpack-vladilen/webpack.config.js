const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const optimization = (isProd) => {
    let setts = {
        // чтобы не было дублирования кода подключаемых модулей
        // т.е. например jquery билдился не во все точки входа (index, analytics), а только в одну
        splitChunks: {
            chunks: 'all'
        },
    }
    if (isProd) {
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
    //console.log('[webpack.config.js] env.production =', env.production, 'env.development =', env.development);
    // development: env.development === true
    // production: env.production === true
    let isProd = env.production === true;

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
            filename: (isProd ? '[name].[hash].js' : '[name].js'),
            path: path.resolve(__dirname, 'dist') // корневая папка для билда (путь должен быть абсолютным
        },

        plugins: [
            new HTMLWebpackPlugin({ // цепляет HTML-файлы в качестве исходников
                template: './index.html',
                minify: false // включает минификацию html (по-умолчанию true в production и false в development)
            }),

            // сохраняет загруженные лоадером css-ки в отдельные файлы
            new MiniCssExtractPlugin({
                filename: (isProd ? '[name].[hash].css' : '[name].css'),
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

        optimization: optimization(isProd),

        // лоадеры
        // несколько лоадеров в массиве применяются справа-налево
        module: {
            rules: [
                { // css
                    test: /\.css$/, // регулярник для выбора типа файлов по расширрению
                    //use: ['style-loader', 'css-loader'] // style-loader подключает стили в шапку ИНЛАЙНОВО
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader, // плагин выгружает CSS в отдельные файлы (а не илайново в шапку как style-loader)
                            options: {
                                publicPath: '', // без этого параметра компиляция завершается с ошибкой
                            },
                        },
                        'css-loader',
                    ]
                },
                { // less
                    test: /\.less$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '', // без этого параметра компиляция завершается с ошибкой
                            },
                        },
                        'css-loader',
                        'less-loader', // кроме лоадера требуется одноименный пакет less (интерпретатор)
                    ]
                },
                { // sass/scss
                    test: /\.s[ac]ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '', // без этого параметра компиляция завершается с ошибкой
                            },
                        },
                        'css-loader',
                        'sass-loader', // кроме лоадера требуется пакет sass (интерпретатор)
                    ]
                },
                { // картинки
                    test: /\.(png)|(jpg)|(jpeg)|(svg)|(gif)$/,
                    loader: 'file-loader',
                    options: { // если используем options, то вместо use должен быть loader
                        name: 'images/[name].[ext]', // папки создаются автоматом
                    }
                },
                { // шрифты
                    test: /\.(ttf)|(woff)|(eot)$/,
                    loader: 'file-loader',
                    options: { // если используем options, то вместо use должен быть loader
                        name: 'fonts/[name].[ext]', // папки создаются автоматом
                    }
                },
                { // xml
                    test: /\.xml$/,
                    use: ['xml-loader']
                },
                { // csv
                    test: /\.csv$/,
                    use: ['csv-loader'] // требует для своей работы papaparse (ставим csv-loader и papaparse)
                },
                { // babel
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        }
    }
}