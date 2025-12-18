const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const levels = [
    { id: 1, diff: "Basic", title: "Сложные пароли", question: "Какой символ делает пароль '12345' безопаснее?", options: ["Еще одна цифра", "Случайная буква и символ (!)", "Никакой", "Пробел"], correct: 1, feedback: "Верно! Символы вроде @, #, $ резко усложняют взлом.", xp: 50 },
    { id: 2, diff: "Basic", title: "Чужой компьютер", question: "Ты зашел в почту в библиотеке. Что сделать перед уходом?", options: ["Просто закрыть вкладку", "Нажать 'Выйти' (Logout)", "Выключить монитор", "Оставить как есть"], correct: 1, feedback: "Правильно. Закрытие вкладки не всегда завершает сессию.", xp: 50 },
    { id: 3, diff: "Basic", title: "Странные ссылки", question: "Друг прислал ссылку в мессенджере без описания. Твои действия?", options: ["Кликну сразу", "Спрошу его в жизни, что это", "Перешлю другому", "Заблокирую друга"], correct: 1, feedback: "Верно. Аккаунты друзей часто взламывают для рассылки вирусов.", xp: 50 },
    { id: 4, diff: "Basic", title: "Веб-камера", question: "Нужно ли заклеивать камеру, когда ты ей не пользуешься?", options: ["Да, это защита от шпионажа", "Нет, это паранойя", "Только если она светится", "Только на ноутбуках"], correct: 0, feedback: "Правильно. Некоторые вирусы могут включать камеру скрытно.", xp: 50 },
    { id: 5, diff: "Standard", title: "Двухфакторная защита", question: "Что такое 2FA (двухфакторная аутентификация)?", options: ["Второй пароль", "Код из SMS/приложения после пароля", "Сложный логин", "Вход через две соцсети"], correct: 1, feedback: "Да! Это лучший способ защитить аккаунт сегодня.", xp: 100 },
    { id: 6, diff: "Standard", title: "Фишинг в почте", question: "Письмо от Apple: 'Ваш ID заблокирован, подтвердите карту'. Ссылка: appIe-support.com. Опасно?", options: ["Нет, это официальный сайт", "Да, в домене буква 'I' вместо 'l'", "Безопасно, если есть антивирус", "Не знаю"], correct: 1, feedback: "Браво! Внимательность к буквам в адресе спасает данные.", xp: 100 },
    { id: 7, diff: "Standard", title: "Защита Wi-Fi", question: "Какое шифрование Wi-Fi самое надежное для дома?", options: ["WEP", "WPA2/WPA3", "Open (Без пароля)", "WPS"], correct: 1, feedback: "Верно. WPA3 — самый современный стандарт шифрования.", xp: 100 },
    { id: 8, diff: "Standard", title: "Мобильные права", question: "Фонарик просит доступ к контактам и микрофону. Разрешить?", options: ["Да, это нужно для работы", "Нет, это подозрительно", "Только один раз", "Только если телефон новый"], correct: 1, feedback: "Правильно. Приложения часто собирают лишние данные.", xp: 100 },
    { id: 9, diff: "Advanced", title: "HTTPS", question: "Что гарантирует наличие замочка и протокола HTTPS?", options: ["Сайт проверен полицией", "Шифрование данных между тобой и сайтом", "На сайте нет вирусов", "Сайт бесплатный"], correct: 1, feedback: "Верно. Но помни: даже фишинговые сайты могут иметь HTTPS!", xp: 150 },
    { id: 10, diff: "Advanced", title: "VPN", question: "Для чего в первую очередь нужен VPN в плане безопасности?", options: ["Для смены страны", "Для создания зашифрованного туннеля", "Для ускорения интернета", "Для скачивания торрентов"], correct: 1, feedback: "Да. VPN скрывает твой трафик от провайдера и хакеров в сети.", xp: 150 },
    { id: 11, diff: "Advanced", title: "Резервные копии", question: "Правило '3-2-1' в бэкапах означает:", options: ["3 копии, 2 носителя, 1 вне дома", "3 дня ждать, 2 раза проверить, 1 удалить", "3 пароля на 2 файла", "Просто считалочка"], correct: 0, feedback: "Именно так. Это золотой стандарт сохранения данных.", xp: 150 },
    { id: 12, diff: "Advanced", title: "Cookie-файлы", question: "Чем могут быть опасны Cookie на чужих ПК?", options: ["Они занимают много места", "Через них можно украсть сессию входа", "Они портят жесткий диск", "Ничем"], correct: 1, feedback: "Верно. Угон куки-файлов позволяет войти в аккаунт без пароля.", xp: 150 },
    { id: 13, diff: "Cyber-Expert", title: "Социальная инженерия", question: "Сотрудник техподдержки просит вас установить AnyDesk для 'настройки'. Это:", options: ["Нормальная практика", "Попытка получить удаленный доступ", "Обязательное условие", "Помощь от фирмы"], correct: 1, feedback: "Верно. Мошенники часто используют удаленный доступ.", xp: 200 },
    { id: 14, diff: "Cyber-Expert", title: "SQL-инъекция", question: "Где чаще всего встречается эта уязвимость?", options: ["В формах ввода на сайтах", "В картинках", "В оперативной памяти", "В кабеле интернета"], correct: 0, feedback: "Да. Плохо настроенные формы позволяют 'общаться' с базой данных напрямую.", xp: 200 },
    { id: 15, diff: "Cyber-Expert", title: "Zero Day", question: "Что такое уязвимость нулевого дня?", options: ["Ей ноль дней (она новая и нет патча)", "Уязвимость, которая лечится за 0 секунд", "Сбой в полночь", "Вирус для старых систем"], correct: 0, feedback: "Поздравляем! Это самые опасные угрозы, о которых еще не знает разработчик.", xp: 200 }
];

app.get('/api/levels', (req, res) => res.json(levels.map(l => ({ id: l.id, title: l.title, diff: l.diff }))));

app.post('/api/check', (req, res) => {
    const { id, answerIndex } = req.body;
    const level = levels.find(l => l.id === id);
    if (level) {
        const isCorrect = level.correct === answerIndex;
        res.json({ success: isCorrect, feedback: isCorrect ? level.feedback : "Неверно. Подумайте еще раз!" });
    }
});

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberQuest MVP</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #4361ee; --success: #4cc9f0; --bg: #f0f2f5; --text: #2b2d42; --glass: rgba(255, 255, 255, 0.95); }
        body { background: #e0e5ec; color: var(--text); font-family: 'Inter', sans-serif; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; overflow-x: hidden; }
        .container { width: 90%; max-width: 850px; background: var(--glass); padding: 40px; border-radius: 24px; box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff; transition: 0.3s; }
        .welcome-screen { text-align: center; }
        .welcome-screen h1 { font-size: 2.8em; color: var(--primary); margin: 0; }
        .difficulty-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75em; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; display: inline-block; }
        .diff-Basic { background: #d1fae5; color: #065f46; }
        .diff-Standard { background: #dbeafe; color: #1e40af; }
        .diff-Advanced { background: #fef3c7; color: #92400e; }
        .diff-Cyber-Expert { background: #fee2e2; color: #991b1b; }
        .level-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 25px; }
        .level-card { background: white; padding: 18px; border-radius: 18px; cursor: pointer; transition: 0.25s; border: 2px solid transparent; box-shadow: 4px 4px 10px rgba(0,0,0,0.05); }
        .level-card:hover { transform: translateY(-3px); border-color: var(--primary); }
        .level-card.locked { opacity: 0.4; cursor: not-allowed; pointer-events: none; background: #eee; }
        .level-card.done { background: #f0fdf4; border-color: #4ade80; }
        .btn-main { background: var(--primary); color: white; border: none; padding: 14px 35px; border-radius: 12px; font-size: 1.1em; cursor: pointer; transition: 0.2s; font-weight: 600; }
        .btn-main:hover { opacity: 0.9; transform: translateY(-1px); }
        .option-btn { width: 100%; text-align: left; padding: 14px; margin: 8px 0; border: 1px solid #ddd; border-radius: 10px; background: white; cursor: pointer; font-family: inherit; font-size: 1em; transition: 0.2s; }
        .option-btn:hover { background: #f8faff; border-color: var(--primary); }
        .useful-links { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 25px; }
        .link-card { background: #fff; padding: 15px; border-radius: 12px; text-decoration: none; color: var(--primary); border: 1px solid #eee; font-weight: 600; font-size: 0.9em; transition: 0.2s; }
        .link-card:hover { background: var(--primary); color: white; }
        .hidden { display: none; }
    </style>
</head>
<body>

<div class="container">
    <div id="screen-welcome" class="welcome-screen">
        <h1>CyberQuest</h1>
        <p style="color: #666; margin: 15px 0 30px;">Твой путь к безопасности в цифровом мире</p>
        <button class="btn-main" onclick="showMenu()">ЗАПУСТИТЬ</button>
    </div>

    <div id="screen-menu" class="hidden">
        <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin:0">Карта уровней</h2>
            <div style="text-align: right; font-size: 0.9em;">
                <b>Статус:</b> <span id="user-status">Новичок</span><br>
                <b>XP:</b> <span id="user-xp">0</span>
            </div>
        </div>
        <div id="level-grid" class="level-grid"></div>
    </div>

    <div id="screen-game" class="hidden">
        <div id="q-diff" class="difficulty-badge"></div>
        <h2 id="q-title" style="margin: 10px 0;"></h2>
        <p id="q-text" style="font-size: 1.15em; line-height: 1.5; margin-bottom: 20px;"></p>
        <div id="options-box"></div>
        <div id="game-feedback" style="margin-top: 15px; min-height: 24px; font-weight: 600;"></div>
        <button id="next-btn" class="btn-main hidden" style="width:100%; margin-top: 20px;" onclick="showMenu()">ПРОДОЛЖИТЬ</button>
    </div>

    <div id="screen-final" class="hidden welcome-screen">
        <h1 style="font-size: 3em;">🏆</h1>
        <h2>Курс завершен!</h2>
        <p>Вы успешно прошли все уровни и готовы к цифровым вызовам.</p>
        <div class="useful-links">
            <a href="https://касперский.рф" target="_blank" class="link-card">Блог Kaspersky</a>
            <a href="https://cyber-guide.ru" target="_blank" class="link-card">Кибер-путеводитель</a>
            <a href="https://gosuslugi.ru/cybersecurity" target="_blank" class="link-card">Госуслуги: Безопасность</a>
            <a href="https://safe-surf.ru" target="_blank" class="link-card">Справочник SafeSurf</a>
        </div>
        <button class="btn-main" style="margin-top: 30px; background:#666;" onclick="location.reload()">СБРОСИТЬ И ВЫЙТИ</button>
    </div>
</div>

<script>
    // Инициализация при каждом заходе (данные НЕ сохраняются в localStorage)
    let completed = [];
    const allLevels = ${JSON.stringify(levels)};

    function showWelcome() { hideAll(); document.getElementById('screen-welcome').classList.remove('hidden'); }
    function showMenu() { 
        hideAll(); 
        document.getElementById('screen-menu').classList.remove('hidden');
        renderGrid();
        updateStats();
    }
    function hideAll() {
        ['screen-welcome', 'screen-menu', 'screen-game', 'screen-final'].forEach(s => document.getElementById(s).classList.add('hidden'));
    }

    function updateStats() {
        document.getElementById('user-xp').innerText = completed.length * 100;
        let rank = "Новичок";
        if(completed.length > 5) rank = "Продвинутый";
        if(completed.length > 11) rank = "Специалист";
        if(completed.length === 15) rank = "Кибер-Эксперт";
        document.getElementById('user-status').innerText = rank;
    }

    function renderGrid() {
        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';
        allLevels.forEach((l, idx) => {
            const card = document.createElement('div');
            const isLocked = idx > 0 && !completed.includes(allLevels[idx-1].id);
            card.className = "level-card" + (isLocked ? ' locked' : '') + (completed.includes(l.id) ? ' done' : '');
            card.innerHTML = \`
                <div class="difficulty-badge diff-\${l.diff}">\${l.diff}</div>
                <div style="font-weight:600; font-size: 0.9em;">Уровень \${l.id}</div>
                <div style="font-size:0.75em; color:#666;">\${l.title}</div>
            \`;
            if(!isLocked) card.onclick = () => startLevel(l.id);
            grid.appendChild(card);
        });

        if(completed.length === 15) {
            setTimeout(() => { hideAll(); document.getElementById('screen-final').classList.remove('hidden'); }, 400);
        }
    }

    function startLevel(id) {
        hideAll();
        document.getElementById('screen-game').classList.remove('hidden');
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('game-feedback').innerText = '';
        
        const data = allLevels.find(l => l.id === id);
        document.getElementById('q-title').innerText = data.title;
        document.getElementById('q-diff').innerText = data.diff;
        document.getElementById('q-diff').className = 'difficulty-badge diff-' + data.diff;
        document.getElementById('q-text').innerText = data.question;
        
        const box = document.getElementById('options-box');
        box.innerHTML = '';
        data.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = async () => {
                const res = await fetch('/api/check', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id: id, answerIndex: i})
                });
                const result = await res.json();
                const fb = document.getElementById('game-feedback');
                fb.innerText = result.feedback;
                fb.style.color = result.success ? '#059669' : '#dc2626';
                if(result.success) {
                    if(!completed.includes(id)) completed.push(id);
                    document.getElementById('next-btn').classList.remove('hidden');
                }
            };
            box.appendChild(btn);
        });
    }
    window.onload = showWelcome;
</script>
</body>
</html>
    `);
});

app.listen(port, () => {
    console.log('--- CyberQuest MVP ---');
    console.log('Сервер успешно запущен!');
    console.log('Адрес игры: http://localhost:' + port);
});