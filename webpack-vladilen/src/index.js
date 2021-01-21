import Post from './Post'
import './styles/styles.css'

const post = new Post('Webpack post title!')
console.log('index.js ready!')
console.log('Post to string:', post.toString())