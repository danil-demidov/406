document.addEventListener('DOMContentLoaded', () => {
    const postsList = document.getElementById('posts-list');
    const form = document.getElementById('create-post-form');
    const authorInput = document.getElementById('author');
    const textInput = document.getElementById('text');

    // Получение списка постов
    fetch('/api/posts')
        .then(res => res.json())
        .then(posts => {
            postsList.innerHTML = '';
            posts.forEach(post => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${post.author}:</strong> ${post.text}`;
                postsList.appendChild(li);
            });
        });

    // Создание поста
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: authorInput.value,
                text: textInput.value
            })
        });
        authorInput.value = '';
        textInput.value = '';
        // Повторно получить список постов
        fetch('/api/posts')
            .then(res => res.json())
            .then(posts => {
                postsList.innerHTML = '';
                posts.forEach(post => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${post.author}:</strong> ${post.text}`;
                    postsList.appendChild(li);
                });
            });
    });
});