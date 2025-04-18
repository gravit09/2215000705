import express from "express";
const app = express();

const PORT = 3000;
const WINDOW_SIZE = 10;

let numberStore = [];

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / numbers.length).toFixed(2));
};

const generatePrimes = (count = 10) => {
  const primes = [];
  let num = 2;
  while (primes.length < count) {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(num);
    num++;
  }
  return primes;
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
