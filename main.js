import textCollection from './textRessources.json' with {type: 'json'};
import { englishWords } from './textJS.js';

// the texts are not saved in variables which are then represented in the "view" (MVC-Pattern)
// instead the textmanipulations are made on the "live" html objects to maximize responsiveness, maybe this is unnecessary and a mistake


// IDEA::: auto-detect incorrectly written words and create a practice-file from them only containing those words

// IDEA::: add buttons to toggle special features like "tired-pinky-mode" which lowercases all characters
// IDEA::: add button to activate special character practice-mode which replaces backspace with the special characters. or maybe place it randomly in text?
// IDEA::: have a second stats-tracker that only shows stats for the last minute or so
// IDEA::: have a stop button to pause/resume the test
// IDEA::: count erroneously written words and have a dynamic list, that shows with which words one struggles most

document.addEventListener('keydown', (event) => { processKeyStroke(event) });

let validKeysRegex = /^\w|\W|ä|ö|ü|Ä|Ö|Ü| |`$/;


let exerciseText = textCollection.maxTegmark;

function giveCleanedText(text) {

    let replacementArr = [
        ["²", "2"],
        ["³", "3"],
        ["μ", "micro-"],
        ["‘", "'"],
        ["“", "\""],
        ["”", "\""],    
        ["…", "..."],
        ["~", "about "],
        ["-", "-"],
        ["«", "\""],
        ["»", "\""],
        ["  ", " "],
        ["−", "-"],
        ["€", "Euro"],
        ["\n", " "],
        ["ü", "ü"],
        
    ]

    let cleanedText = text.replaceAll("’", "'");
    cleanedText = cleanedText.replaceAll("π", "pi");
    cleanedText = cleanedText.replaceAll("≈", "=");
    cleanedText = cleanedText.replaceAll("^", "");
    cleanedText = cleanedText.replaceAll("`", "");
    cleanedText = cleanedText.replaceAll("–", "-");
    cleanedText = cleanedText.replaceAll("—", "-");
    cleanedText = cleanedText.replaceAll("ß", "ss");
    cleanedText = cleanedText.replaceAll("", "");
    cleanedText = cleanedText.replaceAll("×", "x");
    cleanedText = cleanedText.replaceAll("~", "");
    cleanedText = cleanedText.replaceAll("®", "");
    cleanedText = cleanedText.replaceAll("“", "\"");
    
    
    for (let i = 0; i < replacementArr.length; i++) {
        const element = replacementArr[i];
        cleanedText = cleanedText.replaceAll(element[0], element[1])
        // cleanedText = cleanedText.toLowerCase();
    }
    



    return cleanedText;
}

let customTextInput = document.getElementById('text-input');
let selectedInput = document.getElementById('text-select');

const lowercaseCheckbox = document.getElementById('lowercaseCheckbox');

let customInputButton = document.getElementById('useCustomInputButton').addEventListener('click', customText);
let selectInputButton = document.getElementById('useSelectedInputButton').addEventListener('click', selectText);

function customText() {
    setText(customTextInput.value);
}

function selectText() {
    let textName = selectedInput.value;
    console.log(textName);
    if (textName.substring(0, textName.length - 2) == "english") {
        console.log("asdfasdf")
        setText(englishWords[textName]);
    } else {
        setText(textCollection[selectedInput.value]);
    }
}



function setText(text) {
    // inputElement.value;
    console.log(lowercaseCheckbox.checked ? "its checked" : "its not checked")
    endTest();
    exerciseText = giveCleanedText(text);
    if (lowercaseCheckbox.checked){
        exerciseText = exerciseText.toLowerCase()
    }
    futureText.innerText = exerciseText;
    correctText.innerText = "";
    incorrectText.innerText = "";
}






let correctText = document.getElementById("correct-text");
let incorrectText = document.getElementById("incorrect-text");
let futureText = document.getElementById("future-text");
futureText.innerText = giveCleanedText(exerciseText);

let testAlive = false;

// let enterPressedbefore = false;



function processKeyStroke(event) {
    let stroke = event.key;

    if (event.keyCode == 32 && event.target == document.body) { // prevent spacebar from scrolling down the page
        event.preventDefault();
    }

    // if (stroke == "Enter") {
    //     if (!enterPressedbefore) {
    //         enterPressedbefore = true;
    //     } else if (testAlive) {
    //         endTest();
    //         enterPressedbefore = false;
    //     } else {
    //         startTest();
    //         console.log("testlive")
    //         enterPressedbefore = false;
    //     }
    // } else {
    //     enterPressedbefore = false;
    // }

    if (stroke == "Backspace" && testAlive) {
        processBackspace();
    } else if (stroke == "ç") {
        processCorrectKeyStroke(futureText.innerText.charAt(0)); // this lets you "cheat" to circumvent characters not possible with your keyboard
    } else if (stroke.length == 1 && validKeysRegex.test(stroke) && testAlive) {
        if (futureText.innerText.charAt(0) == stroke && incorrectText.innerText.length < 1) {
            processCorrectKeyStroke(stroke);
        } else {
            incorrectText.innerText = incorrectText.innerText + stroke;
        }
    }

}


function processBackspace() {
    corrections++;
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
let correctionsField = document.getElementById("correctionsfield");
let continuousStatsUpdateInterval;

let startButton = document.getElementById("start-button");
let endButton = document.getElementById("end-button");
startButton.addEventListener('click', startTest);
endButton.addEventListener('click', endTest);

let corrections = 0;

function startTest() {
    corrections = 0;
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
    correctionsField.innerText = correctText.innerText.length > 0 ? (corrections*5 / correctText.innerText.length).toFixed(2) : "-";
}

function updateTime(ms) {
    let s = parseInt((ms / 1000) % 60);
    let min = parseInt(ms / 60000)
    elapsedElement.innerText = `${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
}


function evaluateCPM(ms) {
    return parseInt((correctText.innerText.length / ms) * 60000);
}