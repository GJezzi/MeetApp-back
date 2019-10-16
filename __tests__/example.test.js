function soma(a, b) {
  return a + b;
}

test('should return 4 from soma function adding 5 and 4', () => {
  const result = soma(4, 5);

  expect(result).toBe(9);
});
