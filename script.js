// 중학교 필수 영단어 데이터셋 (선생님께서 원하시는 대로 추가/변경 가능합니다)
const wordList = [
    { word: "achieve", meaning: "성취하다, 이루다", options: ["성취하다", "포기하다", "공격하다", "배달하다"] },
    { word: "borrow", meaning: "빌리다", options: ["빌려주다", "빌리다", "사다", "팔다"] },
    { word: "creative", meaning: "창의적인", options: ["똑똑한", "지루한", "창의적인", "위험한"] },
    { word: "disappear", meaning: "사라지다", options: ["나타나다", "사라지다", "보호하다", "파괴하다"] },
    { word: "encourage", meaning: "격려하다, 장려하다", options: ["낙담시키다", "비난하다", "경고하다", "격려하다"] },
    { word: "flexible", meaning: "유연한, 융통성 있는", options: ["단단한", "유연한", "부서지기 쉬운", "비싼"] },
    { word: "improve", meaning: "향상시키다, 나아지다", options: ["향상시키다", "악화시키다", "유지하다", "거절하다"] },
    { word: "patient", meaning: "인내심 있는, 환자", options: ["성급한", "화난", "인내심 있는", "잔인한"] },
    { word: "responsible", meaning: "책임이 있는", options: ["자유로운", "가벼운", "책임이 있는", "외로운"] },
    { word: "translate", meaning: "번역하다, 통역하다", options: ["작성하다", "읽다", "번역하다", "말하다"] }
];

let currentIndex = 0;
let score = 0;
let combo = 0;
let wrongAnswers = []; // 오답 기록을 담을 배열

// 게임 시작 및 초기화
function startGame() {
    currentIndex = 0;
    score = 0;
    combo = 0;
    wrongAnswers = [];
    
    document.getElementById("score").innerText = score;
    document.getElementById("combo").innerText = combo;
    document.getElementById("game-box").classList.remove("hide");
    document.getElementById("result-box").classList.add("hide");
    
    // 단어 무작위 섞기 (매판 새로운 순서로 진행되도록)
    wordList.sort(() => Math.random() - 0.5);
    
    loadWord();
}

// 문제 출제 함수
function loadWord() {
    if (currentIndex >= wordList.length) {
        endGame();
        return;
    }

    // 진행 바 업데이트
    const progress = (currentIndex / wordList.length) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;

    // 피드백 초기화
    const feedback = document.getElementById("feedback");
    feedback.innerText = "";
    feedback.className = "feedback";

    // 문제 및 보기 텍스트 그리기
    const currentQuestion = wordList[currentIndex];
    document.getElementById("word-display").innerText = currentQuestion.word;

    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, index) => {
        btn.innerText = `${index + 1}. ${currentQuestion.options[index]}`;
    });
}

// 정답 확인 함수
function checkAnswer(selectedIndex) {
    const currentQuestion = wordList[currentIndex];
    const selectedAnswer = currentQuestion.options[selectedIndex];
    const feedback = document.getElementById("feedback");

    if (selectedAnswer === currentQuestion.meaning) {
        // 정답일 때
        combo++;
        // 콤보가 쌓일수록 보너스 점수 부여
        const pointsEarned = 10 + (combo > 1 ? (combo - 1) * 2 : 0); 
        score += pointsEarned;
        
        feedback.innerText = `⭕ 정답입니다! (+${pointsEarned}점)`;
        feedback.className = "feedback correct";
    } else {
        // 오답일 때
        combo = 0; // 콤보 초기화
        feedback.innerText = `❌ 오답입니다! 정답: ${currentQuestion.meaning}`;
        feedback.className = "feedback incorrect";
        
        // 오답 리스트에 기록 남기
        wrongAnswers.push({
            word: currentQuestion.word,
            correct: currentQuestion.meaning,
            yours: selectedAnswer
        });
    }

    // 스코어판 실시간 업데이트
    document.getElementById("score").innerText = score;
    document.getElementById("combo").innerText = combo;

    // 약간의 시간 차(0.8초)를 두고 다음 문제로 넘어가기 (정오답 확인할 시간 제공)
    currentIndex++;
    setTimeout(loadWord, 800);
}

// 게임 종료 및 결과 누적 화면
function endGame() {
    document.getElementById("progress-bar").style.width = "100%";
    document.getElementById("game-box").classList.add("hide");
    document.getElementById("result-box").classList.remove("hide");
    document.getElementById("final-score").innerText = score;

    const historyLog = document.getElementById("history-log");
    historyLog.innerHTML = ""; // 기존 기록 초기화

    if (wrongAnswers.length === 0) {
        historyLog.innerHTML = "<p style='color:#38a169; font-weight:bold; text-align:center;'>💯 완벽합니다! 모든 단어를 맞췄어요!</p>";
    } else {
        wrongAnswers.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className = "history-item";
            itemElement.innerHTML = `
                <strong>${index + 1}. ${item.word}</strong><br>
                <span style="color:#e53e3e;">내가 고른 답: ${item.yours}</span><br>
                <span style="color:#38a169;">올바른 뜻: ${item.correct}</span>
            `;
            historyLog.appendChild(itemElement);
        });
    }
}

function restartGame() {
    startGame();
}

// 페이지가 로드되면 자동으로 게임 시작
window.onload = startGame;
