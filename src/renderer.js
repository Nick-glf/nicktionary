// Array of words for the game (you can expand this list)
const words = [
    "PRINT",
    "HOUSE",
    "TIGER",
    "APPLE",
    "MUSIC"
];

// Variables to store current word and its scrambled version
let currentWord, scrambledWord;

// Function to start a new game
function startGame() {
    // Generate a random index to pick a word from the array
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    scrambledWord = scrambleWord(currentWord);

    // Display scrambled word in the UI
    document.getElementById("scrambledWord").textContent = scrambledWord;

    // Clear previous messages
    document.getElementById("resultMessage").textContent = "";
    document.getElementById("resultMessage").style.color = "";
}

// Function to scramble a word
function scrambleWord(word) {
    // Convert word to array of characters
    const characters = word.split('');

    // Scramble the word (simple shuffle)
    for (let i = characters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    // Return scrambled word as string
    return characters.join('');
}

// Function to check the user's guess
function checkGuess() {
    const userGuess = document.getElementById("guessInput").value.trim().toUpperCase();
    const resultMessageElement = document.getElementById("resultMessage");

    if (userGuess === currentWord) {
        resultMessageElement.textContent = "Correct! You unscrambled the word.";
        resultMessageElement.style.color = "green";
    } else {
        resultMessageElement.textContent = "Incorrect. Try again!";
        resultMessageElement.style.color = "red";
    }
}

// Example usage:
// Call startGame() to begin a new game
startGame();
