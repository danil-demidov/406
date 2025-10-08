document.addEventListener('DOMContentLoaded', () => {
    // Тема
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.onclick = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            fetch('/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'theme=' + newTheme
            });
        };
    }

    // Форма создания поста
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <button id="create-post-btn">Создать пост</button>
        <form id="post-form" style="display:none; margin-top: 1rem; width: 100%;">
            <div style="display: flex; flex-direction: column; margin-bottom: 1rem;">
                <label for="post-author" style="margin-bottom: 4px;">Имя:</label>
                <input type="text" id="post-author" name="author" required>
            </div>
            <div style="display: flex; flex-direction: column; margin-bottom: 1rem;">
                <label for="post-text" style="margin-bottom: 4px;">Текст поста:</label>
                <textarea id="post-text" name="text" required></textarea>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button type="submit"
                    style="background: var(--primary-color); color: #fff; border: none; border-radius: 5px; padding: 10px 20px; font-weight: bold; cursor: pointer;">
                    Сохранить
                </button>
                <button type="button" id="cancel-btn"
                    style="background: var(--card-bg); color: var(--text-color); border: 1px solid #ccc; border-radius: 5px; padding: 10px 20px; font-weight: bold; cursor: pointer;">
                    Отмена
                </button>
            </div>
        </form>
    `;

    const createBtn = document.getElementById('create-post-btn');
    const postForm = document.getElementById('post-form');
    const cancelBtn = document.getElementById('cancel-btn');
    if (createBtn && postForm && cancelBtn) {
        createBtn.onclick = () => {
            postForm.style.display = 'block';
            createBtn.style.display = 'none';
        };
        cancelBtn.onclick = () => {
            postForm.style.display = 'none';
            createBtn.style.display = 'inline-block';
        };
    }

    // Работа с API
    const postsList = document.getElementById('posts-list');
    function renderPosts(posts) {
        postsList.innerHTML = '';
        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `<strong>#${post.postid} ${post.author}</strong><p>${post.text}</p>`;
            postsList.appendChild(div);
        });
    }
    function loadPosts() {
        fetch('/api/posts')
            .then(res => res.json())
            .then(renderPosts);
    }
    loadPosts();

    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const author = document.getElementById('post-author').value;
        const text = document.getElementById('post-text').value;
        fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, text })
        }).then(() => {
            postForm.reset();
            postForm.style.display = 'none';
            createBtn.style.display = 'inline-block';
            loadPosts();
        });
    });
});