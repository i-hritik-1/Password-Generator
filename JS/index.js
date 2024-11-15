const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#number");
const symbolcheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input [type = checkbox]")


let password = "";
let passwordLength = 10;
let checkCount = 1;
const symbols = '~`!@#$%^&*()_-+=[]{}:;"|.>,<?/';


handleSlider();
calculateStrength();
setIndicator("#ccc")


// Set Password Length
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = ` 0px 0px 12px 1px ${color} `
}


// Math.random range - 0 to 1;
function getRndInteger(min,max)
{
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateRanLower()
{
    return String.fromCharCode(getRndInteger(97,123));
}

function generateRanUpper()
{
    return String.fromCharCode(getRndInteger(65,91));
}

function generatesymbol()
{
    const strlen = symbols.length;
    const rndlen = getRndInteger(0,strlen);
    return symbols.charAt(rndlen);

}


// Password strength check section
function calculateStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNUm = false;
    let hasSym = false;

    if(uppercasecheck.checked) hasUpper = true;
    if(lowercasecheck.checked) hasLower = true;
    if(numbercheck.checked) hasNUm = true;
    if(symbolcheck.checked) hasSym = true;
    

    if(hasLower && hasUpper && (hasNUm || hasSym) && passwordLength >= 8)
    {
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNUm || hasSym) && passwordLength >= 6)
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }
}


// Copy Clipboard Section
async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e)
    {
        copyMsg.innerText = "failed"
    }

    // To make copy span visible.
    copyMsg.classList.add("active");

    // Remove the span tag
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}


inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
    {
        copyContent();
    }
})



function shufflePassword(array)
{
    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((ele) => {
        str += ele;
    })

    return str;
}

function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        {
            checkCount++;
        }
    });

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// Generate Password
generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if(checkCount <= 0)
    {
        return;
    }

    // Passswordlength chota hai checkcount se to
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // New password
    // remove old password
    password = "";

    let funArr = [];

    if(uppercasecheck.checked)
    {
        funArr.push(generateRanUpper);
    }

    if(lowercasecheck.checked)
    {
        funArr.push(generateRanLower);
    }

    if(numbercheck.checked)
    {
        funArr.push(generateRandomNumber);
    }

    if(symbolcheck.checked)
    {
        funArr.push(generatesymbol);
    }

    // Compulsary
    for(let i =0; i< funArr.length; i++)
    {
        password += funArr[i]();
    }

    // Remaining length
    for(let i = 0; i < (passwordLength - funArr.length); i++)
    {
        let ranidx = getRndInteger(0,funArr.length);
        password += funArr[ranidx]();

    }


    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Display The password
    passwordDisplay.value = password;

    // Strength Check
    calculateStrength();

})

// kya baat hai