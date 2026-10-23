/* https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/ */
const KEYBOARD_EL = document.querySelector("#keyboard")
const attempt = document.querySelector("#attempt-box")
var level = document.querySelector("#level")

const DAILY_PROGRESS_KEY = "spellcheck-daily-progress";
const DAILY_PUZZLE_ID = sessionStorage.getItem("puzzleNum");
let dailyAlreadyComplete = false;
try {
    dailyAlreadyComplete = Boolean(DAILY_PUZZLE_ID) &&
        localStorage.getItem("dailyCompletedPuzzle") === DAILY_PUZZLE_ID;
} catch (error) {
    // The daily challenge remains playable when browser storage is unavailable.
}

// Completion is tracked per puzzle, so the next day's challenge remains available.
if (dailyAlreadyComplete) {
    window.location.replace("mode_select.html");
}

var wordOne = document.querySelector("#word-one")
var wordTwo = document.querySelector("#word-two")
var wordThree = document.querySelector("#word-three")
var wordFour = document.querySelector("#word-four")
var wordFive = document.querySelector("#word-five")

var wordOnePlayer = document.querySelector("#word-one-player")
var wordTwoPlayer = document.querySelector("#word-two-player")
var wordThreePlayer = document.querySelector("#word-three-player")
var wordFourPlayer = document.querySelector("#word-four-player")
var wordFivePlayer = document.querySelector("#word-five-player")

var wordOneSubmission = '';
var wordTwoSubmission = '';
var wordThreeSubmission = '';
var wordFourSubmission = '';
var wordFiveSubmission = '';

var wordOneSpelling = '';
var wordTwoSpelling = '';
var wordThreeSpelling = '';
var wordFourSpelling = '';
var wordFiveSpelling = '';

var playerLst = [
    [wordOne, wordOnePlayer, wordOneSpelling, wordOneSubmission],
    [wordTwo, wordTwoPlayer,wordTwoSpelling, wordTwoSubmission],
    [wordThree, wordThreePlayer, wordThreeSpelling, wordThreeSubmission],
    [wordFour, wordFourPlayer, wordFourSpelling, wordFourSubmission],
    [wordFive, wordFivePlayer, wordFiveSpelling, wordFiveSubmission]
];

var lastActiveWord = null;
var attemptStr = '';
var activeWord = null;
var activePlayer = null;
var results = '';
var numSubmitted;
var numWrong = 0;
var correctSpellingLst = [];
var submissionLst = [];
var currentAudioPath;

function saveDailyProgress() {
    if (!Array.isArray(wordLst) || !wordLst.length) return;
    SpellcheckProgress.save(DAILY_PROGRESS_KEY, {
        puzzleId: DAILY_PUZZLE_ID,
        levelText: level.textContent,
        levelPath: currentAudioPath,
        wordLst,
        numSubmitted,
        numWrong,
        attemptStr,
        results,
        correctSpellingLst,
        submissionLst,
        players: playerLst.map((player) => ({
            correct: player[2],
            submission: player[3],
            status: player[0].classList.contains("fa-check") ? "correct" :
                player[0].classList.contains("fa-xmark") ? "incorrect" : "pending"
        }))
    });
}

KEYBOARD_EL.innerHTML = `<div id="keyboard-cont">
    <div class="first-row">
        <button class="keyboard-button boxed" id="q">Q</button>
        <button class="keyboard-button boxed" id="w">W</button>
        <button class="keyboard-button boxed" id="e">E</button>
        <button class="keyboard-button boxed" id="r">R</button>
        <button class="keyboard-button boxed" id="t">T</button>
        <button class="keyboard-button boxed" id="y">Y</button>
        <button class="keyboard-button boxed" id="u">U</button>
        <button class="keyboard-button boxed" id="i">I</button>
        <button class="keyboard-button boxed" id="o">O</button>
        <button class="keyboard-button boxed" id="p" >P</button>
    </div>
    <div class="second-row">
        <button class="keyboard-button boxed" id="a">A</button>
        <button class="keyboard-button boxed" id="s">S</button>
        <button class="keyboard-button boxed" id="d">D</button>
        <button class="keyboard-button boxed" id="f">F</button>
        <button class="keyboard-button boxed" id="g">G</button>
        <button class="keyboard-button boxed" id="h">H</button>
        <button class="keyboard-button boxed" id="j">J</button>
        <button class="keyboard-button boxed" id="k">K</button>
        <button class="keyboard-button boxed" id="l">L</button>
    </div>
    <div class="third-row">
        <button class="keyboard-button boxed" id="z">Z</button>
        <button class="keyboard-button boxed" id="x">X</button>
        <button class="keyboard-button boxed" id="c">C</button>
        <button class="keyboard-button boxed" id="v">V</button>
        <button class="keyboard-button boxed" id="b">B</button>
        <button class="keyboard-button boxed" id="n">N</button>
        <button class="keyboard-button boxed" id="m">M</button>
        <button type="button" class="keyboard-button boxed fa fa-delete-left" style="line-height:1.5" id="Backspace" aria-label="Delete last letter"></button>
    </div>
    <div class="fourth-row">
        <button type="button" class="keyboard-button boxed" id="Enter" aria-label="Submit spelling">submit</button>
    </div>
</div>`


var dictValue;
// CHECK LEVEL 
function checkLevel(level){
    resetPlayer(playerLst);
    attempt.value=attemptStr;
    if (level.textContent == "Level One: Easy"){
        assignSound("levelOneNEW", chooseWords(easyWords))
        dictValue = "levelOne"
    } else if (level.textContent == "Level Two: Medium"){
        assignSound("levelTwoNEW", chooseWords(mediumWords))
        dictValue = "levelTwo"

    } else if (level.textContent == "Level Three: Hard"){
        assignSound("levelThreeNEW", chooseWords(hardWords))
        dictValue = "levelThree"

    } else {
        window.location.replace("ahshit.html");    
    }
    saveDailyProgress();
}

// POPULATE PAGE WITH LEVEL APPROPRIATE WORDS
function assignSound(levelPath, words){
    currentAudioPath = levelPath;
    path = `assets/audio/${levelPath}`;
   try{
        // setting neutral values
        wordLst = words;
        numSubmitted = 0;
        activeWord = null;
        activePlayer = null;
        wordOnePlayer.src = `${path}/${words[0]}.mp3`
        wordTwoPlayer.src = `${path}/${words[1]}.mp3`
        wordThreePlayer.src = `${path}/${words[2]}.mp3`
        wordFourPlayer.src = `${path}/${words[3]}.mp3`
        wordFivePlayer.src = `${path}/${words[4]}.mp3`
    } catch(error) {
        console.log(error)
    }         
}

// MOVE TO NEXT ROUND
function nextRound(){
    if (level.textContent == "Level One: Easy"){
        level.textContent = "Level Two: Medium"
    } else if (level.textContent == "Level Two: Medium"){
        level.textContent = "Level Three: Hard"
    } else if (level.textContent == "Level Three: Hard"){
        endGame();
    } else {
        window.location.replace("ahshit.html");  
    }
    nextRoundBtn.innerHTML = `<div></div>`
    checkLevel(level)
    return;
}

function endGame(){
    try {
        localStorage.setItem("dailyCompletedPuzzle", DAILY_PUZZLE_ID);
        localStorage.removeItem("dailyStatus");
    } catch (error) {
        // Results still work even if persistent storage is unavailable.
    }
    SpellcheckProgress.clear(DAILY_PROGRESS_KEY);
    sessionStorage.setItem("numWrong", numWrong);
    sessionStorage.setItem("correctSpellingLst", correctSpellingLst);
    sessionStorage.setItem("submissionLst", submissionLst);
    sessionStorage.setItem("emojiResults", results);
    window.location.replace("results.html");
}

// UPDATE RESULTS
function updateResults(){
    playerLst.forEach((player) => {
        correctSpellingLst.push(player[2])
        submissionLst.push(player[3])
        if (player[0].classList.contains("fa-check")) {
            results += "✅"
        } else if (player[0].classList.contains("fa-xmark")) {
            results += "❌"
            numWrong += 1;
        }
        results += " "
    })
    results += "\\n"
    saveDailyProgress();
}

// STOP PLAYING SOUND
function stopSound(soundObj) {
    soundObj.pause();
    soundObj.currentTime = 0;
}

// UPDATE ATTEMPT STR UPON KEYPRESS
function insertLetter(pressedKey) {
    pressedKey = pressedKey.toUpperCase()
    attemptStr = attemptStr + pressedKey;
    attempt.value = attemptStr;
    attempt.scrollLeft = attempt.scrollWidth;
    saveDailyProgress();
}

// DELETE A LETER
function deleteLetter () {
    if (attemptStr.length > 0) {
        attemptStr = attemptStr.slice(0,-1);
    }
    attempt.value = attemptStr;
    saveDailyProgress();
}

attempt.addEventListener("input", () => {
    attemptStr = attempt.value.toUpperCase().replace(/[^A-Z]/g, "");
    attempt.value = attemptStr;
    saveDailyProgress();
});

// CHECK IF GUESS IS CORRECT

function guessPreprocess(){
    if (lastActiveWord != null && activeWord==null) {
        activeWord = lastActiveWord;
        checkGuess()
        return;
    } else if (activeWord == null) {
        console.log("Attempted guess without word selected.");
        attemptStr = '';
        attempt.value = attemptStr;
        return;
    } else if (attemptStr == '') {
        console.log("Empty string submitted as guess. Ignoring that.");
        return;
    } else {
        checkGuess();
    }
}

function checkGuess() {
    // A prompt can be submitted only once; ignore stale or repeated selections.
    if (!activePlayer || activePlayer[0].classList.contains("submitted")) {
        activeWord = null;
        activePlayer = null;
        attemptStr = '';
        attempt.value = attemptStr;
        return;
    }

    //correctSpellingLst.push(`<td>${activeWord}</td>`);        
    activePlayer[2] = `<td>${activeWord}</td>`

    if ((attemptStr.toLowerCase() == activeWord.toLowerCase())) {
        stopSound(activePlayer[1]);
        activePlayer[0].style.backgroundColor = "#79b15a";
        activePlayer[0].classList.add("submitted", "fa-check");     
        activePlayer[0].classList.remove("clicked","fa-play-circle", "fa-circle-stop","btn");

        // RECORD FOR RESULTS
        activePlayer[3] = `<td>${attemptStr}</td>`
        //submissionLst.push(`<td>${attemptStr}</td>`)

        
        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;   
    } else {
        stopSound(activePlayer[1]);
        activePlayer[0].style.backgroundColor = "#d25842";
        activePlayer[0].classList.add("submitted", "fa-xmark"); 
        activePlayer[0].classList.remove("clicked","fa-circle-stop", "fa-play-circle","btn");

        // RECORD FOR RESULTS
        activePlayer[3] = `<td class="error">${attemptStr}</td>`
        //submissionLst.push(`<td class="error">${attemptStr}</td>`)

        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;   
    }
    attemptStr = '';
    attempt.value = attemptStr;    
    numSubmitted += 1;

    if (numSubmitted == 5) {
        updateResults();
        showNextRound();
        //nextRound();
    }
    saveDailyProgress();
    return;
}

var nextRoundBtn = document.querySelector("#next-round-btn")
function showNextRound(){
    if (level.textContent == "Level Three: Hard"){
        nextRoundBtn.innerHTML = `
        <div class="boxed btn"> see results&ensp;<i class="fa fa-arrow-right" style="font-size:10pt;"></i></div>
        `
        return
    }
    else {
        nextRoundBtn.innerHTML = `
        <div class="boxed btn"> go to next round&ensp;<i class="fa fa-arrow-right" style="font-size:10pt;"></i></div>
        `
        return
    }
}

nextRoundBtn.addEventListener("click", (e) =>{
    console.log("going to next round")
    if (level.textContent == "Level Three: Hard"){
        endGame();
        return;
    }
    nextRound();

})

// update players to reflect their current status
function updatePlayer(playerLst, activePlayer) {
    if (activePlayer[0].classList.contains("clicked")) {
        stopSound(activePlayer[1]);
        activePlayer[0].classList.remove("clicked","fa-circle-stop");
        activePlayer[0].classList.add("fa-play-circle");

        lastActiveWord = activeWord;
        
        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;

        return;
    }

    playerLst.forEach((player) => {
        if (!player[0].classList.contains("submitted") && player[0] != activePlayer[0]) {
            player[0].classList.remove("clicked", "fa-circle-stop");
            stopSound(player[1]);
        } else if (!player[0].classList.contains("submitted") && player[0] == activePlayer[0]) {
            activePlayer[0].classList.add("clicked","fa-circle-stop");
            activePlayer[1].play();
        }
    })
    return;
}

function resetPlayer(playerLst) {
    playerLst.forEach((player) => {
        player[0].style.backgroundColor = null;
        player[0].classList.remove("clicked", "fa-xmark","fa-check", "fa-circle-stop", "submitted")
        player[0].classList.add("fa-play-circle")
    })
}

// PROMPT MANAGEMENT

wordOne.addEventListener("click", (e) => {
    if (wordOne.classList.contains("submitted")) return;
    activeWord = wordLst[0];
    //activePlayer = [wordOne, wordOnePlayer];
    activePlayer = playerLst[0];
    updatePlayer(playerLst, activePlayer)
})
wordTwo.addEventListener("click", (e) => {
    if (wordTwo.classList.contains("submitted")) return;
    activeWord = wordLst[1];
    //activePlayer = [wordTwo, wordTwoPlayer];
    activePlayer = playerLst[1];
    updatePlayer(playerLst, activePlayer)
})
wordThree.addEventListener("click", (e) => {
    if (wordThree.classList.contains("submitted")) return;
    activeWord = wordLst[2];
    activePlayer = playerLst[2];
    //activePlayer = [wordThree, wordThreePlayer];
    updatePlayer(playerLst, activePlayer)
})
wordFour.addEventListener("click", (e) => {
    if (wordFour.classList.contains("submitted")) return;
    activeWord = wordLst[3];
    activePlayer = playerLst[3];
    //activePlayer = [wordFour, wordFourPlayer];
    updatePlayer(playerLst, activePlayer)
})
wordFive.addEventListener("click", (e) => {
    if (wordFive.classList.contains("submitted")) return;
    activeWord = wordLst[4];
    activePlayer = playerLst[4];
    //activePlayer = [wordFive, wordFivePlayer];
    updatePlayer(playerLst, activePlayer)
})

// LINK ONSCREEN KEYBOARD FUNCTIONALITY TO KEYPRESSS
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }

    let key = target.textContent

    if (target.classList.contains("fa-delete-left")){
        deleteLetter();
        return
        //key = "Backspace"
    }

    if (key==="submit"){
        guessPreprocess();
        return
        //key = "Enter"
    }

    let pressedKey = target.innerText;
    insertLetter(pressedKey)
    //document.querySelector(`#${pressedKey.toLowerCase()}`).classList.add("clicked")
    //document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

// KEYPRESS TYPING LISTENER
document.addEventListener("keyup", (e) => {

   let pressedKey = String(e.key)
   let found = pressedKey.match(/[a-z]/gi)

    if (e.target === attempt && pressedKey !== "Enter") return;

    if (pressedKey === "Enter") {
        document.querySelector(`#${pressedKey}`).classList.add("clicked")
        setTimeout(() => document.querySelector(`#${pressedKey}`).classList.remove("clicked"), 50);
        guessPreprocess();
        return;
    }

    if (pressedKey === "Backspace" && attemptStr.length != 0) {
        document.querySelector(`#${pressedKey}`).classList.add("clicked")
        setTimeout(() => document.querySelector(`#${pressedKey}`).classList.remove("clicked"), 50);
        deleteLetter()
        return;
    }

    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
        document.querySelector(`#${pressedKey.toLowerCase()}`).classList.add("clicked")
        setTimeout(() => document.querySelector(`#${pressedKey.toLowerCase()}`).classList.remove("clicked"), 50);
        return;
    }
})

function restoreDailyProgress() {
    const saved = SpellcheckProgress.load(DAILY_PROGRESS_KEY);
    if (!saved || saved.puzzleId !== DAILY_PUZZLE_ID || !Array.isArray(saved.wordLst)) return false;

    level.textContent = saved.levelText;
    assignSound(saved.levelPath, saved.wordLst);
    numSubmitted = saved.numSubmitted || 0;
    numWrong = saved.numWrong || 0;
    attemptStr = saved.attemptStr || '';
    results = saved.results || '';
    correctSpellingLst = saved.correctSpellingLst || [];
    submissionLst = saved.submissionLst || [];
    playerLst.forEach((player, index) => {
        const state = saved.players?.[index];
        if (!state) return;
        player[2] = state.correct || '';
        player[3] = state.submission || '';
        if (state.status === "correct") {
            player[0].classList.add("submitted", "fa-check");
            player[0].classList.remove("fa-play-circle");
            player[0].style.backgroundColor = "#79b15a";
        } else if (state.status === "incorrect") {
            player[0].classList.add("submitted", "fa-xmark");
            player[0].classList.remove("fa-play-circle");
            player[0].style.backgroundColor = "#d25842";
        }
    });
    attempt.value = attemptStr;
    if (numSubmitted >= 5) showNextRound();
    saveDailyProgress();
    return true;
}

if (!dailyAlreadyComplete && !restoreDailyProgress()) checkLevel(level)
