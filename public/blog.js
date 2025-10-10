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

    // Модальное окно
    const modalBg = document.getElementById('modal-bg');
    const modalWindow = document.getElementById('modal-window');

    // Кнопка для открытия модального окна
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `<button id="create-post-btn">Создать пост</button>`;
    const createBtn = document.getElementById('create-post-btn');

    createBtn.onclick = () => {
        modalBg.style.display = 'block';
        modalWindow.innerHTML = `
            <form id="post-form" style="width:100%;">
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
            <button id="close-modal" style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:1.5rem;cursor:pointer;">×</button>
        `;

        // Обработчик закрытия
        document.getElementById('close-modal').onclick = () => {
            modalBg.style.display = 'none';
        };
        document.getElementById('cancel-btn').onclick = () => {
            modalBg.style.display = 'none';
        };

        // Обработчик отправки формы
        document.getElementById('post-form').onsubmit = function(e) {
            e.preventDefault();
            const author = document.getElementById('post-author').value;
            const text = document.getElementById('post-text').value;
            fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author, text })
            }).then(() => {
                modalBg.style.display = 'none';
                loadPosts();
            });
        };
    };

    // Клик вне окна — закрыть модалку
    modalBg.onclick = function(e) {
        if (e.target === modalBg) modalBg.style.display = 'none';
    };

    // Работа с API
    const postsList = document.getElementById('posts-list');
    function renderPosts(posts) {
        // Сортировка по убыванию postid (новые выше)
        posts.sort((a, b) => b.postid - a.postid);
        postsList.innerHTML = '';
        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `<strong>#${post.postid} ${post.author}</strong><p>${post.text}</p>`;
            div.style.cursor = 'pointer';
            div.onclick = () => {
                window.location.href = `/post/${post.postid}`;
            };
            postsList.appendChild(div);
        });
    }
    function loadPosts() {
        fetch('/api/posts')
            .then(res => res.json())
            .then(renderPosts);
    }
    loadPosts();
});