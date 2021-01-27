import Post from './Post'
import * as $ from 'jquery'
import './styles/styles.css'
import './styles/less.less'
import './styles/scss.scss'
import logo from './assets/webpack-logo.png'
import json from './assets/json.json' // для JSON лоадеров не требуется
import xml from './assets/data.xml'
import csv from './assets/data.csv'

const post = new Post('Webpack post title!', logo)
console.log('index.js ready!')
console.log('json', json)
console.log('xml', xml)
console.log('csv', csv)
console.log('Post to string:', post.toString())
$('pre').html(post.toString())