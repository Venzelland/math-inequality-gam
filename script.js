document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            title: 'Math-inequality-game',
            plus: '+',
            minus: '-',
            multiply: '*',
            divide: '/',
            oneDigit: 'One-digit numbers',
            twoDigit: 'Two-digit numbers',
            threeDigit: 'Three-digit numbers',
            startGame: 'Start Game',
            timeLeft: 'Time Left: ',
            seconds: ' seconds',
            correctAnswers: 'Correct Answers: ',
            submit: 'Submit',
            gameOver: 'Game Over! You scored ',
            correct: ' correct answers.',
            selectOperator: 'Please select at least one operator.'
        },
        ru: {
            title: 'Равенство',
            plus: '+',
            minus: '-',
            multiply: '*',
            divide: '/',
            oneDigit: 'Однозначные числа',
            twoDigit: 'Двузначные числа',
            threeDigit: 'Трехзначные числа',
            startGame: 'Начать игру',
            timeLeft: 'Осталось времени: ',
            seconds: ' секунд',
            correctAnswers: 'Правильные ответы: ',
            submit: 'Отправить',
            gameOver: 'Игра окончена! Вы набрали ',
            correct: ' правильных ответов.',
            selectOperator: 'Пожалуйста, выберите хотя бы один оператор.'
        }
    };

    const elements = {
        title: document.getElementById('title'),
        plus: document.getElementById('plus-text'),
        minus: document.getElementById('minus-text'),
        multiply: document.getElementById('multiply-text'),
        divide: document.getElementById('divide-text'),
        oneDigit: document.getElementById('one-digit-text'),
        twoDigit: document.getElementById('two-digit-text'),
        threeDigit: document.getElementById('three-digit-text'),
        start: document.getElementById('start'),
        timeLeft: document.getElementById('time-left-text'),
        score: document.getElementById('score-text'),
        submit: document.getElementById('submit')
    };

    let currentLanguage = 'en';

    function updateLanguage() {
        const lang = currentLanguage;
        const translation = translations[lang];
        elements.title.textContent = translation.title;
        elements.plus.textContent = translation.plus;
        elements.minus.textContent = translation.minus;
        elements.multiply.textContent = translation.multiply;
        elements.divide.textContent = translation.divide;
        elements.oneDigit.textContent = translation.oneDigit;
        elements.twoDigit.textContent = translation.twoDigit;
        elements.threeDigit.textContent = translation.threeDigit;
        elements.start.textContent = translation.startGame;
        elements.timeLeft.innerHTML = `${translation.timeLeft} <span id="time">60</span> ${translation.seconds}`;
        elements.score.innerHTML = `${translation.correctAnswers} <span id="score">0</span>`;
        elements.submit.textContent = translation.submit;
    }

    document.getElementById('english').addEventListener('change', () => {
        currentLanguage = 'en';
        updateLanguage();
    });

    document.getElementById('russian').addEventListener('change', () => {
        currentLanguage = 'ru';
        updateLanguage();
    });

    const timeDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const questionDisplay = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const startButton = document.getElementById('start');
    const settings = document.getElementById('settings');
    const gameArea = document.getElementById('game');

    const plusCheckbox = document.getElementById('plus');
    const minusCheckbox = document.getElementById('minus');
    const multiplyCheckbox = document.getElementById('multiply');
    const divideCheckbox = document.getElementById('divide');

    const oneDigitRadio = document.getElementById('one-digit');
    const twoDigitRadio = document.getElementById('two-digit');
    const threeDigitRadio = document.getElementById('three-digit');

    let time = 60;
    let score = 0;
    let interval;

    function getNumberRange() {
        if (oneDigitRadio.checked) {
            return [1, 9];
        } else if (twoDigitRadio.checked) {
            return [10, 99];
        } else if (threeDigitRadio.checked) {
            return [100, 999];
        }
    }

    function startGame() {
        settings.classList.add('hidden');
        gameArea.classList.remove('hidden');
        time = 60;
        score = 0;
        timeDisplay.textContent = time;
        scoreDisplay.textContent = score;
        answerInput.disabled = false;
        submitButton.disabled = false;
        answerInput.focus();

        interval = setInterval(() => {
            time--;
            document.getElementById('time').textContent = time;
            if (time === 0) {
                clearInterval(interval);
                endGame();
            }
        }, 1000);
        generateQuestion();
    }

    function generateQuestion() {
        const [min, max] = getNumberRange();
        const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
        const num2Options = [2, 4, 5, 8];
        const operators = [];

        if (plusCheckbox.checked) operators.push('+');
        if (minusCheckbox.checked) operators.push('-');
        if (multiplyCheckbox.checked) operators.push('*');
        if (divideCheckbox.checked) operators.push('/');

        if (operators.length === 0) {
            alert(translations[currentLanguage].selectOperator);
            return;
        }

        const operator = operators[Math.floor(Math.random() * operators.length)];

        let question;
        let answer;

        switch (operator) {
            case '+':
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case '-':
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
                break;
            case '*':
                question = `${num1} * ${num2}`;
                answer = num1 * num2;
                break;
            case '/':
                const num2Div = num2Options[Math.floor(Math.random() * num2Options.length)];
                const num1Div = num1 * num2Div;
                question = `${num1Div} / ${num2Div}`;
                answer = num1Div / num2Div;
                break;
        }

        questionDisplay.textContent = `${question} = ?`;
        questionDisplay.dataset.answer = answer;
    }

    function checkAnswer() {
        const userAnswer = parseFloat(answerInput.value);
        const correctAnswer = parseFloat(questionDisplay.dataset.answer);

        if (userAnswer === correctAnswer) {
            score++;
            document.getElementById('score').textContent = score;
        }

        answerInput.value = '';
        generateQuestion();
    }

    function endGame() {
        alert(translations[currentLanguage].gameOver + score + translations[currentLanguage].correct);
        answerInput.disabled = true;
        submitButton.disabled = true;
        settings.classList.remove('hidden');
        gameArea.classList.add('hidden');
    }

    submitButton.addEventListener('click', checkAnswer);

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    startButton.addEventListener('click', startGame);

    // Initial language setup
    updateLanguage();
});
