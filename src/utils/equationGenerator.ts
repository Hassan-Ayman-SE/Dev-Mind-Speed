import { evaluate } from 'mathjs';

interface EquationResult {
  equation: string;
  answer: number;
}

 //generate random number within a given range
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//generate equation based on ----> (difficulty level)
export function generateEquation(difficulty: number): EquationResult {
  let operandCount: number;
  let digitLength: number;

  switch (difficulty) {
    case 1:
      operandCount = 2;
      digitLength = 1;
      break;
    case 2:
      operandCount = 3;
      digitLength = 2;
      break;
    case 3:
      operandCount = 4;
      digitLength = 3;
      break;
    case 4:
      operandCount = 5;
      digitLength = 4;
      break;
    default:
      throw new Error("Invalid difficulty level");
  }

  const min = Math.pow(10, digitLength - 1);
  const max = Math.pow(10, digitLength) - 1;

  const operands = Array.from({ length: operandCount }, () =>
    getRandomNumber(min, max)
  );
  const operators = Array.from(
    { length: operandCount - 1 },
    () => ["+", "-", "*", "/"][Math.floor(Math.random() * 4)]
  );

  //for example on equation: "33 + 49 - 10 / 2"
  const equation = operands
    .map((num, i) => (i < operators.length ? `${num} ${operators[i]} ` : num))
    .join("");

  try {
    const answer = evaluate(equation);
    if (!isFinite(answer)) throw new Error("Invalid result");
    return { equation, answer };
  } catch {
    return generateEquation(difficulty);
  }
}
