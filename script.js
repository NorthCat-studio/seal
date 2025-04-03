const user = JSON.parse(localStorage.getItem('sealUser')) || { username: '', score: 0, autoTappers: 0, tapMultiplier: 1 };

function saveUser() {
    localStorage.setItem('sealUser', JSON.stringify(user));
}

document.addEventListener('DOMContentLoaded', () => {
    const sealImage = document.getElementById('sealImage');
    const autoTapperButton = document.getElementById('autoTapperButton');
    const scoreDisplay = document.getElementById('score');
    const usernameInput = document.getElementById('username');
    const loginButton = document.getElementById('loginButton');
    const userDisplay = document.getElementById('userDisplay');
    const shopContainer = document.getElementById('shop');

    const items = Array.from({ length: 50 }, (_, i) => ({
        name: `Тюлень №${i + 1}`,
        cost: (i + 1) * 80,
        income: (i + 1) * 2
    }));

    const multipliers = [
        { cost: 500, value: 2 },
        { cost: 1000, value: 4 },
        { cost: 5000, value: 8 },
        { cost: 10000, value: 16 }
    ];

    function updateUI() {
        scoreDisplay.textContent = `Монеты: ${user.score}`;
     
        updateSealImage();
        renderShop();
    }

    function updateSealImage() {
        if (user.score < 5000) {
            sealImage.src = 'ChatGPT Image 3 апр. 2025 г., 20_53_19.png';
        } else if (user.score < 100000) {
            sealImage.src = 'ChatGPT Image 3 апр. 2025 г., 20_32_03.png';
        } else {
            sealImage.src = 'ChatGPT Image 3 апр. 2025 г., 20_32_03.png';
        }
    }

    loginButton.addEventListener('click', () => {
        user.username = usernameInput.value;
        saveUser();
        updateUI();
    });

    sealImage.addEventListener('click', () => {
        user.score += user.tapMultiplier;
        saveUser();
        updateUI();
    });

    autoTapperButton.addEventListener('click', () => {
        if (user.score >= 50) {
            user.score -= 50;
            user.autoTappers++;
            saveUser();
            updateUI();
        }
    });

    function renderShop() {
        shopContainer.innerHTML = '';
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('shop-card');
            card.innerHTML = `<h3>${item.name}</h3><p>Цена: ${item.cost} монет</p><p>Доход: +${item.income}/сек</p><button onclick='buyItem(${index})'>Купить</button>`;
            shopContainer.appendChild(card);
        });
        multipliers.forEach((multiplier, index) => {
            const card = document.createElement('div');
            card.classList.add('shop-card');
            card.innerHTML = `<h3>Множитель x${multiplier.value}</h3><p>Цена: ${multiplier.cost} монет</p><button onclick='buyMultiplier(${index})'>Купить</button>`;
            shopContainer.appendChild(card);
        });
    }

    window.buyItem = function(index) {
        if (user.score >= items[index].cost) {
            user.score -= items[index].cost;
            user.autoTappers += items[index].income;
            saveUser();
            updateUI();
        }
    };

    window.buyMultiplier = function(index) {
        if (user.score >= multipliers[index].cost) {
            user.score -= multipliers[index].cost;
            user.tapMultiplier = multipliers[index].value;
            saveUser();
            updateUI();
        }
    };

    setInterval(() => {
        user.score += user.autoTappers;
        saveUser();
        updateUI();
    }, 1000);

    updateUI();
});
