// Smoke test: verifies the config file can be imported without throwing.
// Tailwind colour tokens are validated by the build; this just guards against syntax errors.
test('tailwind config loads without error', async () => {
  await expect(import('../../../tailwind.config.js')).resolves.toBeDefined();
});
