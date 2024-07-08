// Function to fetch and display Word of the Day
function fetchWordOfTheDay() {
    console.log('Starting fetchWordOfTheDay'); // Debugging line

    // Fetch a random word
    fetch('https://random-word-api.herokuapp.com/word?number=1')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching random word: ${response.statusText}`);
            }
            return response.json();
        })
        .then(wordArray => {
            if (!Array.isArray(wordArray) || wordArray.length === 0) {
                throw new Error("No random word received");
            }
            const randomWord = wordArray[0];
            console.log(`Random Word: ${randomWord}`); // Debugging line
            return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching dictionary data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Debugging line

            if (!data || data.title === "No Definitions Found") {
                throw new Error("No definitions found for the random word.");
            }

            var word = data[0].word;
            var meanings = data[0].meanings;
            var phonetic = data[0].phonetic;
            var audioUrl = data[0].phonetics[0]?.audio;

            document.getElementById('wordOfDayContent').innerHTML = "";

            // Display Word of the Day
            var wordElement = document.createElement('h3');
            wordElement.innerText = word;
            document.getElementById('wordOfDayContent').appendChild(wordElement);

            // Display phonetic
            var phoneticElement = document.createElement('p');
            phoneticElement.innerText = "Phonetic: " + phonetic;
            document.getElementById('wordOfDayContent').appendChild(phoneticElement);

            // Display audio pronunciation
            if (audioUrl) {
                var audioElement = document.createElement('audio');
                audioElement.controls = true;
                audioElement.src = audioUrl;
                document.getElementById('wordOfDayContent').appendChild(audioElement);
            }

            // Loop through meanings to extract definitions, antonyms, examples
            meanings.forEach(meaning => {
                var partOfSpeech = meaning.partOfSpeech;
                meaning.definitions.forEach(definition => {
                    // Display definition
                    var definitionText = `(${partOfSpeech}) ${definition.definition}`;
                    var definitionElement = document.createElement('p');
                    definitionElement.innerText = "Definition: " + definitionText;
                    document.getElementById('wordOfDayContent').appendChild(definitionElement);

                    // Display antonyms
                    if (definition.antonyms && definition.antonyms.length > 0) {
                        var antonymsText = "Antonyms: " + definition.antonyms.join(', ');
                        var antonymsElement = document.createElement('p');
                        antonymsElement.innerText = antonymsText;
                        document.getElementById('wordOfDayContent').appendChild(antonymsElement);
                    }

                    // Display example sentences
                    if (definition.example) {
                        var exampleText = "Example: " + definition.example;
                        var exampleElement = document.createElement('p');
                        exampleElement.innerText = exampleText;
                        document.getElementById('wordOfDayContent').appendChild(exampleElement);
                    }

                    // Display related URLs
                    if (definition.relatedUrls && definition.relatedUrls.length > 0) {
                        var urlsText = "Related URLs: " + definition.relatedUrls.join(', ');
                        var urlsElement = document.createElement('p');
                        urlsElement.innerHTML = urlsText;
                        document.getElementById('wordOfDayContent').appendChild(urlsElement);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching the Word of the Day:', error);
            document.getElementById('wordOfDayContent').innerText = "Sorry, an error occurred. Please try again.";
        });
}

// Function to search for a specific word
// Function to search for a specific word
function buttonClicked() {
    var searchWord = document.getElementById("word_search").value;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching dictionary data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            var meanings = data[0].meanings;
            var phonetic = data[0].phonetic;
            var audioUrl = data[0].phonetics[0].audio;
            var wordUrl = `https://www.dictionary.com/browse/${searchWord}`; // Adjust URL format based on your dictionary API

            // Clear previous results
            document.getElementById('displayWord').innerHTML = "";
            document.getElementById('phonetic').innerHTML = "";
            document.getElementById('adjective').innerHTML = "";
            document.getElementById('antonyms').innerHTML = "";
            document.getElementById('examples').innerHTML = "";
            document.getElementById('audio').innerHTML = "";

            // Display phonetic
            document.getElementById('phonetic').innerText = "Phonetic: " + phonetic;

            // Display audio pronunciation
            if (audioUrl) {
                var audioElement = document.createElement('audio');
                audioElement.controls = true;
                audioElement.src = audioUrl;
                document.getElementById('audio').appendChild(audioElement);
            }

            // Loop through meanings to extract definitions, antonyms, examples
            meanings.forEach(meaning => {
                var partOfSpeech = meaning.partOfSpeech;
                meaning.definitions.forEach(definition => {
                    // Display definition
                    var definitionText = `(${partOfSpeech}) ${definition.definition}`;
                    var definitionElement = document.createElement('p');
                    definitionElement.innerText = "Definition: " + definitionText;
                    document.getElementById('displayWord').appendChild(definitionElement);

                    // Display example sentences
                    if (definition.example) {
                        var exampleText = "Example: " + definition.example;
                        var exampleElement = document.createElement('p');
                        exampleElement.innerText = exampleText;
                        document.getElementById('examples').appendChild(exampleElement);
                    }
                });

                // Display antonyms separately
                if (meaning.antonyms && meaning.antonyms.length > 0) {
                    var antonymsText = "Antonyms: " + meaning.antonyms.join(', ');
                    var antonymsElement = document.createElement('p');
                    antonymsElement.innerText = antonymsText;
                    document.getElementById('antonyms').appendChild(antonymsElement);
                }
            });

            // Display URL
            var urlElement = document.createElement('p');
            urlElement.innerHTML = `<a href="${wordUrl}" target="_blank">Dictionary.com - ${searchWord}</a>`;
            document.getElementById('displayWord').appendChild(urlElement);
        })
        .catch(error => {
            console.error('Error fetching the word data:', error);
            document.getElementById('displayWord').innerText = "Sorry, an error occurred. Please try again.";
        });
}


// Fetch Word of the Day on page load
document.addEventListener('DOMContentLoaded', fetchWordOfTheDay);



// Function to add word to favorites
function addToFavorites() {
    var word = document.getElementById("displayWord").textContent.trim(); // Assuming displayWord is where you show the current word
    console.log("Word to be added:", word); // Debugging line

    // Get existing favorites from localStorage or initialize empty array
    var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log("Current favorites:", favorites); // Debugging line

    // Check if word is already in favorites
    if (!favorites.includes(word)) {
        favorites.push(word);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        console.log("Word added to favorites:", word); // Debugging line
    } else {
        console.log("Word already in favorites"); // Debugging line
    }
}

// Function to load favorites on favorites.html page
function loadFavorites() {
    var favorites = JSON.parse(localStorage.getItem("favorites"));
    console.log("Loaded favorites:", favorites); // Debugging line

    var favoritesList = document.getElementById("favoritesList");

    // Clear existing list to avoid duplicates
    favoritesList.innerHTML = "";

    if (favorites && favorites.length > 0) {
        favorites.forEach(function(word) {
            var li = document.createElement("li");
            li.textContent = word;
            favoritesList.appendChild(li);
        });
    } else {
        var li = document.createElement("li");
        li.textContent = "No favorites saved.";
        favoritesList.appendChild(li);
    }
}

// Call loadFavorites on page load to display saved favorites
window.onload = function() {
    loadFavorites();
};

// Fetch Word of the Day on page load
fetchWordOfTheDay();

