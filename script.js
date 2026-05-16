// 중학교 필수 영단어 데이터셋 (정답 'meaning'을 배열 형태로 변경했습니다)
const wordList = [
    { word: "achieve", meaning: ["성취하다", "이루다"], options: ["성취하다", "포기하다", "공격하다", "배달하다"] },
    { word: "borrow", meaning: ["빌리다"], options: ["빌려주다", "빌리다", "사다", "팔다"] },
    { word: "creative", meaning: ["창의적인"], options: ["똑똑한", "지루한", "창의적인", "위험한"] },
    { word: "disappear", meaning: ["사라지다"], options: ["나타나다", "사라지다", "보호하다", "파괴하다"] },
    { word: "encourage", meaning: ["격려하다", "장려하다"], options: ["낙담시키다", "비난하다", "경고하다", "격려하다"] },
    { word: "flexible", meaning: ["유연한", "융통성 있는"], options: ["단단한", "유연한", "부서지기 쉬운", "비싼"] },
    { word: "improve", meaning: ["향상시키다", "나아지다"], options: ["향상시키다", "악화시키다", "유지하다", "거절하다"] },
    { word: "patient", meaning: ["인내심 있는", "환자"], options: ["성급한", "화난", "인내심 있는", "잔인한"] },
    { word: "responsible", meaning: ["책임이 있는"], options: ["자유로운", "가벼운", "책임이 있는", "외로운"] },
    { word: "translate", meaning: ["번역하다", "통역하다"], options: ["작성하다", "읽다", "번역하다", "말하다"] }
];

let currentIndex = 0;
let score = 0;
let combo = 0;
let wrongAnswers = []; 

function startGame() {
    currentIndex = 0;
    score = 0;
    combo = 0;
    wrongAnswers = [];
    
    document.getElementById("score").innerText = score;
    document.getElementById("combo").innerText = combo;
    document.getElementById("game-box").classList.remove("hide");
    document.getElementById("result-box").classList.add("hide");
    
    wordList.sort(() => Math.random() - 0.5);
    loadWord();
}

function loadWord() {
    if (currentIndex >= wordList.length) {
        endGame();
        return;
    }

    const progress = (currentIndex / wordList.length) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;

    const feedback = document.getElementById("feedback");
    feedback.innerText = "";
    feedback.className = "feedback";

    const currentQuestion = wordList[currentIndex];
    document.getElementById("word-display").innerText = currentQuestion.word;

    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, index) => {
        btn.innerText = `${index + 1}. ${currentQuestion.options[index]}`;
    });
}

// 정답 확인 함수 (다의어 인정 로직 반영)
function checkAnswer(selectedIndex) {
    const currentQuestion = wordList[currentIndex];
    const selectedAnswer = currentQuestion.options[selectedIndex];
    const feedback = document.getElementById("feedback");

    // 전체 뜻 목록을 보기 좋게 쉼표로 연결 (예: "성취하다, 이루다")
    const allMeanings = currentQuestion.meaning.join(", "); 

    // 핵심 수정: 고른 답이 정답 배열(meaning)에 포함되어 있는지 확인 (.includes 사용)
    if (currentQuestion.meaning.includes(selectedAnswer)) {
        // 정답일 때
        combo++;
        const pointsEarned = 10 + (combo > 1 ? (combo - 1) * 2 : 0); 
        score += pointsEarned;
        
        feedback.innerText = `⭕ 정답입니다! (${selectedAnswer})`;
        feedback.className = "feedback correct";
    } else {
        // 오답일 때
        combo = 0; 
        feedback.innerText = `❌ 오답입니다! 정답 뜻: ${allMeanings}`;
        feedback.className = "feedback incorrect";
        
        wrongAnswers.push({
            word: currentQuestion.word,
            correct: allMeanings, // 전체 뜻을 다 보여줌
            yours: selectedAnswer
        });
    }

    document.getElementById("score").innerText = score;
    document.getElementById("combo").innerText = combo;

    currentIndex++;
    setTimeout(loadWord, 1000); // 정오답을 확인할 시간을 조금 더(1초) 주었습니다.
}

function endGame() {
    document.getElementById("progress-bar").style.width = "100%";
    document.getElementById("game-box").classList.add("hide");
    document.getElementById("result-box").classList.remove("hide");
    document.getElementById("final-score").innerText = score;

    const historyLog = document.getElementById("history-log");
    historyLog.innerHTML = ""; 

    if (wrongAnswers.length === 0) {
        historyLog.innerHTML = "<p style='color:#38a169; font-weight:bold; text-align:center;'>💯 완벽합니다! 모든 단어를 맞췄어요!</p>";
    } else {
        wrongAnswers.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className = "history-item";
            itemElement.innerHTML = `
                <strong>${index + 1}. ${item.word}</strong><br>
                <span style="color:#e53e3e;">내가 고른 오답: ${item.yours}</span><br>
                <span style="color:#38a169;">알맞은 뜻 목록: ${item.correct}</span>
            `;
            historyLog.appendChild(itemElement);
        });
    }
}

function restartGame() {
    startGame();
}

window.onload = startGame;
