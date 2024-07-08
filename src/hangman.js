// Define an array of words and clues for the game
const words = [
    { word: 'javascript', clue: 'A programming language used for web development' },
    { word: 'hangman', clue: 'A guessing game where players try to guess a word' },
    { word: 'programming', clue: 'The process of creating software applications' }
];

let chosenWord = '';
let guessedLetters = [];
let hangmanWordDisplay = [];
let remainingGuesses = 6; // Number of incorrect guesses allowed
let gameRunning = false;

// Function to start a new game
function startGame() {
    // Choose a random word from the words array
    const randomIndex = Math.floor(Math.random() * words.length);
    chosenWord = words[randomIndex].word;
    
    // Initialize arrays for guessed letters and hangman word display
    guessedLetters = [];
    hangmanWordDisplay = [];

    // Clear previous result message
    document.getElementById('resultMessage').innerText = '';

    // Display underscores for each letter of the chosen word
    for (let i = 0; i < chosenWord.length; i++) {
        hangmanWordDisplay.push('_');
    }

    // Display initial hangman word
    updateHangmanWordDisplay();

    // Enable game running flag
    gameRunning = true;

    // Display clue for the chosen word
    displayClue(words[randomIndex].clue);
}

// Function to update the display of the hangman word
function updateHangmanWordDisplay() {
    document.getElementById('hangmanWord').innerText = hangmanWordDisplay.join(' ');
}

// Function to display a clue for the chosen word
function displayClue(clue) {
    document.getElementById('clueDisplay').innerText = `Clue: ${clue}`;
}

// Function to check if a guessed letter is in the chosen word
function checkGuess() {
    if (!gameRunning) return;

    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.toLowerCase();

    // Clear input field
    guessInput.value = '';

    if (guess.length !== 1 || !guess.match(/[a-z]/i)) {
        // Check if the input is a single letter
        alert('Please enter a single letter.');
        return;
    }

    // Check if the guessed letter is already guessed
    if (guessedLetters.includes(guess)) {
        alert('You have already guessed this letter.');
        return;
    }

    // Add guessed letter to guessedLetters array
    guessedLetters.push(guess);

    // Check if guessed letter is in the chosen word
    let foundMatch = false;
    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === guess) {
            // Update display of hangmanWordDisplay array
            hangmanWordDisplay[i] = guess;
            foundMatch = true;
        }
    }

    // Update hangman word display
    updateHangmanWordDisplay();

    // Check if game is won
    if (hangmanWordDisplay.join('') === chosenWord) {
        endGame(true);
        return;
    }

    // Check if guessed letter is incorrect
    if (!foundMatch) {
        remainingGuesses--;
        updateResultMessage(`Incorrect guess. ${remainingGuesses} guesses remaining.`);

        // Check if game is lost
        if (remainingGuesses === 0) {
            endGame(false);
        }
    } else {
        updateResultMessage('Correct guess!');
    }
}

// Function to update the result message
function updateResultMessage(message) {
    document.getElementById('resultMessage').innerText = message;
}

// Function to end the game
function endGame(isWin) {
    if (isWin) {
        updateResultMessage('Congratulations! You guessed the word.');
    } else {
        updateResultMessage(`Game over. The word was "${chosenWord}".`);
    }
    gameRunning = false;
}

// Initialize game when page is loaded
document.addEventListener('DOMContentLoaded', function() {
    startGame();
});
