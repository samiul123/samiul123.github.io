import { driftUp, staggerContainer } from '../../utils/motion';

test('driftUp returns hidden state with y:20 and opacity:0', () => {
  const variant = driftUp();
  expect(variant.hidden.opacity).toBe(0);
  expect(variant.hidden.y).toBe(20);
});

test('driftUp show state has correct delay', () => {
  const variant = driftUp(0.3);
  expect(variant.show.transition.delay).toBe(0.3);
});

test('staggerContainer works with no arguments', () => {
  const result = staggerContainer();
  expect(result.show.transition.staggerChildren).toBe(0.1);
});

test('staggerContainer accepts custom stagger value', () => {
  const result = staggerContainer(0.2);
  expect(result.show.transition.staggerChildren).toBe(0.2);
});
