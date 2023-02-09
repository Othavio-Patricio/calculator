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
const numBtns = document.querySelectorAll('.num-btn');
const allBtn = document.querySelectorAll('button');

let currentValue;
let lastValue;
let penValue;
let currentOperation;
let waitingForInput = true;
let waitingForOperator = false;
let hasDot = false;
let toClear = false;

window.onload = () => {
  cleanBtn.innerText = 'AC'
  addNumberListener();
  changeDisplay('0');
  preventDefaultStart();
  visualizerInput.value = '';
}

window.addEventListener('keydown', (e) => {
  if (displayInput.value != 0) cleanBtn.innerText = 'C';
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
  if (toClear) clear()
  if (!waitingForInput && displayInput.value.length < 11) changeDisplay(diff(Number(displayInput.value)));
});

cleanBtn.addEventListener('click', (e) => {
  clear();
});

equalBtn.addEventListener('click', () => {
  if (toClear&& typeof currentValue !== 'number') {
    const inputValue = Number(displayInput.value);
    newValue = currentOperation(inputValue, penValue)
    changeVisualizer(inputValue, penValue, currentOperation);
    changeDisplay(newValue);
  }
  if (typeof currentValue === 'number' && !toClear) { // checks if is not 1º use
    checkSize('operation');
    const inputValue = Number(displayInput.value);
    newValue = currentOperation(currentValue, inputValue)
    if (newValue === 'lmao') {
      lmaoHandler();
      return;
    }
    changeDisplay(newValue);
    if (displayInput.value === 'too big') return;
    changeVisualizer(currentValue, inputValue, currentOperation);
    displayInput.value = currentValue;
    currentValue = null;
    penValue = inputValue;
    toClear = true;
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
    if (currentValue === 'lmao') {
      lmaoHandler();
      return;
    }
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
  hasDot = false;
  multiBtn.click();
  if (toClear) clear()
});

function addNumberListener() {
  numBtns.forEach(e => {
    e.addEventListener('click', (btn) => {
      if (toClear) clear();
      if (btn.target.getAttribute('value') === '.' && hasDot) return;
      if (!waitingForOperator) { // blocks number interaction if true
        const btnValue = btn.target.getAttribute('value');
        if (btnValue !== '0') cleanBtn.innerText = 'C';
        if (waitingForInput) { // asks if the last button pressed is a operator
          firstNumberHandler(btnValue);
          if (btnValue !== '0' && displayInput.value !== '0') waitingForInput = false;
        } else displayInput.value += btnValue;
        if (btnValue === '.') {
          hasDot = true;
        }
      }
      if (currentValue) changeVisualizer(currentValue.toString());
      checkSize();
    });
  });
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

function operators(nextOperation) {
  if (toClear) clear()
  checkSize('operation');
  const inputValue = Number(displayInput.value);
  let newValue;
  if (currentOperation && !waitingForInput) {
    newValue = currentOperation(currentValue, inputValue);
    if (newValue === 'lmao') {
      lmaoHandler();
      return;
    }
    if (newValue !== currentValue) {
      lastValue = inputValue;
      penValue = currentValue
      currentValue = newValue;
      changeVisualizer(penValue, lastValue, currentOperation);
      currentOperation = nextOperation;
    }
  } else {
    currentOperation = nextOperation;
  }
  if (typeof currentValue === 'number' && !currentOperation) currentOperation = nextOperation;
  if (typeof currentValue !== 'number') {
    currentValue = inputValue;
    currentOperation = nextOperation;
    changeVisualizer(displayInput.value)
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

function clear() {
  checkSize('operation');
  cleanBtn.innerText = 'AC';
  visualizerInput.value = '';
  changeDisplay('0');
  changeVisualizer('');
  currentValue = null
  lastValue = null;
  currentOperation = null;
  waitingForInput = true;
  waitingForOperator = false;
  hasDot = false;
  toClear = false;
  penValue = null;
}

function changeDisplay(num) {
  const MAX_VALUE = 99999999999;
  if (num > MAX_VALUE) {
    displayInput.value = 'too big';
    changeVisualizer('┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻')
    toClear = true;
  }
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
