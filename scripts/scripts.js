const displayInput = document.querySelector('.display-input');
const visualizerInput = document.querySelector('.visualizer-input');
const cleanBtn = document.querySelector('.clean-btn');
const numBtns = document.querySelectorAll('.num-btn');
const allBtn = document.querySelectorAll('button');
const sumBtn = document.querySelector('.sum-btn');
const subBtn = document.querySelector('.sub-btn');
const divBtn = document.querySelector('.div-btn');
const multiBtn = document.querySelector('.multi-btn');
const diffBtn = document.querySelector('.diff-btn');
const equalBtn = document.querySelector('.equal-btn');
const perBtn = document.querySelector('.per-btn');

let currentValue;
let lastValue;
let penValue;
let lastOperation;
let currentOperation;
let waitingForInput = true;
let waitingForOperator = false;
let hasDot = false;

const handler = function(e) {
  if (e.target.getAttribute('value') === '.' && hasDot) {
    return;
  }
  if (!waitingForOperator) { // blocks number interaction if true
    const eValue = e.target.getAttribute('value');
    if (eValue !== '0') cleanBtn.innerText = 'C';
    if (waitingForInput) {
      if (e.target.getAttribute('value') === '.') changeDisplay('0.')
      else changeDisplay(eValue);
      if (currentValue) changeVisualizer(currentValue.toString());
      if (eValue !== '0' && displayInput.value !== '0') waitingForInput = false;
    } else displayInput.value += eValue;
    if (e.target.getAttribute('value') === '.') {
      hasDot = true;
    }
  }
  checkSize();
}

window.onload = () => {
  cleanBtn.innerText = 'AC'
  if (displayInput.value.length < 11) addNumberListener();
  changeDisplay('0');
  preventStart();
  visualizerInput.value = '';
}

function preventStart() {
  allBtn.forEach(e => {
    e.addEventListener('click', (evt) => {
      evt.preventDefault();
    })
  });
}

function checkSize(type = 'num') {
  if (displayInput.value.length >= 11 && type === 'num') removeNumberListener();
  if (type === 'operation') addNumberListener();
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

function operators(nextOperation) {
  checkSize('operation');
  const inputValue = Number(displayInput.value);
  let newValue;
  if (currentOperation && !waitingForInput) {
    newValue = currentOperation(currentValue, inputValue);
    if (newValue !== currentValue) {
      lastValue = inputValue;
      penValue = currentValue
      currentValue = newValue;
      changeVisualizer(penValue, lastValue, currentOperation);
      changeDisplay(currentValue)
      lastOperation = currentOperation;
      currentOperation = nextOperation;
    }
  } else {
    currentOperation = nextOperation;
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
  hasDot = false;
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
  if (!waitingForInput) changeDisplay(diff(Number(displayInput.value)));
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
    changeVisualizer(currentValue, inputValue, currentOperation);
    changeDisplay(newValue)
    hasDot = false;
  }
});

perBtn.addEventListener('click', () => {
  checkSize('operation');
  const inputValue = Number(displayInput.value)
  let newValue;
  if (typeof currentValue !== 'number') { //first Operation
    newValue = per(inputValue);
    changeVisualizer(inputValue, 0, per)
    changeDisplay(newValue);
  }
  if (typeof currentValue === 'number') { // every Other operation
    currentValue = currentOperation(currentValue, inputValue);
    newValue = per(currentValue);
    lastValue = null;
    currentOperation = null;
    changeVisualizer(currentValue, inputValue, currentOperation);
    changeDisplay(newValue)
  }
  waitingForInput = true;
  currentValue = null
  lastValue = null;
  currentOperation = null;
  waitingForOperator = true;
  hasDot = false;
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
  hasDot = false;
}

function changeDisplay(num, ifChoice = false) {
  if (num > 99999999999) displayInput.value = 'NaN';
  else if (num.toString().length > 11) displayInput.value = toFixedEleven(num)[0];
  else displayInput.value = num
}

function changeVisualizer(pen = 0, num1 = 0, type = sum) {
  const toFixed = toFixedEleven(pen, num1);
  if (typeof pen === 'string') {
    visualizerInput.value = toFixed[0];
    return;
  }
  if ((type === sum || type === sub) && toFixed[1] === 0) return;
  switch (type) {
    case sum: {
      visualizerInput.value = `${toFixed[0]} + ${toFixed[1]} =`;
      break;
    }
    case sub: {
      visualizerInput.value = `${toFixed[0]} - ${toFixed[1]} =`;
      break;
    }
    case div: {
      visualizerInput.value = `${toFixed[0]} / ${toFixed[1]} =`;
      break;
    }
    case multi: {
      visualizerInput.value = `${toFixed[0]} x ${toFixed[1]} =`;
      break;
    }
    case per: {
      visualizerInput.value = `${toFixed[0]}% =`;
      break;
    }
  }
}

function toFixedEleven(...args) {
  console.log(args);
  return args.map(num => {
    if (num.toString().length > 11) {
      let number;
      if (typeof num !== 'number') number = Number(num);
      else number = num;
      if (number.toString().split('.')[0].length === 10) return parseInt(number)
      return number.toString().slice(0, 11);
    }
    return num;
  })
}

window.addEventListener('keydown', (e) => {
  if (displayInput.value != 0) cleanBtn.innerText = 'C';
  let key;
  if (e.key === ',') key = document.querySelector(`button[data-key='.']`);
  else key = document.querySelector(`button[data-key='${e.key}']`);
  if (key) key.click();
});
