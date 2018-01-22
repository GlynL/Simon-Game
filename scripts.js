const colours = ["red", "blue", "green", "yellow"];

let strict = false;

let demo = true;

// sounds
const sounds = {
  red: new Audio("sounds/simonSound1.mp3"),
  blue: new Audio("sounds/simonSound2.mp3"),
  green: new Audio("sounds/simonSound3.mp3"),
  yellow: new Audio("sounds/simonSound4.mp3"),
  error: new Audio("sounds/errorSound.wav"),
  success: new Audio("sounds/successSound.wav")
};

// info text
const infoText = document.querySelector("#info-text");

// arrays for storing goal and attempt sequences
const sequence = {};

gameWon = () => {
  infoText.textContent = "You Win!";
  // add winning animation
  const gameBox = document.querySelector("#game-box");
  gameBox.classList.add("spin");
  setTimeout(() => gameBox.classList.remove("spin"), 5000);
};

// sounds playing
handleSoundPlay = colour => {
  colour.classList.add("active");
  switch (colour.id) {
    case "red":
      sounds.red.play();
      break;
    case "blue":
      sounds.blue.play();
      break;
    case "green":
      sounds.green.play();
      break;
    case "yellow":
      sounds.yellow.play();
      break;
  }
  setTimeout(() => colour.classList.remove("active"), 200);
};

// play the goal sequence
playGoalSequence = () => {
  demo = true;
  let timeout = 0;
  sequence.goal.forEach(c => {
    const goalClick = document.getElementById(c);
    timeout += 500;
    setTimeout(() => handleSoundPlay(goalClick), timeout);
  });
  setTimeout(() => (demo = false), timeout);
};

// if correct sequence
handleCorrectSequence = () => {
  sounds.success.play();
  colourBtns.forEach(c => {
    c.classList.add("correct");
    setTimeout(() => c.classList.remove("correct"), 200);
  });
};

// if wrong sequence
handleWrongSequence = () => {
  sounds.error.play();
  colourBtns.forEach(c => {
    c.classList.add("wrong");
    setTimeout(() => c.classList.remove("wrong"), 200);
  });
};

checkFullSequence = () => {
  // counter
  const infoCounter = document.querySelector("#counter");
  if (
    sequence.attempt.length === sequence.goal.length &&
    sequence.attempt.length !== 0
  ) {
    setTimeout(() => handleCorrectSequence(), 200);
  }
  // check for game won
  if (sequence.attempt.length === 20) return setTimeout(() => gameWon(), 1000);
  else if (sequence.attempt.length === sequence.goal.length) {
    // if the attempt is empty or correct add to the goal sequence
    // random number from 0 to 3
    const randomNum = Math.floor(Math.random() * 4);
    // random colour added to goal
    sequence.goal.push(colours[randomNum]);
    sequence.attempt = [];
    // update level counter
    infoCounter.textContent = sequence.goal.length;
    playGoalSequence();
  }
};

// colour buttons
const colourBtns = document.querySelectorAll(".colour");

checkSequence = () => {
  for (let i = 0; i < sequence.attempt.length; i++) {
    if (sequence.attempt[i] !== sequence.goal[i]) return false;
  }
  return true;
};

// when colours clicked
handleColourClick = e => {
  // sounds played to match colour
  handleSoundPlay(e.target);
  // add colour to sequence attempt if turn & not demo
  if (!demo) sequence.attempt.push(e.target.id);
  // check if colour is right
  if (!checkSequence()) {
    // error
    handleWrongSequence();
    // if strict mode
    if (strict)
      return (() => {
        infoText.textContent = "Try Again";
        setTimeout(() => gameSetup(), 1000);
      })();
    // reset the attempt[]
    sequence.attempt = [];
    playGoalSequence();
  }
  checkFullSequence();
};

// handles game start
gameSetup = () => {
  infoText.textContent = "Level";
  startBtn.removeEventListener("click", gameSetup);
  // change buttons
  startBtn.classList.add("hide");
  resetBtn.classList.remove("hide");
  //setup sequences
  sequence.goal = [];
  sequence.attempt = [];
  // click listeners for colours
  colourBtns.forEach(colour =>
    colour.addEventListener("click", handleColourClick)
  );

  // will add first to goal sequence
  checkFullSequence();
};

// reset game
const resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", gameSetup);

// start game button
const startBtn = document.querySelector("#start");
startBtn.addEventListener("click", gameSetup);

toggleStrict = () => {
  strict = !strict;
  strictBtn.textContent = strict ? "easy" : "strict";
};

const strictBtn = document.querySelector("#strict");
strictBtn.addEventListener("click", toggleStrict);
