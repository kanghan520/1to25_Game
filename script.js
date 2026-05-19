const gameBoard = document.querySelector("#gameBoard");
const timerText = document.querySelector("#timer");
const resetButton = document.querySelector("#resetButton");
const recordList = document.querySelector("#recordList");
const clearRecordsButton = document.querySelector("#clearRecordsButton");

let currentNumber = 1;

let startTime;
let timerInterval;
let isTimerStarted = false;

// 기록 배열
let records = JSON.parse(localStorage.getItem("records")) || [];

// 페이지가 처음 열렸을 때 실행
createGame();
showRecords();

resetButton.addEventListener("click", function () {
  resetGame();
});

clearRecordsButton.addEventListener("click", function () {
  records = [];
  localStorage.removeItem("records");
  showRecords();
});

function createGame() {
  gameBoard.innerHTML = "";

  let numbers = [];

  for (let i = 1; i <= 25; i++) {
    numbers.push(i);
  }

  numbers.sort(() => Math.random() - 0.5);

  for (let i = 0; i < numbers.length; i++) {
    const button = document.createElement("button");

    button.textContent = numbers[i];

    button.addEventListener("click", function () {
      const clickedNumber = Number(button.textContent);

      if (clickedNumber === currentNumber) {
        if (isTimerStarted === false) {
          startTimer();
          isTimerStarted = true;
        }

        button.classList.add("correct");
        currentNumber++;

        if (currentNumber > 25) {
          clearInterval(timerInterval);

          const clearTime = Number(timerText.textContent);
          saveRecord(clearTime);

          alert("클리어! 기록: " + clearTime.toFixed(2) + "초");
        }
      } else {
        if (button.classList.contains("correct") === false) {
          button.classList.add("wrong");

          setTimeout(function () {
            button.classList.remove("wrong");
          }, 200);
        }
      }
    });

    gameBoard.appendChild(button);
  }
}

function resetGame() {
  currentNumber = 1;
  isTimerStarted = false;

  clearInterval(timerInterval);
  timerText.textContent = "0.00";

  createGame();
}

function startTimer() {
  startTime = Date.now();

  timerInterval = setInterval(function () {
    const nowTime = Date.now();
    const elapsedTime = (nowTime - startTime) / 1000;

    timerText.textContent = elapsedTime.toFixed(2);
  }, 10);
}

function saveRecord(time) {
  records.push(time);

  // 빠른 기록 순서대로 정렬
  records.sort(function (a, b) {
    return a - b;
  });

  // 상위 5개만 남기기
  records = records.slice(0, 5);

  // 브라우저에 저장
  localStorage.setItem("records", JSON.stringify(records));

  showRecords();
}

function showRecords() {
  recordList.innerHTML = "";

  if (records.length === 0) {
    const li = document.createElement("li");
    li.textContent = "아직 기록이 없습니다.";
    recordList.appendChild(li);
    return;
  }

  for (let i = 0; i < records.length; i++) {
    const li = document.createElement("li");

    li.textContent = records[i].toFixed(2) + "초";

    recordList.appendChild(li);
  }
}