// Select elements
const timerDisplay = pomodoro_timer.getElementById("timer-display");
const startBtn = pomodoro_timer.getElementById("start-btn");
const stopBtn = pomodoro_timer.getElementById("stop-btn");
const fileInput = pomodoro_timer.getElementById("file-input");
const durationInput = pomodoro_timer.getElementById("duration-input");
const pauseBtn = pomodoro_timer.getElementById("pause-btn");
// Variables
let countdownInterval;
let remainingTime = 0;
let pdfWindow;

// Countdown functions
function startCountdown() {
  const duration = parseInt(durationInput.value) * 60; // Convert minutes to seconds
  remainingTime = duration;
  updateTimerDisplay(remainingTime);
  countdownInterval = setInterval(updateCountdown, 1000);
}

function pauseCountdown() {
  clearInterval(countdownInterval);
  updateTimerDisplay(remainingTime);
}

function resumeCountdown() {
  updateTimerDisplay(remainingTime);
  countdownInterval = setInterval(updateCountdown, 1000);
}
function stopCountdown() {
  clearInterval(countdownInterval);
}

function updateCountdown() {
  remainingTime--;
  if (remainingTime >= 0) {
    updateTimerDisplay(remainingTime);
  } else {
    clearInterval(countdownInterval);
    closePdfWindow();
    timerDisplay.textContent = "Done!";
  }
}
function resumeCountdown() {
  updateTimerDisplay(remainingTime);
  countdownInterval = setInterval(updateCountdown, 1000); // Resume the countdown
}

function updateTimerDisplay(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Event listeners
startBtn.addEventListener("click", startCountdown);

stopBtn.addEventListener("click", function () {
  const confirmation = confirm("Are you sure you want to stop the timer?");
  if (confirmation) {
    stopCountdown();
    closePdfWindow();
    resetTimerAndFileInput();
  }
});

// Function to reset the timer and file input
function resetTimerAndFileInput() {
  clearInterval(countdownInterval);
  remainingTime = 0;
  updateTimerDisplay(remainingTime);
  fileInput.value = ""; // Clear the file input
}
pauseBtn.addEventListener("click", function () {
  if (pauseBtn.textContent === "Pause") {
    pauseCountdown();
    pauseBtn.textContent = "Resume";
  } else {
    resumeCountdown();
    pauseBtn.textContent = "Pause";
  }
});
// Event listener for file input to start the timer upon file selection
fileInput.addEventListener("change", function (event) {
  if (event.target.files.length > 0) {
    // Assuming the file type check and conversion to PDF (if necessary) is handled elsewhere
    handleFileUpload(event); // Function to handle file upload and display
    startCountdown(); // Start the timer immediately
  }
});

// Rest of your JavaScript code...

// Function to handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file.type === "application/pdf") {
    openPDFInNewTab(file);
  } else {
    alert("Please upload a PDF file.");
  }
}

// Function to open PDF file in a new tab
function openPDFInNewTab(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const pdfData = event.target.result;
    const blob = new Blob([pdfData], { type: file.type });
    const url = URL.createObjectURL(blob);
    pdfWindow = window.open(url, "_blank");
    pdfWindow.focus();
  };
  reader.readAsArrayBuffer(file);
}

// Function to close PDF window
function closePdfWindow() {
  if (pdfWindow) {
    pdfWindow.close();
  }
}