let timerInterval;
let totalSeconds = 0; // 초기값 0초
let isPaused = false;
let initialTime = 0; // 설정된 시간초 저장
let count = 1;

function updateTimer() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    document.getElementById('timer').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (isPaused) return;

    if (totalSeconds <= 0) {
    
        generateLottoNumbers(); // 로또 추첨 실행
        totalSeconds = initialTime; // 설정된 시간초로 초기화
        
        
        startTimer(); // 타이머 다시 시작
    }
    totalSeconds--;
}

function startTimer() {
    
    if (initialTime == 0) {
        showError("시간을 설정해주세요.");
        return;
    }
    clearInterval(timerInterval);
    totalSeconds = initialTime; // 설정된 시간초로 초기화
    timerInterval = setInterval(updateTimer, 1000);
    hideError();
    isPaused = false;
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    
    totalSeconds = 0; // 타이머를 0초로 초기화
    initialTime = 0; // 설정된 시간초도 초기화
    updateTimer(); // 타이머 표시 업데이트
    isPaused = true;
}

function addTime(seconds) {
    initialTime += seconds; // 설정된 시간초에 추가
    totalSeconds = initialTime; // 타이머도 업데이트
    updateTimer();
}

function generateLottoNumbers() {
    const numbers = [];
    while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(num)) numbers.push(num);
    }
    numbers.sort((a, b) => a - b);
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${timeString}</span>
        <div class="numbers">
            ${numbers.map(num => `<span class="${getNumberColor(num)}">${num}</span>`).join('')}
        </div>
        <button onclick="this.parentElement.remove()">삭제</button>
    `;
    document.getElementById('lottoList').appendChild(listItem);

    // 모바일 알림 표시
    if (Notification.permission === "granted") {
        new Notification("로또 추첨 결과", {
            body: `추첨 번호: ${numbers.join(", ")}`,
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("로또 추첨 결과", {
                    body: `추첨 번호: ${numbers.join(", ")}`,
                });
            }
        });
    }

    if (Math.random() < 0.3) {
        const adItem = document.createElement('li');
        adItem.className = 'ad';
        adItem.textContent = '구글 애드몹 광고';
        document.getElementById('lottoList').appendChild(adItem);
    }
}

function getNumberColor(num) {
    if (num >= 1 && num <= 9) return 'yellow';
    if (num >= 10 && num <= 19) return 'sky';
    if (num >= 20 && num <= 29) return 'red';
    if (num >= 30 && num <= 39) return 'gray';
    if (num >= 40 && num <= 45) return 'green';
}

function clearAll() {
    document.getElementById('lottoList').innerHTML = '';
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
}

function hideError() {
    document.getElementById('error-message').textContent = '';
}

// 알림 권한 요청
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}