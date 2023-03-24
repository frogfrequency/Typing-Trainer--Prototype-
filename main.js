document.addEventListener('keydown', (event) => {processKeyStroke(event.key)});


const mainContainer = document.getElementById("main-container");
const inputTextField = document.getElementById("exercise-text");


function processKeyStroke(stroke) {
    console.log("/" + stroke + "/");
    console.log(inputTextField.innerText)
    if (stroke == " ") { console.log("first")};
    if (stroke != "Shift")
    inputTextField.innerText = inputTextField.innerText + stroke;
    
}