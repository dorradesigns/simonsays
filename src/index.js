/**
 * DOM SELECTORS
 */
const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status-span");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");

/**
 * VARIABLES
 */
let computerSequence = [];
let playerSequence = [];
let maxRoundCount = 0;
let roundCount = 0;

/**
 * The `pads` array contains an array of pad objects.
 */
const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("../assets/simon-says-sound-1.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("../assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("../assets/simon-says-sound-3.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("../assets/simon-says-sound-4.mp3"),
  },
];

/**
 * EVENT LISTENERS
 */
padContainer.addEventListener("click", padHandler);

startButton.addEventListener("click", startButtonHandler);
/**
 * EVENT HANDLERS
 */

function startButtonHandler() {
  const selectedSkillLevel = document.getElementById('skillLevel').value;
  setLevel(selectedSkillLevel); // Set the level of the game based on dropdown selection
  roundCount = 1; // Increment the roundCount
  startButton.classList.add("hidden"); // Hide the start button
  statusSpan.classList.remove("hidden"); // Unhide the status element

  playComputerTurn(); // Start the game with the computer going first.
}


function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  activatePad(color);
  checkPress(color);
}

/**
 * HELPER FUNCTIONS
 */

function setLevel(level = 1) {
  switch (level) {
    case 1:
      maxRoundCount = 8;
      break;
    case 2:
      maxRoundCount = 14;
      break;
    case 3:
      maxRoundCount = 20;
      break;
    case 4:
      maxRoundCount = 31;
      break;
    default:
      console.error("Please enter level 1, 2, 3, or 4");
      return "Please enter level 1, 2, 3, or 4";
  }

  return maxRoundCount;
}

function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

/**
 * Sets the text content of a given HTML element with a given text.
 */
function setText(element, text) {
  element.textContent = text;
  return element;
}

function activatePad(color) {
  const pad = pads.find((pad) => pad.color === color);

  if (pad) {
    pad.sound.play();
    pad.selector.classList.add("activated");

    setTimeout(() => {
      pad.selector.classList.remove("activated");
    }, 500);
  }
}
function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, index * 600);
  });
}
/* Update the playComputerTurn function in src/index.js */

function playComputerTurn() {
  padContainer.classList.add("unclickable");
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);

  const randomColor = getRandomItem(["red", "green", "blue", "yellow"]);
  computerSequence.push(randomColor);

  activatePads(computerSequence);

  // Add victory music if the player successfully completes all rounds
  if (roundCount === maxRoundCount) {
    playAudio('../assets/simon-says-sound-1.mp3');
  }

  setTimeout(() => {
    playHumanTurn(roundCount);
  }, roundCount * 600 + 1000);
}

function playAudio(audioPath) {
  const audio = new Audio(audioPath);
  audio.play();
}


function playHumanTurn() {
  padContainer.classList.remove("unclickable");
  setText(statusSpan, "Your turn!");
}

function checkPress(color) {
  playerSequence.push(color);
  const index = playerSequence.length - 1;
  const remainingPresses = computerSequence.length - playerSequence.length;

  setText(statusSpan, `Press ${color.toUpperCase()} (${remainingPresses} left)`);

  if (computerSequence[index] !== playerSequence[index]) {
    resetGame("Wrong move! Game over.");
    return;
  }

  if (remainingPresses === 0) {
    checkRound();
  }
}

function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    resetGame("Congratulations! You won!");
  } else {
    roundCount++;
    playerSequence = [];
    setText(statusSpan, "Nice! Keep going!");
    padContainer.classList.add("unclickable");
    setTimeout(() => playComputerTurn(), 1000);
  }
}

function resetGame(text) {
  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");

  computerSequence = [];
  playerSequence = [];
  roundCount = 0;
  maxRoundCount = 0;
}


/**
 * Please do not modify the code below.
 * Used for testing purposes.
 *
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;
