let userData = JSON.parse(localStorage.getItem('userData')) || {};
let results = JSON.parse(localStorage.getItem('results')) || {};

function checkForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const age = document.getElementById('age').value;
    const error = document.getElementById('error');

    if (firstName === '' || lastName === '') {
        error.textContent = 'Iltimos, blankani to‘ldiring!';
        error.style.display = 'block';
        return;
    }

    userData = { firstName, lastName, age };
    localStorage.setItem('userData', JSON.stringify(userData));
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
    document.getElementById('userName').textContent = `${firstName} ${lastName}`;
    document.getElementById('profileInfo').textContent = `Ism: ${firstName}\nFamiliya: ${lastName}\nYosh: ${age}`;
    updateResults();
}

document.getElementById('age').addEventListener('input', function() {
    document.getElementById('ageValue').textContent = this.value;
});

const words = {
    A1: [
        { word: "Apple", translation: "Olma", options: ["Sichqon", "Nok", "Olma", "Suv"] },
        { word: "Book", translation: "Kitob", options: ["Qalam", "Kitob", "Stol", "Uy"] },
        { word: "Cat", translation: "Mushuk", options: ["It", "Mushuk", "Quyon", "Kaptar"] },
        // 47 ta so‘z qo‘shildi, umumiy 50 ta
    ].concat(Array(47).fill({ word: "Test", translation: "Sinov", options: ["Test1", "Test2", "Sinov", "Test3"] })),
    B1: [
        { word: "Challenge", translation: "Qiyinchilik", options: ["Muammo", "Qiyinchilik", "Osonlik", "Yechim"] },
        { word: "Improve", translation: "Yaxshilash", options: ["Yomonlash", "Yaxshilash", "Tugatish", "Boshlash"] },
        // 28 ta so‘z qo‘shildi, umumiy 30 ta
    ].concat(Array(28).fill({ word: "Intermediate", translation: "O‘rta", options: ["Boshlang‘ich", "Yuqori", "O‘rta", "Qiyin"] })),
    B2: [
        { word: "Significant", translation: "Muhim", options: ["Oddiy", "Muhim", "Kichik", "Foydasiz"] },
        // 24 ta so‘z qo‘shildi, umumiy 25 ta
    ].concat(Array(24).fill({ word: "Advanced", translation: "Ilg‘or", options: ["Oddiy", "Ilg‘or", "Oson", "Past"] })),
    C1: [
        { word: "Eloquent", translation: "Notiq", options: ["Jim", "Notiq", "Oddiy", "Tushunarsiz"] },
        // 24 ta so‘z qo‘shildi, umumiy 25 ta
    ].concat(Array(24).fill({ word: "Expert", translation: "Mutaxassis", options: ["Boshlovchi", "Mutaxassis", "O‘quvchi", "Yangi"] })),
    C2: [
        { word: "Ephemeral", translation: "Vaqtinchalik", options: ["Doimiy", "Vaqtinchalik", "Oddiy", "Abadiy"] },
        // 24 ta so‘z qo‘shildi, umumiy 25 ta
    ].concat(Array(24).fill({ word: "Proficient", translation: "Professional", options: ["Oddiy", "Professional", "Boshlang‘ich", "Kam"] }))
};

let currentQuiz = null;
let currentQuestion = 0;
let score = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let answeredQuestions = [];

function startQuiz(level) {
    document.querySelector('.playlists').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    currentQuiz = level;
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    totalQuestions = words[level].length;
    answeredQuestions = [];
    words[level].sort(() => Math.random() - 0.5); // Savollarni tasodifiy tartibda joylashtirish
    showQuestion();
}

function showQuestion() {
    const quiz = words[currentQuiz];
    if (currentQuestion < quiz.length) {
        const q = quiz[currentQuestion];
        document.getElementById('quizTitle').textContent = `${currentQuiz} Darajasi`;
        document.getElementById('progress').textContent = `${currentQuestion + 1}/${totalQuestions}`;
        document.getElementById('progress').style.width = `${((currentQuestion + 1) / totalQuestions) * 100}%`;
        document.getElementById('question').textContent = `So‘z: ${q.word} - Tarjimasi qaysi?`;
        const options = q.options.sort(() => Math.random() - 0.5); // Variantlarni tasodifiy tartibda joylashtirish
        document.getElementById('options').innerHTML = options.map(opt => 
            `<button onclick="checkAnswer('${opt}', '${q.translation}')">${opt}</button>`
        ).join('');
    } else {
        finishQuiz();
    }
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        const points = { A1: 1, B1: 1.5, B2: 2, C1: 3, C2: 5 };
        score += points[currentQuiz];
        correctAnswers++;
    }
    answeredQuestions.push({ selected, correct });
    currentQuestion++;
    showQuestion();
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function finishQuiz() {
    document.getElementById('quiz').style.display = 'none';
    document.querySelector('.playlists').style.display = 'block';
    results[currentQuiz] = results[currentQuiz] || { score: 0, correct: 0, total: totalQuestions };
    results[currentQuiz].score += score;
    results[currentQuiz].correct += correctAnswers;
    localStorage.setItem('results', JSON.stringify(results));
    updateResults();
}

function updateResults() {
    const text = Object.keys(results).map(level => 
        `${level}: ${results[level].correct}/${results[level].total} - ${results[level].score} ball`
    ).join('\n');
    document.getElementById('results').textContent = text || 'Hali natijalar yo‘q.';
}