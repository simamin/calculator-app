let result = 0;
let firstNumber = 0;
let secondNumber = 0;
let currentOperator;
let lastBtnPressed;

let memory = [];

const display = document.querySelector('.display');
const workingDisplay = document.querySelector('.working');

const buttons = document.querySelectorAll('button');

function clearAll(){
    display.textContent = '0';
    workingDisplay.textContent = '';
    memory = [];
    firstNumber = 0;
    return
}

function deleteDigit(){
    let deletedDisplay = display.textContent.slice(0, display.textContent.length - 1);
    display.textContent = deletedDisplay;
    firstNumber = display.textContent;
    secondNumber = display.textContent;
    if (display.textContent === ''){
        display.textContent = '0';
    }
}

function populateDisplay() {

    toggleAnimation(this);

    if (this.classList.contains('clearBtn')) {
        clearAll();
    }

    if (this.classList.contains('backBtn') && display.textContent.includes('=') === false) {
        deleteDigit();
    }
    else if (this.classList.contains('numberBtn')) {
        if (lastBtnPressed === 'operatorBtn' || lastBtnPressed === 'resultBtn') {
            display.textContent = '0';
        }
        if (display.textContent === '0' && this.textContent !== '.' || display.textContent.includes('=') === true) {
            display.textContent = `${this.textContent}`;
        }
        else {
            if (this.textContent === '.' && display.textContent.includes('.') === false) {
                display.textContent += '.';
            }
            else if (display.textContent.length <= 11 && this.textContent !== '.') {
                display.textContent += this.textContent;
            }
        }
        firstNumber = display.textContent;
        secondNumber = display.textContent;
    }
    else if (this.classList.contains('operatorBtn')) {
        if (lastBtnPressed === 'operatorBtn') {
            return
        }
        memory.push(firstNumber);
        currentOperator = `${this.dataset.action}`;
        memory.push(currentOperator);
        if (currentOperator === '%') {
            lastBtnPressed === 'percentageBtn';
            firstNumber = percentage(firstNumber);
            memory.push(firstNumber);
            display.textContent = `${firstNumber}`;
            return;
        }
    }
    else if (this.classList.contains('resultBtn')) {
        if (lastBtnPressed === 'resultBtn') {
            return
        }
        memory.push(secondNumber);
        memory.splice(-0, memory.length - 3);

        for (let i = 0; i < memory.length; i++) {
            if (memory[i][memory[i].length - 1] === '.') {
                let trimmedString = memory[i].replace('.', '');
                memory[i] = trimmedString; // removes decimal if it is the last character in either number
            }
        }

        if (memory[1] === 'x' || memory[1] === '÷' || memory[1] === '+' || memory[1] === '-') {
            result = operate(memory[0], memory[1], memory[2]);
            if (isNaN(result) && result !== '🤨') {
                result = 'Error';
            }
            display.textContent = `= ${result}`;
            firstNumber = `${result}`;
            workingDisplay.textContent = memory.join(' ')
        }
    }
    memory.splice(-0, memory.length - 3);
    lastBtnPressed = this.className;

}

function add(a, b) {
    return parseFloat(a) + parseFloat(b);
} 

function subtract(a, b) {
    return a - b;
} 

function multiply(a, b) {
    return a * b;
} 

function divide(a, b) {
    return a / b;
} 

function percentage(a) {
    return a / 100;
}

function operate(firstNumber, operator, secondNumber) {

    if (operator === '+') {
        return add(firstNumber, secondNumber);
    } if (operator === '-') {
        return subtract(firstNumber, secondNumber);
    } if (operator === 'x') {
        return multiply(firstNumber, secondNumber);
    } if (operator === '÷') {
        if (secondNumber === '0') {
            return '🤨';
        } return divide(firstNumber, secondNumber);
    }
}

function toggleAnimation(button){

    let activeClass = 'activeBtn';

    if (button.classList.contains('backBtn')){
        activeClass = 'activeBackBtn';
    }

    button.classList.add(activeClass);

    // Set a timeout to remove the class after the specified duration
    setTimeout(function () {
        button.classList.remove(activeClass);
    }, 120);
}

const getButton = function getButton(e){

    let keyPressed = e.key;

    if (keyPressed === '*'){
        keyPressed = 'x';
    } 
    if (keyPressed === '/'){
        keyPressed = '÷';
    }
    if (keyPressed === 'Enter'){
        keyPressed = '=';
    }

    const buttonPressed = document.querySelector(`[data-key="${keyPressed}"]`);
    return buttonPressed;
}

buttons.forEach((button) => button.addEventListener('click', populateDisplay));
window.addEventListener('keydown', function(e){
    const button = getButton(e);
    if (button){
        populateDisplay.call(button);
    }
});