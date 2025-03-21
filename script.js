const primeNumbers = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
  ];
  
  let selectedNumbers = [];
  let attempts = 5;
  let score = 0;
  let timeLeft = 10;
  let timerInterval;
  
  const optionsContainer = document.getElementById('options');
  const feedback = document.getElementById('feedback');
  const remainingAttempts = document.getElementById('remaining-attempts');
  const currentScore = document.getElementById('current-score');
  const resetButton = document.getElementById('reset-button');
  const timeLeftDisplay = document.getElementById('time-left');
  
  // Check if the sum of two numbers is prime
  function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }
  
  function generateOptions() {
    const options = [];
    while (options.length < 4) {
      const randomNum = Math.floor(Math.random() * 50) + 1;
      if (!options.includes(randomNum)) {
        options.push(randomNum);
      }
    }
    return options;
  }
  
  function renderOptions() {
    optionsContainer.innerHTML = '';
    const options = generateOptions();
    selectedNumbers = options;
  
    options.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option;
      button.addEventListener('click', () => handleNumberSelection(option));
      optionsContainer.appendChild(button);
    });
  }
  
  let selectedPair = [];
  
  function handleNumberSelection(number) {
    const buttons = optionsContainer.querySelectorAll("button");

    if (selectedPair.length < 2) {
        selectedPair.push(number);

        // Add 'selected' class to clicked button
        buttons.forEach(btn => {
            if (parseInt(btn.textContent) === number) {
                btn.classList.add("selected");
            }
        });

        if (selectedPair.length === 2) {
            const sum = selectedPair[0] + selectedPair[1];
            if (isPrime(sum)) {
                feedback.textContent = `🎉 Correct! ${selectedPair[0]} + ${selectedPair[1]} = ${sum}, which is a prime number!`;
                score++;
                currentScore.textContent = score;

                // Apply 'correct' class
                buttons.forEach(btn => {
                    if (selectedPair.includes(parseInt(btn.textContent))) {
                        btn.classList.add("correct");
                    }
                });

                disableOptions();
                clearInterval(timerInterval);
                resetButton.classList.remove("hidden");
            } else {
                feedback.textContent = `❌ ${selectedPair[0]} + ${selectedPair[1]} = ${sum}, which is NOT a prime number. Try again!`;

                // Apply 'incorrect' class
                buttons.forEach(btn => {
                    if (selectedPair.includes(parseInt(btn.textContent))) {
                        btn.classList.add("incorrect");
                    }
                });

                setTimeout(() => {
                    // Reset selection styling after a short delay
                    buttons.forEach(btn => btn.classList.remove("selected", "incorrect"));
                    selectedPair = [];
                }, 1000);
            }
        }
    }
}

  function disableOptions() {
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(button => (button.disabled = true));
  }
  
  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      timeLeftDisplay.textContent = timeLeft;
  
      if (timeLeft === 0) {
        clearInterval(timerInterval);
        feedback.textContent = "⏱️ Time's up! Please select again!";
        resetGame();
      }
    }, 1000);
  }
  
  function resetGame() {
    if (attempts > 0) {
        attempts--; // Decrease attempts only if greater than 0
        remainingAttempts.textContent = attempts;
    }

    if (attempts === 0) {
        feedback.textContent = `❌ Game over! Click Reset to start a new game.`;
        resetButton.classList.remove("hidden");

        // Allow user to restart the game by clicking Reset
        resetButton.addEventListener("click", restartGame);
    } else {
        startNewRound();
    }
}

// Function to restart the game completely
function restartGame() {
    attempts = 5;  // Reset attempts to the initial value
    score = 0;  // Reset score
    timeLeft = 10;  // Reset timer
    selectedPair = [];

    remainingAttempts.textContent = attempts;
    currentScore.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    feedback.textContent = "";

    resetButton.classList.add("hidden"); // Hide reset button

    renderOptions();
    startTimer();
}

// Function to start a new round without full reset
function startNewRound() {
    feedback.textContent = '';
    timeLeft = 10;
    timeLeftDisplay.textContent = timeLeft;
    selectedPair = [];

    // Remove all selection highlights
    const buttons = optionsContainer.querySelectorAll("button");
    buttons.forEach(btn => btn.classList.remove("selected", "correct", "incorrect"));

    renderOptions();
    resetButton.classList.add('hidden');
    startTimer();
}

  resetButton.addEventListener('click', resetGame);
  
  renderOptions();
  startTimer();
  