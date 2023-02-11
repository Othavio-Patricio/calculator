const displayInput = document.querySelector('.display-input');
const visualizerInput = document.querySelector('.visualizer-input');
const cleanBtn = document.querySelector('.clean-btn');
const sumBtn = document.querySelector('.sum-btn');
const subBtn = document.querySelector('.sub-btn');
const divBtn = document.querySelector('.div-btn');
const multiBtn = document.querySelector('.multi-btn');
const diffBtn = document.querySelector('.diff-btn');
const equalBtn = document.querySelector('.equal-btn');
const perBtn = document.querySelector('.per-btn');
const backBtn = document.querySelector('.back-btn');
const numBtns = document.querySelectorAll('.num-btn');
const allBtn = document.querySelectorAll('button');

let currentValue;
let currentOperation;
let waitingForInput = true;
let waitingForOperator = false;
let hasDot = false;
let toClear = false;
let equalPressed = false;
let fixedValue;

window.onload = () => {
  changeClearButton();
  addNumberListener();
  changeDisplay('0');
  preventDefaultStart();
  changeVisualizer('');
}

window.addEventListener('keydown', (e) => {
  if (displayInput.value != 0) changeClearButton('C');
  let key;
  if (e.key === ',') key = document.querySelector(`button[data-key='.']`);
  else key = document.querySelector(`button[data-key='${e.key}']`);
  if (key) key.click();
});

sumBtn.addEventListener('click', () => {
  operators(sum);
});

subBtn.addEventListener('click', () => {
  operators(sub);
});

divBtn.addEventListener('click', () => {
  operators(div);
});

multiBtn.addEventListener('click', () => {
  operators(multi);
});

diffBtn.addEventListener('click', () => {
  if (toClear) clear();
  if (!waitingForInput && displayInput.value.length < 11) {
    const inputValue = Number(displayInput.value);
    const newValue = diff(inputValue);
    changeDisplay(newValue);
  }
  if (waitingForInput && displayInput.value.length < 11) {
    const inputValue = Number(displayInput.value);
    const newValue = diff(inputValue);
    changeDisplay(newValue);
    currentValue = newValue;
    sumBtn.click();
  }
});

cleanBtn.addEventListener('click', (e) => {
  clear();
});

equalBtn.addEventListener('click', () => {
  if (toClear) {
    clear();
    return;
  }
  if (equalPressed) {
    const inputValue = Number(displayInput.value);
    newValue = currentOperation(inputValue, fixedValue)
    changeVisualizer(inputValue, fixedValue, currentOperation);
    changeDisplay(newValue);
    currentValue = newValue;
    return;
  }
  if (typeof currentValue === 'number' && !toClear) { // checks if is not 1º use and if not used before operator
    checkSize('operation');
    const inputValue = Number(displayInput.value);
    newValue = currentOperation(currentValue, inputValue)
    if (newValue === 'lmao') {
      lmaoHandler();
      return;
    }
    changeDisplay(newValue);
    if (displayInput.value.includes('too')) return;
    changeVisualizer(currentValue, inputValue, currentOperation);
    currentValue = newValue;
    fixedValue = inputValue;
    equalPressed = true;
    waitingForInput = true;
  }
});

perBtn.addEventListener('click', () => {
  checkSize('operation');
  const inputValue = Number(displayInput.value)
  let newValue;
  if (typeof currentValue !== 'number' || (typeof currentValue === 'number' && waitingForInput)) { //first Operation
    newValue = per(inputValue);
    changeVisualizer(inputValue, 0, per)
  }
  else { // every Other operation
    if (!equalPressed) currentValue = currentOperation(currentValue, inputValue);
    if (currentValue === 'lmao') {
      lmaoHandler();
      return;
    }
    newValue = per(currentValue);
    changeVisualizer(currentValue, 0, per);
  }
  if (equalPressed) equalPressed = false
  changeDisplay(newValue);
  waitingForInput = true;
  currentOperation = null;
  hasDot = false;
  currentValue = newValue;
  multiBtn.click();
  if (toClear) clear()
});

backBtn.addEventListener('click', () => {
  if (toClear) {
    clear();
    return;
  }
  if (displayInput.value !== '0' && displayInput.value && !waitingForInput && !equalPressed) {  
    newValue = displayInput.value.slice(0, displayInput.value.length - 1);
    if (!currentOperation && !newValue) changeClearButton(); // checks if it is the first operation since last clear
    if (!newValue) {
      changeDisplay('0')
      waitingForInput = true;
    }
    else changeDisplay(displayInput.value.slice(0, displayInput.value.length - 1));
  }
  if (equalPressed) clear();
});

function addNumberListener() {
  numBtns.forEach(e => {
    e.addEventListener('click', (btn) => {
      if (toClear || equalPressed) clear();
      if (btn.target.getAttribute('value') === '.' && hasDot) return;
      if (!waitingForOperator) {
        const btnValue = btn.target.getAttribute('value');
        numbersAllowed(btnValue);
      }
      if (currentValue) changeVisualizer(currentValue.toString(), 0, currentOperation);
      checkSize();
    });
  });
}

function numbersAllowed(btnValue) {
  if (btnValue !== '0') changeClearButton('C');
  if (waitingForInput) firstNumberHandler(btnValue);
  else displayInput.value += btnValue;
  if (btnValue === '.') hasDot = true;
}

function firstNumberHandler(btnValue) {
  if (btnValue === '.') changeDisplay('0.')
  else changeDisplay(btnValue);
  if (btnValue !== '0' && displayInput.value !== '0') waitingForInput = false;
};

function preventDefaultStart() {
  allBtn.forEach(e => {
    e.addEventListener('click', (evt) => {
      evt.preventDefault();
    })
  });
}

function checkSize(type = 'num') {
  if (displayInput.value.length >= 11 && type === 'num') waitingForOperator = true;
}

function clear() {
  checkSize('operation');
  changeClearButton();
  changeDisplay('0');
  changeVisualizer('');
  currentValue = null
  currentOperation = null;
  waitingForInput = true;
  waitingForOperator = false;
  hasDot = false;
  toClear = false;
  equalPressed = false;
  fixedValue = null
}

function operators(nextOperation) {
  if (toClear) {
    clear();
    return;
  }
  if (equalPressed) {
    equalPressed = false;
    currentOperation = nextOperation;
    waitingForInput = true;
    waitingForOperator = false;
    hasDot = false;
    return;
  }

  const inputValue = Number(displayInput.value);
  if (currentOperation && !waitingForInput) { // checks if is the first time we click in an operator this time but is not our first operation
    let newValue;
    newValue = currentOperation(currentValue, inputValue);
    if (newValue === 'lmao') {
      lmaoHandler();
      return;
    }
    if (newValue !== currentValue) {
      changeVisualizer(currentValue, inputValue, currentOperation);
      currentValue = newValue;
      currentOperation = nextOperation;
    }
  } else {
    currentOperation = nextOperation;
  }

  if (typeof currentValue === 'number' && !currentOperation) currentOperation = nextOperation; // checks if it is the first operation since last clear
  if (typeof currentValue !== 'number') {
    currentValue = inputValue;
    currentOperation = nextOperation;
    changeVisualizer(displayInput.value, 0, nextOperation)
  }
  changeDisplay(currentValue);
  waitingForInput = true;
  waitingForOperator = false;
  hasDot = false;
}

function sum(num1 = 0, num2 = num1) {
  return num1 + num2;
}

function sub(num1 = 0, num2 = num1) {
  return num1 - num2;
}

function multi(num1 = 0, num2 = 0) {
  return num1 * num2;
}

function div(num1 = 0, num2 = 1) {
  if (num2 === 0) {
    return 'lmao';
  }
  return num1 / num2;
}

function lmaoHandler() {
  toClear = true;
  changeDisplay('lmao');
  changeVisualizer('¯\\_(ツ)_/¯')
}

function per(num = 0) {
  return num / 100;
}

function diff(num = 0) {
  return -num;
}

function changeClearButton(type = 'AC') {
  if (type === 'C') cleanBtn.innerText = 'C';
  else cleanBtn.innerText = 'AC';
}

function changeDisplay(num) {
  const MAX_VALUE = 99999999999;
  const MIN_VALUE = -9999999999;
  if (num > MAX_VALUE) {
    displayInput.value = 'too big';
    changeVisualizer('┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻')
    toClear = true;
  }
  else if (num < MIN_VALUE) {
    displayInput.value = 'too small';
    changeVisualizer(' ┐(´⌒｀)┌')
    toClear = true;
  }
  else if (num.toString().length > 11) displayInput.value = toFixedEleven(num)[0];
  else displayInput.value = num
}

function changeVisualizer(pen = 0, num1 = 0, type = null) {
  const toFixed = toFixedEleven(pen, num1);
  if (typeof pen === 'string' && !type) {
    visualizerInput.value = toFixed[0];
    return;
  }
  if (typeof pen === 'string' && type) {
    switch (type) {
      case sum: 
        visualizerInput.value = `${toFixed[0]} +`;
        break;
      case sub: 
        visualizerInput.value = `${toFixed[0]} -`;
        break;
      case div: 
        visualizerInput.value = `${toFixed[0]} /`;
        break;
      case multi: 
        visualizerInput.value = `${toFixed[0]} x`;
        break;
    }
    return;
  }
  if ((type === sum || type === sub) && toFixed[1] === 0) return;
  switch (type) {
    case sum: 
      visualizerInput.value = `${toFixed[0]} + ${toFixed[1]} =`;
      break;
    case sub: 
      visualizerInput.value = `${toFixed[0]} - ${toFixed[1]} =`;
      break;
    case div: 
      visualizerInput.value = `${toFixed[0]} / ${toFixed[1]} =`;
      break;
    case multi: 
      visualizerInput.value = `${toFixed[0]} x ${toFixed[1]} =`;
      break;
    case per: 
      visualizerInput.value = `${toFixed[0]}% =`;
      break;
  }
}

function equalsCondition(pen, num1, toFixed) {
  if (pen === toFixed[0] && num1 === toFixed[1]) return '=';
  return '≃';
}

function toFixedEleven(...args) {
  return args.map(num => {
    if (num.toString().length > 11) {
      let number;
      if (typeof num !== 'number') number = Number(num);
      else number = num;
      if (!number) return num;
      if (number.toString().split('.')[0].length === 10) return parseInt(number)
      return number.toString().slice(0, 11);
    }
    return num;
  })
}
