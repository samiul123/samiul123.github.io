// Smoke test: verifies the config file can be required without throwing.
// Tailwind colour tokens are validated by the build; this just guards against syntax errors.
test('tailwind config loads without error', () => {
  expect(() => require('../../../tailwind.config.js')).not.toThrow();
});
