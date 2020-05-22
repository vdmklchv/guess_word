const startButton = document.querySelector('#start');
const roundNumberSpan = document.querySelector('#round-number');
const chosenWord = document.querySelector('#chosen-word');
const resultMessage = document.querySelector('#result-message');
const wonGames = document.querySelector('#won');
const lostGames = document.querySelector('#lost');
const incorrectLetterGroup = document.querySelector('#incorrect-letter-group');
const livesNumberSpan = document.querySelector('#lives-number');
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const select = document.querySelector('#length');
const definition = document.querySelector('#definition');
const alphabetSection = document.querySelector('#alphabet');
const percent = document.querySelector('#percent');

let wonGamesCount = 0;
let lostGamesCount = 0;
let livesNumber = 5;
let round = 0;
let word = '';
let letterarray = [];

/* calculate winning rate */
function calculateWinRate(winNumber,lostNumber)  {
    return Number.parseFloat(winNumber/(winNumber + lostNumber)).toFixed(3)
}

/* reveal word definition */

function revealWordDefinition(word) {
    const fetchPromise = fetch(`https://www.dictionaryapi.com/api/v3/references/sd4/json/${word}?key=ccebcb5b-e2d6-4f47-92af-5c543a12d51c`);
    fetchPromise.then(response => {
        return response.json();
    }).then(item => {
        definition.innerText = item[0]["shortdef"][0];
    })
}


/* drawing alphabet on game board */
function alphabetDraw(array) {
    for (let i of array)    {
        alphabetSection.innerHTML += `<button class="alphabet-letter" id="b${i}">${i}</button>`;
    }
}


/* defining game array depending on choice */

function defineGameArray(value) {
    let gameArray = [];
    switch (value)    {
        case 'random':
            gameArray = wordArray;
            return gameArray;
        case '4':
            gameArray = wordArray.filter((word) => word.length === 4);
            return gameArray;
        case '5':
            gameArray = wordArray.filter((word) => word.length === 5);
            return gameArray; 
        case '6':
            gameArray = wordArray.filter((word) => word.length === 6);
            return gameArray;
        case '7':
            gameArray = wordArray.filter((word) => word.length === 7);
            return gameArray;
        case '8':
            gameArray = wordArray.filter((word) => word.length === 8);
            return gameArray;
        case '9':
            gameArray = wordArray.filter((word) => word.length === 9);
            return gameArray;
        case '10':
            gameArray = wordArray.filter((word) => word.length === 10);
            return gameArray;
    }
}

/* function choosing random word */

function chooseRandomWord(array)    {
    const index = Math.floor(Math.random()*array.length);
    return array[index];
}

/* function generating asterisks depending on letters number */

function generateAsterisks(word)    {
    chosenWord.innerText = '';
    for (let i of word) {
        chosenWord.innerText += '*';
    }
}

/* function to find all indexes of letter in array */

function findAllIndices(array, letter)  {
    const indicesArray = [];
    let index = 0;
    while (array.indexOf(letter, index) !== -1)    {
        indicesArray.push(array.indexOf(letter, index));
        index = array.indexOf(letter, index) + 1;
    }
    return indicesArray;
}

/* reveal guessed letters */

function revealGuessedLetters(array, letter)    {
    const currentString = chosenWord.innerText;
    let newString = '';
    for (let i = 0; i < currentString.length; i++)    {
        if (array.includes(i))  {
            newString += letter;
        }
        else    {
            newString += currentString[i];
        }
    }
    chosenWord.innerText = newString;
}

/* check if letter is valid */
function checkValidLetter(letter)   {
    if (errorLetterArray.includes(letter) || chosenWord.innerText.split('').includes(letter))   { //checking if submitted letter has been already tried
        resultMessage.innerText = 'You have already tried this letter. Please provide another one.';
        resultMessage.style.color = 'black';
        return false;
    }

    else if (letter === '') {
        resultMessage.innerText = 'Input empty. Please provide a letter!';
        resultMessage.style.color = 'black';
        return false;
    }

    else if (alphabet.indexOf(letter) === -1) {
        resultMessage.innerText = 'Input invalid. Please provide correсt letter!';
        resultMessage.style.color = 'red';
        return false;
    }
    return true;
}

/* alphabetLetters toggle */
function alphabetDisable(array)  {
    for (let i of array)    {
        i.disabled = true;
        i.classList.add = 'nohover';
    }
}

function alphabetEnable(array) {
    for (let i of array)    {
        i.disabled = false;
        i.classList.remove = 'nohover';
    }
}

/* binding keyboard keys to letters */

/* check if letter in word */

function checkIfLetterCorrect(letter, text) {
   for (let i of text)    {
        if (letter === i)   {
            return true;
        }
   }
   return false;
}  

/* game mechanics */

alphabetDraw(alphabet); //draw alphabet buttons 

/* checking pressed keyboard keys and registering correct letter */
window.addEventListener('keyup', (event) => {
    document.querySelector(`#b${String.fromCharCode(event.keyCode).toLowerCase()}`).click();
})

/* ability to start game with spacebar */
window.addEventListener('keyup', (event) => {
    if (event.keyCode === 32)   {
        startButton.click();
    }
})

/* get all letters and toggle them to disabled before the round starts */
const alphabetLetters = document.querySelectorAll('.alphabet-letter');
alphabetDisable(alphabetLetters);
/* input letter with mouse */

startButton.addEventListener('click', () => {
    definition.innerText = 'Definition will appear here after round end.';
    alphabetEnable(alphabetLetters);
    select.disabled = true;
    chosenWord.style.fontSize = '80px';
    const wordLength = document.querySelector('#length').value;
    const gameArray = defineGameArray(wordLength); //defining array for current round
    word = chooseRandomWord(gameArray).toLowerCase(); //generating word to guess in current round
    generateAsterisks(word);//generate asterisks in needed number 
    errorLetterArray = [];
    letterArray = word.split(''); //make array of word letters
    incorrectLetterGroup.innerText = '';
    livesNumberSpan.innerText = 5;
    startButton.disabled = true;
    round += 1; //increase round number;
    roundNumberSpan.innerText = round; //print round number on page
    resultMessage.innerText = 'Make a guess (letters from a to z):';
    resultMessage.style.color = 'black';
})

alphabetSection.addEventListener('click', (event) => {
    if (checkIfLetterCorrect(event.target.innerText, word)) {
        event.target.disabled = true;
        /*event.target.classList.add('nohover');*/
        resultMessage.innerText = 'Congratulations! The letter is correct. Input another letter:';
        resultMessage.style.color = 'green';
        const letterIndices = findAllIndices(letterArray, event.target.innerText); // find array of indices of correctly guessed letter
        revealGuessedLetters(letterIndices, event.target.innerText);
        if (!chosenWord.innerText.split('').includes('*'))   {
            startButton.disabled = false;
            wonGamesCount += 1;
            wonGames.innerText = wonGamesCount;
            resultMessage.innerText = 'Game won! Press New Game button to start next round.';
            alphabetDisable(alphabetLetters);
            percent.innerText = `${calculateWinRate(wonGamesCount, lostGamesCount)}`;
            revealWordDefinition(word);
            select.disabled = false;
        }
    }
    else  {
        livesNumber = +livesNumberSpan.innerText - 1;
        livesNumberSpan.innerText = livesNumber;
        errorLetterArray.push(event.target.innerText);
        event.target.disabled = true;

        if (livesNumber > 0) {
            resultMessage.innerText = 'Sorry. No such letter. Try again:';
            resultMessage.style.color = 'red';
            incorrectLetterGroup.innerText = errorLetterArray.join(' ');
        } 
        if (livesNumber === 0) {
            incorrectLetterGroup.innerText = errorLetterArray.join(' ');
            resultMessage.innerText = 'Game Over. You have lost. Start the next round.';
            alphabetDisable(alphabetLetters);
            revealWordDefinition(word);
            select.disabled = false;
            resultMessage.style.color = 'red';
            chosenWord.innerText = word;
            lostGamesCount += 1;
            percent.innerText = `${calculateWinRate(wonGamesCount, lostGamesCount)}`;
            lostGames.innerText = lostGamesCount;
            startButton.disabled = false;
        }
    }   
})


     