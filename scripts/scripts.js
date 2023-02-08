const displayInput = document.querySelector('.display-input');
const visualizerInput = document.querySelector('.visualizer-input');
const cleanBtn = document.querySelector('.clean-btn');
const numBtns = document.querySelectorAll('.num-btn');
let currentValue;
let lastValue;
let penValue;
let lastOperation;
let currentOperation;
let waitingForInput = true;
let waitingForOperator = false;

const handler = function(e) {
  if (!waitingForOperator) {
    const eValue = e.target.getAttribute('value');
    if (eValue !== '0') cleanBtn.innerText = 'C';
    if (waitingForInput) {
      changeDisplay(eValue);
      if (eValue !== '0' && displayInput.value !== '0') waitingForInput = false;
    } else displayInput.value += eValue;
  }
  checkSize();
}

function checkSize(type = 'num') {
  console.log('checksize')
  console.log(numBtns[0].getAttribute('listener'))
  if (displayInput.value.length >= 9 && type === 'num') removeNumberListener();
  if (type === 'operation') addNumberListener();
}

if (displayInput.value != 0) cleanBtn.innerText = 'C';
if (displayInput.value.length < 9) addNumberListener();

window.onload = () => {
  changeDisplay('0');
  visualizerInput.value = '';
}

function addNumberListener() {
  numBtns.forEach(e => {
    e.addEventListener('click', handler);
  });
}

function removeNumberListener() {
  numBtns.forEach(e => {
    e.removeEventListener('click', handler);
  });
}

const sumBtn = document.querySelector('.sum-btn');
const subBtn = document.querySelector('.sub-btn');
const divBtn = document.querySelector('.div-btn');
const multiBtn = document.querySelector('.multi-btn');
const diffBtn = document.querySelector('.diff-btn');
const equalBtn = document.querySelector('.equal-btn');
const perBtn = document.querySelector('.per-btn');

function operators(nextOperation) {
  checkSize('operation');
  const inputValue = Number(displayInput.value);
  let newValue;
  if (currentOperation) {
    newValue = currentOperation(currentValue, inputValue);
    if (newValue !== currentValue) {
      lastValue = inputValue;
      penValue = currentValue
      currentValue = newValue;
      changeVisualizer(penValue, lastValue, currentValue, currentOperation);
      changeDisplay(currentValue)
      lastOperation = currentOperation;
      currentOperation = nextOperation;
    } else {
      currentOperation = nextOperation;
    }
  }
  if (typeof currentValue !== 'number') {
    currentValue = inputValue;
    currentOperation = nextOperation;
    changeVisualizer(displayInput.value)
    changeDisplay(currentValue, true);
    waitingForInput = true;
    waitingForOperator = false;
    return;
  }
  if (typeof currentValue === 'number' && !currentOperation) currentOperation = nextOperation;
  changeDisplay(currentValue);
  waitingForInput = true;
  waitingForOperator = false;
}

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
  changeDisplay(diff(Number(displayInput.value)));
});

cleanBtn.addEventListener('click', (e) => {
  clear(e);
});

equalBtn.addEventListener('click', () => {
  if (typeof currentValue === 'number') {
    checkSize('operation');
    const inputValue = Number(displayInput.value);
    newValue = currentOperation(currentValue, inputValue)
    displayInput.value = currentValue;
    changeVisualizer(currentValue, inputValue, newValue, currentOperation);
    changeDisplay(newValue)
  }
});

perBtn.addEventListener('click', () => {
  checkSize('operation');
  const inputValue = Number(displayInput.value)
  let newValue;
  if (typeof currentValue !== 'number') {
    newValue = per(inputValue);
    changeVisualizer(inputValue, 0, newValue, per)
    changeDisplay(newValue);
  }
  if (typeof currentValue === 'number') {
    currentValue = currentOperation(currentValue, inputValue);
    newValue = per(currentValue);
    lastValue = null;
    currentOperation = null;
    changeVisualizer(currentValue, inputValue, newValue, currentOperation);
    changeDisplay(newValue)
  }
  waitingForInput = true;
  currentValue = null
  lastValue = null;
  currentOperation = null;
  waitingForOperator = true;
});

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
  return num1 / num2;
}

function per(num = 0) {
  return num / 100;
}

function diff(num = 0) {
  return -num;
}

function clear(e) {
  checkSize('operation');
  visualizerInput.value = '';
  changeDisplay('0');
  currentValue = null
  lastValue = null;
  currentOperation = null;
  e.target.innerText = 'AC';
  waitingForInput = true;
  waitingForOperator = false;
}

function changeDisplay(num, ifChoice = false) {
  if (ifChoice) displayInput.value = num
  else displayInput.value = toFixedNine(num);
}

function changeVisualizer(pen = 0, num2 = 0, num1 = 0, type = sum) {
  // const toFixed = toFixedNine(pen, num1, num2);
  if (typeof pen === 'string') {
    visualizerInput.value = pen;
    return;
  }
  if ((type === sum || type === sub) && num2 === 0) return;
  switch (type) {
    case sum: {
      visualizerInput.value = `${pen} + ${num2} = ${num1}`;
      break;
    }
    case sub: {
      visualizerInput.value = `${pen} - ${num2} = ${num1}`;
      break;
    }
    case div: {
      visualizerInput.value = `${pen} / ${num2} = ${num1}`;
      break;
    }
    case multi: {
      visualizerInput.value = `${pen} x ${num2} = ${num1}`;
      break;
    }
    case per: {
      visualizerInput.value = `${pen}% = ${num1}`;
      break;
    }
  }
}

function round () {
  
}
