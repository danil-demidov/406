const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Подключение к MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI);

// Модель поста
const postSchema = new mongoose.Schema({
    postid: Number,
    author: String,
    text: String
});
const Post = mongoose.model('Post', postSchema);

// Инициализация пустого массива постов
let posts = [];

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('index', { theme });
});

app.get('/blog', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('blog', { theme });
});

app.post('/theme', (req, res) => {
    res.cookie('theme', req.body.theme, { maxAge: 900000 });
    res.sendStatus(200);
});

// API: получить список постов
app.get('/api/posts', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// API: создать новый пост
app.post('/api/posts', express.json(), async (req, res) => {
    const { author, text } = req.body;
    if (author && text) {
        // Получаем максимальный postid
        const lastPost = await Post.findOne().sort({ postid: -1 });
        const postid = lastPost ? lastPost.postid + 1 : 1;
        const post = new Post({ postid, author, text });
        await post.save();
        res.status(200).json({ message: 'Пост успешно создан' });
    } else {
        res.status(400).json({ message: 'author и text обязательны' });
    }
});

app.get('/post/:postid', async (req, res) => {
    const theme = req.cookies.theme || 'light';
    const postid = Number(req.params.postid);
    // Если используется MongoDB:
    const post = await Post.findOne({ postid });
    if (!post) return res.status(404).send('Пост не найден');
    res.render('post', { theme, post });
});

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;