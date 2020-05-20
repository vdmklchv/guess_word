const startButton = document.querySelector('#start');
const roundNumberSpan = document.querySelector('#round-number');
const chosenWord = document.querySelector('#chosen-word');
const submitButton = document.querySelector('#submit');
const resultMessage = document.querySelector('#result-message');
const letterInput = document.querySelector('#letter-input');
const wonGames = document.querySelector('#won');
const lostGames = document.querySelector('#lost');
const incorrectLetterGroup = document.querySelector('#incorrect-letter-group');
const livesNumberSpan = document.querySelector('#lives-number');
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let wonGamesCount = 0;
let lostGamesCount = 0;
let livesNumber = 5;
let round = 0;
let word = '';
let letterarray = [];

letterInput.disabled = true;

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
        letterInput.value = '';
        resultMessage.style.color = 'black';
        return false;
    }

    else if (letter === '') {
        resultMessage.innerText = 'Input empty. Please provide a letter!';
        resultMessage.style.color = 'black';
        return false;
    }

    else if (alphabet.indexOf(letter) === -1) {
        resultMessage.innerText = 'Input invalid. Please provide corret letter!';
        resultMessage.style.color = 'red';
        return false;
    }
    return true;
}

/* start new round */
letterInput.disabled = true;
submitButton.disabled = true;


startButton.addEventListener('click', () => {
    chosenWord.style.fontSize = '80px';
    const wordLength = document.querySelector('#length').value;
    const gameArray = defineGameArray(wordLength); //defining array for current round
    word = chooseRandomWord(gameArray).toLowerCase(); //generating word to guess in current round
    generateAsterisks(word);//generate asterisks in needed number 
    errorLetterArray = [];
    letterArray = word.split(''); //make array of word letters
    incorrectLetterGroup.innerText = '';
    livesNumberSpan.innerText = 5;
    letterInput.disabled = false;
    startButton.disabled = true;
    submitButton.disabled = false;
    letterInput.value = '';
    round += 1; //increase round number;
    roundNumberSpan.innerText = round; //print round number on page
    resultMessage.innerText = 'Make a guess (letters from a to z):';
    resultMessage.style.color = 'black';
})

submitButton.addEventListener('click', () => {
    const submittedLetter = letterInput.value.toLowerCase(); //storing submitted letter in a variable
      checkValidLetter(submittedLetter);

      /* game mechanics */
      if (checkValidLetter(submittedLetter))    {
          if (letterArray.includes(submittedLetter)) { //check if word includes submitted letters
              resultMessage.innerText = 'Congratulations! The letter is correct. Input another letter:';
              resultMessage.style.color = 'green';
              const letterIndices = findAllIndices(letterArray, submittedLetter); // find array of indices of correctly guessed letter
              revealGuessedLetters(letterIndices, submittedLetter);
              letterInput.value = '';
              if (!chosenWord.innerText.split('').includes('*'))   {
                  letterInput.disabled = true;
                  submitButton.disabled = true;
                  startButton.disabled = false;
                  wonGamesCount += 1;
                  wonGames.innerText = wonGamesCount;
                  resultMessage.innerText = 'Game won! Press New Game button to start next round.';
              }
          } else  {
              livesNumber = +livesNumberSpan.innerText - 1;
              livesNumberSpan.innerText = livesNumber;
              errorLetterArray.push(letterInput.value);
              if (livesNumber > 0) {
                  resultMessage.innerText = 'Sorry. No such letter. Try again:';
                  resultMessage.style.color = 'red';
                  incorrectLetterGroup.innerText = errorLetterArray.join(' ');
              } 
              if (livesNumber === 0) {
                    incorrectLetterGroup.innerText = errorLetterArray.join(' ');
                  resultMessage.innerText = 'Game Over. You have lost. Start the next round.'
                  resultMessage.style.color = 'red';
                  lostGamesCount += 1;
                  lostGames.innerText = lostGamesCount;
                  letterInput.disabled = true;
                  startButton.disabled = false;
                  submitButton.disabled = true;
              }
              letterInput.value = '';
          }   
      }
  })  