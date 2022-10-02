const dob = document.querySelector('#birth-date');
const errorContainer = document.querySelector('#error');
const submitBtn = document.querySelector('#submit-button');
const result = document.querySelector('#result');
const outputContainer = document.querySelector('.output-container');
const monthlyDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const loader = document.querySelector('.loader');
const submitBtnText = document.querySelector('.btn-text');
submitBtn.addEventListener('click', verifyData)

function verifyData() {
  if (verifyDOB(dob.value)) {
    showProcessing()
    const finalDate = getDateObj(dob.value);
    let palindrome = checkPalindromeForAllFormats(finalDate);
    if (palindrome) {
      setTimeout(setOutput, 3000, `Yay, your birthday is palindrome 🎉`);
    }
    else {
      const nextDateMessage = renderMessageForNext(calculateNextPalindrome(finalDate));
      const previousDateMessage = renderMessageForPrevious(calculatePreviousPalindrome(finalDate));
      const notAPalindromeMessage = `Sorry, your birthday is not a palindrome 😪`;
      setTimeout(setOutput, 3000, `${notAPalindromeMessage}. 
      ${nextDateMessage}. 
      ${previousDateMessage}. `);

    }
  }
}

function renderMessageForNext(nextObj) {
  const date = dateToString(nextObj.date);
  const dateCount = nextObj.dateCount;
  return `Next Palindrome birthday is on ${date.day}-${date.month}-${date.year}, after ${dateCount === 1 ? `${dateCount} day` : `${dateCount} days`}`
}
function renderMessageForPrevious(prevObj) {
  const date = dateToString(prevObj.date);
  const dateCount = prevObj.dateCount;
  return `Previously it was on ${date.day}-${date.month}-${date.year}, before ${dateCount === 1 ? `${dateCount} day` : `${dateCount} days`}`
}

function checkPalindromeForAllFormats(finalDate) {
  const allDateFormats = checkAllDateFormats(finalDate)
  let palindromeBool = false
  for (let date of allDateFormats) {
    if (checkIfPalindrome(date)) {
      palindromeBool = true;
      break;
    }
  }
  return palindromeBool;
}

function calculateNextPalindrome(finalDate) {
  let count = 0;
  let newDate = generateNextDate(finalDate)
  while (true) {
    let isItAPalindrome = checkPalindromeForAllFormats(newDate)
    count++
    if (isItAPalindrome) {
      break;
    }
    newDate = generateNextDate(newDate);
  }
  return generateDateAndCountObject(count, newDate)
}

function calculatePreviousPalindrome(finalDate) {
  let count = 0;
  let newDate = generatePrevDate(finalDate)
  while (true) {
    let isItAPalindrome = checkPalindromeForAllFormats(newDate)
    count++
    if (isItAPalindrome) {
      break;
    }
    newDate = generatePrevDate(newDate);
  }
  return generateDateAndCountObject(count, newDate)
}

function generateDateAndCountObject(count, date) {
  return nextPalindromeObject = {
    dateCount: count,
    date: date
  }
}

function checkIfPalindrome(dateString) {
  return dateString === reverseString(dateString)
}

function generateNextDate(finalDate) {
  let { day, month, year } = { ...finalDate }
  day = day + 1;
  let currentDaysInMonth = monthlyDays[month - 1];
  // Checking for leap year
  if (currentDaysInMonth === 28) {
    if (calculateLeapYear(year)) {
      currentDaysInMonth = 29;
    }
  }
  // Cheecking for invalid date and month end
  if (day > currentDaysInMonth) {
    day = 1;
    month = month + 1;
  }
  // Checking for year end
  if (month - 1 === 12) {
    day = 1;
    month = 1;
    year = year + 1;
  }

  return nextDayObject = {
    day: day,
    month: month,
    year: year
  }
}

function generatePrevDate(finalDate) {
  let { day, month, year } = { ...finalDate };
  // For year previous
  if (day === 1 && month === 1) {
    month = 12
    day = monthlyDays[month - 1]
    year = year - 1
  }

  // Checking for leap year
  else if (day === 1 && month === 3) {
    if (calculateLeapYear(year)) {
      month = month - 1
      day = 29;
    }
    else {
      month = month - 1
      day = 28;
    }
  }

  //  For month previous
  else if (day === 1) {
    month = month - 1;
    day = monthlyDays[month - 1]
  }
  else {
    day = day - 1;
  }
  return previousDayObject = {
    day: day,
    month: month,
    year: year
  }
}

function calculateLeapYear(year) {
  let isLeap = false;
  if (year % 400 === 0) {
    isLeap = true
  }
  if (year % 100 == 0) {
    isLeap = false
  }

  if (year % 4 === 0) {
    isLeap = true
  }
  else {
    isLeap = false
  }
  return isLeap
}

function reverseString(stringData) {
  return stringData.split('').reverse().join('');
}

function checkAllDateFormats(finalDate) {
  const dateInString = dateToString(finalDate)
  const { day, month, year } = { ...dateInString }
  const ddmmyyyy = day + month + year;
  const mmddyyyy = month + day + year;
  const yyyymmdd = year + month + day;
  const ddmmyy = day + month + year.slice(-2);
  const mmddyy = month + day + year.slice(-2);
  const yymmdd = year.slice(-2) + month + day;
  return [ddmmyyyy, mmddyyyy, yyyymmdd, ddmmyy, mmddyy, yymmdd];
}

function dateToString(date) {
  const dateStringObject = { day: '', month: '', year: '' };

  date.day < 10
    ? dateStringObject.day = '0' + date.day
    : dateStringObject.day = date.day.toString();

  date.month < 10
    ? dateStringObject.month = '0' + date.month
    : dateStringObject.month = date.month.toString();
  dateStringObject.year = date.year.toString();
  return dateStringObject;
}

function getDateObj(date) {
  const dateArray = date.split('-');
  return dateObj = {
    day: +(dateArray[2]),
    month: +(dateArray[1]),
    year: +(dateArray[0])
  }
}
// For verifications
function verifyDOB(dateOfBirth) {
  if (dateOfBirth === '') {
    setError('Date of birth is necessary to Proceed. 😤');
    return false
  }
  // const today = new Date().setHours(0, 0, 0, 0);
  // const selectedDate = new Date(dateOfBirth).setHours(0, 0, 0, 0);
  // if (selectedDate > today) {
  //   setError('Date of Birth is not valid.')
  //   return false;
  // }
  hideError()
  return true;
}

function setError(errMessage) {
  errorContainer.innerText = errMessage;
  errorContainer.style.display = 'block';
  hideProcessing();
  hideOutput();
}

function hideError() {
  errorContainer.style.display = 'none'
}

function setOutput(message) {
  outputContainer.style.display = 'block'
  result.innerText = message;
  hideError()
  hideProcessing()
}

function hideOutput() {
  outputContainer.style.display = 'block'
  result.value = ''
}
function showProcessing() {
  submitBtnText.innerText = 'Processing...'
  submitBtn.setAttribute('disabled', true);
  loader.style.display = 'inline-flex'
}

function hideProcessing() {
  submitBtnText.innerText = 'Submit'
  submitBtn.removeAttribute('disabled');
  loader.style.display = 'none'
}