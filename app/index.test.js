const test = require("node:test");
const assert = require("node:assert/strict");
const { Calculator } = require("./calculator");

// Test suite for Calculator
test("Calculator - Addition", () => {
  const calc = new Calculator();
  assert.equal(calc.add(2, 3), 5, "2 + 3 should equal 5");
  assert.equal(calc.add(-2, -3), -5, "-2 + -3 should equal -5");
  assert.equal(calc.add(0, 0), 0, "0 + 0 should equal 0");
  assert.equal(calc.add(10.5, 5.5), 16, "10.5 + 5.5 should equal 16");
});

test("Calculator - Subtraction", () => {
  const calc = new Calculator();
  assert.equal(calc.subtract(10, 3), 7, "10 - 3 should equal 7");
  assert.equal(calc.subtract(3, 10), -7, "3 - 10 should equal -7");
  assert.equal(calc.subtract(0, 0), 0, "0 - 0 should equal 0");
  assert.equal(calc.subtract(15.5, 5.5), 10, "15.5 - 5.5 should equal 10");
});

test("Calculator - Multiplication", () => {
  const calc = new Calculator();
  assert.equal(calc.multiply(3, 4), 12, "3 * 4 should equal 12");
  assert.equal(calc.multiply(-2, 3), -6, "-2 * 3 should equal -6");
  assert.equal(calc.multiply(0, 100), 0, "0 * 100 should equal 0");
  assert.equal(calc.multiply(2.5, 4), 10, "2.5 * 4 should equal 10");
});

test("Calculator - Division", () => {
  const calc = new Calculator();
  assert.equal(calc.divide(10, 2), 5, "10 / 2 should equal 5");
  assert.equal(calc.divide(7, 2), 3.5, "7 / 2 should equal 3.5");
  assert.equal(calc.divide(-10, 2), -5, "-10 / 2 should equal -5");
  assert.equal(calc.divide(0, 5), 0, "0 / 5 should equal 0");
});

test("Calculator - Division by zero", () => {
  const calc = new Calculator();
  assert.throws(() => {
    calc.divide(10, 0);
  }, /Cannot divide by zero/);
});

test("Calculator - Edge cases", () => {
  const calc = new Calculator();
  assert.equal(calc.add(Number.MAX_SAFE_INTEGER, 0), Number.MAX_SAFE_INTEGER);
  assert.equal(calc.multiply(1, 1), 1);
  assert.equal(calc.subtract(5, 5), 0);
});
