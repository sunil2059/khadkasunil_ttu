let username = '';
const quizData = [
    { question: "Q1: Which organ is primarily affected in cirrhosis?", options: ["Kidney", "Heart", "Liver", "Lungs"], correct: "Liver", explanation: "Cirrhosis is a chronic liver disease caused by long-term liver damage." },
    { question: "Q2: What is the first-line treatment for hypertension?", options: ["ACE inhibitors", "Beta-blockers", "Diuretics", "Calcium channel blockers"], correct: "ACE inhibitors", explanation: "ACE inhibitors help relax blood vessels and lower blood pressure." },
    { question: "Q3: What surgical procedure removes the gallbladder?", options: ["Appendectomy", "Cholecystectomy", "Gastrectomy", "Splenectomy"], correct: "Cholecystectomy", explanation: "Cholecystectomy is performed to remove the gallbladder due to gallstones or infection." },
    { question: "Q4: What is the most common pediatric respiratory condition?", options: ["Asthma", "Bronchitis", "Pneumonia", "Croup"], correct: "Asthma", explanation: "Asthma is a chronic inflammatory disease affecting the airways." },
    { question: "Q5: What is the leading cause of maternal mortality worldwide?", options: ["Hypertension", "Postpartum hemorrhage", "Preeclampsia", "Infections"], correct: "Postpartum hemorrhage", explanation: "Excessive bleeding after childbirth is a leading cause of maternal deaths." },
    { question: "Q6: What is the capital of Norway?", options: ["Oslo", "Paris", "Moscow", "London"], correct: "Oslo", explanation: "Oslo" },
    { question: "Q7: What is the 2+3", options: ["2", "3", "4", "5"], correct: "5", explanation: "2+3=5" },
    { question: "Q8: What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: "Paris", explanation: "The capital of France is Paris." },
{ question: "Q9: Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Rembrandt"], correct: "Leonardo da Vinci", explanation: "Leonardo da Vinci painted the Mona Lisa." },
{ question: "Q10: What is the largest planet?", options: ["Earth", "Jupiter", "Mars", "Venus"], correct: "Jupiter", explanation: "Jupiter is the largest planet in our solar system." },


];

let currentQuestionIndex = 0;
let timer;
let timeLeft = 15;
let score = 0;

function startQuiz() {
    // Get the username input value
    username = document.getElementById('username').value;

    // Check if the username is not empty
    if (!username.trim()) {
        alert("Please enter your name to start the quiz.");
        return;
    }

    // Hide the name input form and show the quiz
    document.getElementById('name-container').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';  // Show quiz content
    displayQuestion();
}

function startTimer() {
    timeLeft = 15;
    updateTimerDisplay();
    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft === 0) {
            clearInterval(timer);
            showFeedback(`⏳ Time's up! The correct answer was: ${quizData[currentQuestionIndex].correct}`);
            showExplanation(quizData[currentQuestionIndex].explanation);
            disableOptions();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
}

function displayQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        endQuiz();
        return;
    }

    startTimer();

    const questionObj = quizData[currentQuestionIndex];
    document.getElementById("question").innerHTML = `<h3>${questionObj.question}</h3>`;
    
    let optionsHtml = questionObj.options.map(option => 
        `<button class="option-btn" data-answer="${option}">${option}</button>`
    ).join('');
    
    document.getElementById("options").innerHTML = optionsHtml;
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("explanation").innerHTML = "";

    // Add the event listener after question is displayed
    const optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach(button => {
        button.addEventListener("click", function() {
            checkAnswer(button, button.dataset.answer, questionObj.correct);
        });
    });
}

function checkAnswer(button, selected, correct) {
    clearInterval(timer);
    
    const options = document.querySelectorAll(".option-btn");
    
    options.forEach(option => {
        if (option.innerText === correct) {
            option.classList.add("selected-correct");  // Green for correct answer
        } else {
            option.classList.add("selected-wrong");   // Red for wrong answers
        }
    });

    if (selected === correct) {
        score++;
        showFeedback("✅ Correct!");
    } else {
        showFeedback(`❌ Wrong! The correct answer was: ${correct}`);
    }

    showExplanation(quizData[currentQuestionIndex].explanation);
    disableOptions();
}

function showFeedback(message) {
    document.getElementById("feedback").innerText = message;
}

function showExplanation(explanation) {
    document.getElementById("explanation").innerText = `Explanation: ${explanation}`;
}

function disableOptions() {
    const options = document.querySelectorAll(".option-btn");
    options.forEach(option => {
        option.disabled = true;
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function endQuiz() {
    document.getElementById("question").innerHTML = "<h3>Quiz Completed!</h3>";
    document.getElementById("options").innerHTML = "";
    document.getElementById("next-btn").style.display = "none";  // Hide Next Question button
    document.getElementById("explanation").style.display = "none";  // Hide explanation on final page
    document.getElementById("timer").style.display = "none";

    document.getElementById("score").style.display = "block";
    document.getElementById("score").innerHTML = `<h3>Total Score: ${score} / ${quizData.length}</h3>`;

    // Send score to Google Sheets
    sendScoreToGoogleSheets(username, score);

    document.getElementById("restart-btn").style.display = "block";
}

function sendScoreToGoogleSheets(username, score) {
    const url = 'https://script.google.com/macros/s/AKfycbwz2jtT1sv6H-pFwBo_kcq_4TUAd2HipLhlXSFvkk2BLW-RC28EdPrY9WKVhHkorb_F/exec'; // Your Apps Script URL
    const params = new URLSearchParams();
    params.append('name', username);
    params.append('score', score);

    fetch(url, {
        method: 'POST',
        body: params
    }).then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('Error:', error));
}

function restartQuiz() {
    // Reset quiz state and display
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 15;
    document.getElementById("score").style.display = "none";
    document.getElementById("restart-btn").style.display = "none";
    document.getElementById("timer").style.display = "block";
    displayQuestion();
    document.getElementById("next-btn").style.display = "block";  // Ensure next button is shown again
}

window.onload = function() {
    document.getElementById('start-btn').style.display = 'block';
};
