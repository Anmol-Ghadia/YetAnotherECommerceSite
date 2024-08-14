type Integer = number & { __integer__: void };

function toInteger(value: number): Integer {
  if (!Number.isInteger(value)) {
    throw new Error(`${value} is not an integer.`);
  }
  return value as Integer;
}

export { Integer, toInteger };
