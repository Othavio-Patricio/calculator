const displayInput = document.querySelector('.display-input');
const visualizerInput = document.querySelector('.visualizer-input')
const cleanBtn = document.querySelector('.clean-btn')
let currentValue;
let lastValue;
let penValue;
let lastOperation;
let currentOperation;

if (displayInput.value != 0) cleanBtn.innerText = 'C';

window.onload = () => {
  displayInput.value = '0';
  visualizerInput.value = '';
}

document.querySelectorAll('.num-btn').forEach(e => {
  e.addEventListener('click', () => {
    const eValue = e.getAttribute('value');
    if (eValue !== '0') cleanBtn.innerText = 'C';
    if (displayInput.value === '0') displayInput.value = eValue;
    else displayInput.value += eValue;
  });
});

const sumBtn = document.querySelector('.sum-btn');
const subBtn = document.querySelector('.sub-btn');
const divBtn = document.querySelector('.div-btn');
const multiBtn = document.querySelector('.multi-btn');
const diffBtn = document.querySelector('.diff-btn');
const equalBtn = document.querySelector('.equal-btn');

function operators(nextOperation) {
  const inputValue = Number(displayInput.value);
  let newValue;
  if (currentOperation) {
    newValue = currentOperation(currentValue, inputValue);
    if (newValue !== currentValue) {
      lastValue = inputValue;
      penValue = currentValue
      currentValue = newValue;
      changeVisualizer(penValue, lastValue, currentValue, currentOperation)
      lastOperation = currentOperation;
      currentOperation = nextOperation;
      displayInput.value = '0';
    } else {
      currentOperation = nextOperation;
    }
  }
  if (typeof currentValue !== 'number') {
    currentValue = inputValue;
    currentOperation = nextOperation;
    changeVisualizer(displayInput.value)
    displayInput.value = '0';
  }
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
  displayInput.value = diff(Number(displayInput.value));
});

cleanBtn.addEventListener('click', (e) => {
  clear(e);
});

equalBtn.addEventListener('click', () => {
  if (typeof currentValue === 'number') {
    const inputValue = Number(displayInput.value);
    newValue = currentOperation(currentValue, inputValue)
    displayInput.value = currentValue;
    changeVisualizer(currentValue, inputValue, newValue, currentOperation);
  }
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
  visualizerInput.value = '';
  displayInput.value = '0';
  currentValue = null
  lastValue = null;
  currentOperation = null;
  e.target.innerText = 'AC';
}

function changeVisualizer(pen = 0, num2 = 0, num1 = 0, type = sum) {
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
  }
}
