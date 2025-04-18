import express from "express";
const app = express();

const PORT = 3000;
const WINDOW_SIZE = 10;

let numberStore = [];

function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }

  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }

  let avg = sum / numbers.length;
  return Math.round(avg * 100) / 100;
}

function generatePrimes(count) {
  if (!count) count = 10;
  let primes = [];
  let num = 2;

  while (primes.length < count) {
    let isPrime = true;

    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }

    if (isPrime) {
      primes.push(num);
    }

    num++;
  }

  return primes;
}

function generateFibonacci(count) {
  if (!count) count = 10;
  let fib = [0, 1];

  while (fib.length < count + 1) {
    let next = fib[fib.length - 1] + fib[fib.length - 2];
    fib.push(next);
  }

  let result = [];
  for (let j = 1; j < fib.length; j++) {
    result.push(fib[j]);
  }

  return result;
}

function generateEven(count) {
  if (!count) count = 10;
  let evens = [];
  let num = 2;

  while (evens.length < count) {
    evens.push(num);
    num = num + 2;
  }

  return evens;
}

function generateRandom(count) {
  if (!count) count = 10;
  let randoms = [];

  while (randoms.length < count) {
    let rand = Math.floor(Math.random() * 100) + 1;
    randoms.push(rand);
  }

  return randoms;
}

app.get("/numbers/:numberid", function (req, res) {
  let numberid = req.params.numberid;

  let generatedNumbers = [];
  let windowPrevState = numberStore.slice();

  if (numberid === "p") {
    generatedNumbers = generatePrimes();
  } else if (numberid === "f") {
    generatedNumbers = generateFibonacci();
  } else if (numberid === "e") {
    generatedNumbers = generateEven();
  } else if (numberid === "r") {
    generatedNumbers = generateRandom();
  } else {
    res.status(400).json({ error: "invalid number type." });
    return;
  }

  for (let i = 0; i < generatedNumbers.length; i++) {
    let num = generatedNumbers[i];
    let exists = false;

    for (let j = 0; j < numberStore.length; j++) {
      if (numberStore[j] === num) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      if (numberStore.length >= WINDOW_SIZE) {
        numberStore.shift();
      }

      numberStore.push(num);
    }
  }

  let response = {
    windowPrevState: windowPrevState,
    windowCurrState: numberStore.slice(),
    numbers: generatedNumbers,
    avg: calculateAverage(numberStore),
  };

  res.json(response);
});

app.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
