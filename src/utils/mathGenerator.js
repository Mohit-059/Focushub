export function generateMathQuestion(config) {
  const { operation, digitMode, operandsCount, allowNegatives, requireExactDivision } = config;

  // Generates a valid number, strictly respecting digit length. No leading zeros.
  const getNum = () => {
    let len = digitMode === 'Random' ? Math.floor(Math.random() * 4) + 1 : parseInt(digitMode, 10);
    if (len === 1) return Math.floor(Math.random() * 9) + 1; // 1-9
    const min = Math.pow(10, len - 1);
    const max = Math.pow(10, len) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  let operands = Array.from({ length: operandsCount }, getNum);
  let activeOp = operation;
  
  if (operation === 'Mixed') {
    const ops = ['+', '-', '*', '/'];
    activeOp = ops[Math.floor(Math.random() * ops.length)];
  }

  // Cap operands at 2 for multiplication/division to prevent absurd mental math
  if ((activeOp === '*' || activeOp === '/') && operands.length > 2) {
    operands = [getNum(), getNum()];
  }

  let expected;
  let expression;

  switch (activeOp) {
    case '+':
      expected = operands.reduce((a, b) => a + b, 0);
      expression = operands.join(' + ');
      break;
    case '-':
      if (!allowNegatives) {
        operands.sort((a, b) => b - a); // Largest first guarantees positive result
      }
      expected = operands.reduce((acc, val, i) => i === 0 ? acc : acc - val, operands[0]);
      expression = operands.join(' − ');
      break;
    case '*':
      expected = operands[0] * operands[1];
      expression = `${operands[0]} × ${operands[1]}`;
      break;
    case '/':
      if (requireExactDivision) {
        // Reverse-engineer the division to guarantee integer quotient
        const divisor = operands[1] === 0 ? 1 : operands[1]; 
        const quotient = operands[0];
        const dividend = quotient * divisor;
        expected = quotient;
        expression = `${dividend} ÷ ${divisor}`;
      } else {
        const divisor = operands[1] === 0 ? 1 : operands[1];
        const dividend = operands[0];
        expected = Math.floor(dividend / divisor);
        expression = `${dividend} ÷ ${divisor} (Quotient)`;
      }
      break;
    default:
      expected = 0;
      expression = 'Error';
  }

  return { 
    id: crypto.randomUUID(), 
    expression, 
    expected: expected.toString(), 
    operator: activeOp, 
    operands 
  };
}