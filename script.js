const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
let historyBtn = document.querySelector(".history-btn");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");



// Slider value and HTMl slider value matching fucntion

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

//set indicator color 
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


//function to get random Number
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//function to generate Random Numbers
function generateRandomNumber() {
    return getRandomNumber(0,9);
}

//to generate into lowercase
function generateLowerCase() {  
    return String.fromCharCode(getRandomNumber(97,123))
}

//to generate into upper case
function generateUpperCase() {  
    return String.fromCharCode(getRandomNumber(65,91))
}

//to get the Symbol from string of symbols
function generateSymbol() {
    const randNum = getRandomNumber(0, symbols.length);
    return symbols.charAt(randNum);
}
//check the password Strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}


async function copyContent() {
  try {
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "copied";
  }
  catch(e) {
      copyMsg.innerText = "Failed";
  }
  //to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout( () => {
      copyMsg.classList.remove("active");
  },2000);

}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
      //random J, find out using random function
      const j = Math.floor(Math.random() * (i + 1));
      //swap number at i index and j index
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach( (checkbox) => {
      if(checkbox.checked)
          checkCount++;
  });

  //special condition
  if(passwordLength < checkCount ) {
      passwordLength = checkCount;
      handleSlider();
  }
}

allCheckBox.forEach( (checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
})


copyBtn.addEventListener('click', () => {
  if(passwordDisplay.value)
      copyContent();
})

function storePasswords(password){
  let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
  passwords.push(password);
  localStorage.setItem('passwords', JSON.stringify(passwords));
}

generateBtn.addEventListener('click', () => {
  //none of the checkbox are selected
  if(checkCount == 0) 
      return;

  if(passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
  }

  password = "";
  let funcArr = [];

  if(uppercaseCheck.checked)
      funcArr.push(generateUpperCase);

  if(lowercaseCheck.checked)
      funcArr.push(generateLowerCase);

  if(numbersCheck.checked)
      funcArr.push(generateRandomNumber);

  if(symbolsCheck.checked)
      funcArr.push(generateSymbol);

  // compulsory addition
  for(let i=0; i<funcArr.length; i++) {
      password += funcArr[i]();
  }

  // remaining addition
  for(let i=0; i<passwordLength-funcArr.length; i++) {
      let randIndex = getRandomNumber(0 , funcArr.length);
      password += funcArr[randIndex]();
  }

  // shuffle the password
  password = shufflePassword(Array.from(password));

  // show in UI
  passwordDisplay.value = password;

  // store password in local storage
  storePasswords(password);

  // calculate strength
  calcStrength();

  // Display passwords if history is open
  if (document.getElementById('passwordList').style.display === "block") {
      displayPasswords();
  }
});

// Function to clear the password history
function clearPasswords() {
  localStorage.removeItem('passwords');  // Remove passwords from localStorage
  const passwordList = document.getElementById('passwordList');
  passwordList.innerHTML = '';  // Clear the password list in the UI
}

function togglePassword(){
  const passwordList = document.getElementById('passwordList');
  if (passwordList.style.display === "none" || passwordList.style.display === ""){
      displayPasswords();
      passwordList.style.display = "block";
  } else {
      passwordList.style.display = "none";
  }
}


function displayPasswords(){
  let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
  const passwordList = document.getElementById('passwordList');
  passwordList.innerHTML = '';
  passwords.forEach(pass => {
    if(pass){
      const li = document.createElement('li');
      li.textContent = pass;
      passwordList.appendChild(li);
    } else{
      console.error("encountered error");
    }
   
  });
}

function togglePassword(){
  const passwordList = document.getElementById('passwordList');
  if( passwordList.style.display === "none" || passwordList.style.display === ""){
    displayPasswords();
    passwordList.style.display = "block";
    passwordList.value = password;

  } else{
    passwordList.style.display = "none";
  }
}



