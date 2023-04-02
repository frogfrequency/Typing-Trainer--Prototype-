import textCollection from './textRessources.json' assert {type: 'json'};
// the texts are not saved in variables which are then represented in the "view" (MVC-Pattern)
// instead the textmanipulations are made on the "live" html objects to maximize responsiveness, maybe this is unnecessary and a mistake


document.addEventListener('keydown', (event) => { processKeyStroke(event) });

let validKeysRegex = /^\w|\W|ä|ö|ü|Ä|Ö|Ü| |`$/;


let exerciseText = textCollection.texts[0];

function giveCleanedText(text) {
    let cleanedText = text.replaceAll("’", "'");
    cleanedText = cleanedText.replaceAll("π", "pi");
    cleanedText = cleanedText.replaceAll("≈", "=");
    cleanedText = cleanedText.replaceAll("^", "");
    cleanedText = cleanedText.replaceAll("`", "");
    cleanedText = cleanedText.replaceAll("–", "-");
    cleanedText = cleanedText.replaceAll("ß", "ss");

    return cleanedText;
}

let inputElement = document.getElementById('text-input');

let inputButton = document.getElementById('useThisInputButton').addEventListener('click', setText);


function setText() {
    // inputElement.value;
    endTest();
    exerciseText = giveCleanedText(inputElement.value);
    futureText.innerText = exerciseText;
    correctText.innerText = "";
    incorrectText.innerText = "";
}






let correctText = document.getElementById("correct-text");
let incorrectText = document.getElementById("incorrect-text");
let futureText = document.getElementById("future-text");
futureText.innerText = giveCleanedText(exerciseText);

let testAlive = false;





function processKeyStroke(event) {
    let stroke = event.key;

    if (event.keyCode == 32 && event.target == document.body) { // prevent spacebar from scrolling down the page
        event.preventDefault();
    }

    if (stroke == "Enter") {
        if (testAlive) {
            endTest();
        } else {
            startTest();
        }
    }

    if (stroke == "Backspace" && testAlive) {
        processBackspace();
    } else if (stroke.length < 2 && 0 < stroke.length && validKeysRegex.test(stroke) && testAlive) {
        if (futureText.innerText.charAt(0) == stroke && incorrectText.innerText.length < 1) {
            processCorrectKeyStroke(stroke);
        } else {
            incorrectText.innerText = incorrectText.innerText + stroke;
        }
    }

}


function processBackspace() {

    if (0 < incorrectText.innerText.length) {
        incorrectText.innerText = incorrectText.innerText.slice(0, -1);
    } else if (0 < correctText.innerText.length) {
        futureText.innerText = correctText.innerText.charAt(correctText.innerText.length - 1) + futureText.innerText;
        correctText.innerText = correctText.innerText.slice(0, -1);
    }


}

function processCorrectKeyStroke(stroke) {
    correctText.innerText = correctText.innerText + stroke;
    futureText.innerText = futureText.innerText.substring(1);
}




// timerelated stuff:


let startDate = Date.now();
let elapsedElement = document.getElementById("timefield");
let cpmField = document.getElementById("cpmfield");
let continuousStatsUpdateInterval;
let startButton = document.getElementById("start-button");
let endButton = document.getElementById("end-button");

function startTest() {
    continuousStatsUpdateInterval = setInterval(() => updateStats(), 1000);
    startDate = Date.now();
    startButton.style.display = "none";
    endButton.style.display = "block";
    futureText.innerText = giveCleanedText(exerciseText);
    correctText.innerText = "";
    incorrectText.innerText = "";
    testAlive = true;

}

function endTest() {
    clearInterval(continuousStatsUpdateInterval);
    endButton.style.display = "none";
    startButton.style.display = "block";
    testAlive = false;
}


function updateStats() {
    let elapsedTime = Date.now() - startDate;
    updateTime(elapsedTime);
    let cpm = evaluateCPM(elapsedTime);
    cpmField.innerText = `${cpm} ≈ ${parseInt(cpm / 5)} wpm`;
}

function updateTime(ms) {
    let s = parseInt((ms / 1000) % 60);
    let min = parseInt(ms / 60000)
    elapsedElement.innerText = `${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
}


function evaluateCPM(ms) {
    return parseInt((correctText.innerText.length / ms) * 60000);
}