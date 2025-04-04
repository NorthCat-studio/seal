// Проверка доступности localStorage
function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.error('localStorage недоступен:', e);
        return false;
    }
}

// Проверка существования пользователя
function userExists(username) {
    if (!isLocalStorageAvailable()) return false;
    
    try {
        const users = JSON.parse(localStorage.getItem('sealUsers') || '{}');
        return users.hasOwnProperty(username);
    } catch (e) {
        console.error('Ошибка при проверке существования пользователя:', e);
        return false;
    }
}

// Регистрация нового пользователя
function registerUser(username, email, password) {
    if (!isLocalStorageAvailable()) {
        console.warn('localStorage недоступен, регистрация невозможна');
        return false;
    }
    
    try {
        // Загрузка списка пользователей
        const users = JSON.parse(localStorage.getItem('sealUsers') || '{}');
        
        // Проверка, существует ли уже пользователь
        if (users.hasOwnProperty(username)) {
            return false;
        }
        
        // Проверка уникальности email
        for (const user in users) {
            if (users[user].email === email) {
                return false;
            }
        }
        
        // Создание нового пользователя
        users[username] = {
            email: email,
            password: password, // В реальном приложении пароль должен быть хэширован!
        };
        
        // Сохранение обновленного списка пользователей
        localStorage.setItem('sealUsers', JSON.stringify(users));
        
        // Создание данных игрока
        const userData = { 
            username: username, 
            email: email,
            score: 0, 
            autoTappers: 0, 
            tapMultiplier: 1,
            isLoggedIn: true
        };
        
        // Сохранение данных игрока
        localStorage.setItem(`sealUser_${username}`, JSON.stringify(userData));
        
        return userData;
    } catch (e) {
        console.error('Ошибка при регистрации пользователя:', e);
        return false;
    }
}

// Аутентификация пользователя
function authenticateUser(username, password) {
    if (!isLocalStorageAvailable()) {
        console.warn('localStorage недоступен, аутентификация невозможна');
        return false;
    }
    
    try {
        // Загрузка списка пользователей
        const users = JSON.parse(localStorage.getItem('sealUsers') || '{}');
        
        // Проверка существования пользователя и правильности пароля
        if (users.hasOwnProperty(username) && users[username].password === password) {
            return loadUser(username);
        }
        
        return false;
    } catch (e) {
        console.error('Ошибка при аутентификации пользователя:', e);
        return false;
    }
}

// Загрузка данных пользователя из localStorage или создание нового пользователя
function loadUser(username) {
    if (!isLocalStorageAvailable()) {
        console.warn('localStorage недоступен, используем временные данные');
        return { 
            username: username, 
            score: 0, 
            autoTappers: 0, 
            tapMultiplier: 1,
            isLoggedIn: true
        };
    }
    
    try {
        const savedUser = localStorage.getItem(`sealUser_${username}`);
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            userData.isLoggedIn = true;
            return userData;
        } else {
            return { 
                username: username, 
                score: 0, 
                autoTappers: 0, 
                tapMultiplier: 1,
                isLoggedIn: true
            };
        }
    } catch (e) {
        console.error('Ошибка при загрузке данных пользователя:', e);
        return { 
            username: username, 
            score: 0, 
            autoTappers: 0, 
            tapMultiplier: 1,
            isLoggedIn: true
        };
    }
}

// Сохранение данных пользователя
function saveUser(user) {
    if (!isLocalStorageAvailable()) {
        console.warn('localStorage недоступен, данные не сохранены');
        return;
    }
    
    try {
        localStorage.setItem(`sealUser_${user.username}`, JSON.stringify(user));
    } catch (e) {
        console.error('Ошибка при сохранении данных пользователя:', e);
    }
}

// При загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена');
    
    // Получение элементов DOM
    const loginSection = document.getElementById('login-section');
    const gameSection = document.getElementById('game-section');
    const sealImage = document.getElementById('sealImage');
    const autoTapperButton = document.getElementById('autoTapperButton');
    const tapButton = document.getElementById('tapButton');
    const scoreDisplay = document.getElementById('score');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const userDisplay = document.getElementById('userDisplay');
    const shopContainer = document.getElementById('shop');
    const authMessage = document.getElementById('authMessage');

    // Проверка наличия всех элементов DOM
    if (!loginSection || !gameSection || !sealImage || !autoTapperButton || !tapButton || 
        !scoreDisplay || !usernameInput || !emailInput || !passwordInput || !loginButton || 
        !registerButton || !userDisplay || !shopContainer || !authMessage) {
        console.error('Не все элементы DOM найдены');
    }

    // Объявление пользователя
    let user = null;

    // Предметы для магазина
    const items = Array.from({ length: 10 }, (_, i) => ({
        name: `Тюлень №${i + 1}`,
        cost: (i + 1) * 80,
        income: (i + 1) * 2
    }));

    // Множители для тапа
    const multipliers = [
        { cost: 500, value: 2 },
        { cost: 1000, value: 4 },
        { cost: 5000, value: 8 },
        { cost: 10000, value: 16 }
    ];

    // Обновление интерфейса
    function updateUI() {
        scoreDisplay.textContent = `Монеты: ${user.score}`;
        updateSealImage();
        renderShop();
    }

    // Обновление изображения тюленя в зависимости от прогресса
    function updateSealImage() {
        if (user.score < 1000) {
            sealImage.src = "сема.png";
        } else if (user.score < 10000) {
            sealImage.src = "ChatGPT Image 3 апр. 2025 г., 20_53_19.png";
        } else {
            sealImage.src = "ChatGPT Image 3 апр. 2025 г., 20_32_03.png";
        }
    }

    // Создание анимации монеты
    function createCoinAnimation(x, y, amount) {
        const coin = document.createElement('div');
        coin.className = 'coin-animation';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coin.textContent = `+${amount}`;
        document.body.appendChild(coin);
        
        setTimeout(() => {
            document.body.removeChild(coin);
        }, 1000);
    }

    // Показать сообщение аутентификации
    function showAuthMessage(message, isError = true) {
        authMessage.textContent = message;
        authMessage.style.color = isError ? 'red' : 'green';
        
        // Автоматически скрыть сообщение через 3 секунды
        setTimeout(() => {
            authMessage.textContent = '';
        }, 3000);
    }

    // Обработчик регистрации
    registerButton.addEventListener('click', () => {
        console.log('Кнопка регистрации нажата');
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !email || !password) {
            showAuthMessage('Пожалуйста, заполните все поля');
            return;
        }
        
        if (password.length < 6) {
            showAuthMessage('Пароль должен содержать не менее 6 символов');
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            showAuthMessage('Введите корректный адрес электронной почты');
            return;
        }
        
        if (userExists(username)) {
            showAuthMessage('Пользователь с таким именем уже существует');
            return;
        }
        
        const userData = registerUser(username, email, password);
        if (userData) {
            user = userData;
            userDisplay.textContent = `Привет, ${user.username}!`;
            loginSection.style.display = 'none';
            gameSection.style.display = 'block';
            updateUI();
            console.log('Пользователь зарегистрирован:', username);
        } else {
            showAuthMessage('Ошибка при регистрации. Возможно, email уже используется.');
        }
    });

    // Обработчик входа
    loginButton.addEventListener('click', () => {
        console.log('Кнопка входа нажата');
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            showAuthMessage('Пожалуйста, введите имя пользователя и пароль');
            return;
        }
        
        const userData = authenticateUser(username, password);
        if (userData) {
            user = userData;
            userDisplay.textContent = `Привет, ${user.username}!`;
            loginSection.style.display = 'none';
            gameSection.style.display = 'block';
            updateUI();
            console.log('Пользователь вошел:', username);
        } else {
            showAuthMessage('Неверное имя пользователя или пароль');
        }
    });

    // Обработчик клика по тюленю
    sealImage.addEventListener('click', (e) => {
        const amount = user.tapMultiplier;
        user.score += amount;
        saveUser(user);
        updateUI();
        
        // Создание анимации монеты
        createCoinAnimation(e.clientX, e.clientY, amount);
    });

    // Альтернативная кнопка для тапа (мобильные устройства)
    tapButton.addEventListener('click', () => {
        const amount = user.tapMultiplier;
        user.score += amount;
        saveUser(user);
        updateUI();
        
        // Создание анимации монеты в центре кнопки
        const rect = tapButton.getBoundingClientRect();
        createCoinAnimation(rect.left + rect.width/2, rect.top, amount);
    });

    // Обработчик покупки авто-таппера
    autoTapperButton.addEventListener('click', () => {
        if (user.score >= 50) {
            user.score -= 50;
            user.autoTappers++;
            saveUser(user);
            updateUI();
        }
    });

    // Рендеринг магазина
    function renderShop() {
        shopContainer.innerHTML = '';
        
        // Создание карточек предметов
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('shop-card');
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p>Цена: ${item.cost} монет</p>
                <p>Доход: +${item.income}/сек</p>
                <button class="buy-item-btn" data-index="${index}">Купить</button>
            `;
            shopContainer.appendChild(card);
        });
        
        // Создание карточек множителей
        multipliers.forEach((multiplier, index) => {
            const card = document.createElement('div');
            card.classList.add('shop-card');
            card.innerHTML = `
                <h3>Множитель x${multiplier.value}</h3>
                <p>Цена: ${multiplier.cost} монет</p>
                <button class="buy-multiplier-btn" data-index="${index}">Купить</button>
            `;
            shopContainer.appendChild(card);
        });
        
        // Добавление обработчиков событий для кнопок покупки
        document.querySelectorAll('.buy-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                buyItem(index);
            });
        });
        
        document.querySelectorAll('.buy-multiplier-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                buyMultiplier(index);
            });
        });
    }

    // Функция покупки предмета
    function buyItem(index) {
        if (user.score >= items[index].cost) {
            user.score -= items[index].cost;
            user.autoTappers += items[index].income;
            saveUser(user);
            updateUI();
        }
    }

    // Функция покупки множителя
    function buyMultiplier(index) {
        if (user.score >= multipliers[index].cost) {
            user.score -= multipliers[index].cost;
            user.tapMultiplier = multipliers[index].value;
            saveUser(user);
            updateUI();
        }
    }

    // Автоматическое начисление монет от авто-тапперов
    setInterval(() => {
        if (user) {
            user.score += user.autoTappers;
            saveUser(user);
            updateUI();
        }
    }, 1000);
});
