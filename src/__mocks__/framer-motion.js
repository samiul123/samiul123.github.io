const React = require('react');

// Lightweight framer-motion mock for tests.
// motion.* components render as plain HTML elements.
// AnimatePresence renders children immediately without exit animations.

const motion = new Proxy(
  {},
  {
    get: (_, tag) =>
      // eslint-disable-next-line react/display-name
      React.forwardRef(({ children, ...props }, ref) => {
        // Strip framer-specific props so React doesn't warn about unknown DOM attrs
        const {
          initial, animate, exit, variants, transition, whileHover, whileTap,
          whileFocus, whileInView, viewport, layout, layoutId,
          onAnimationStart, onAnimationComplete, ...domProps
        } = props;
        return React.createElement(tag, { ...domProps, ref }, children);
      }),
  }
);

const AnimatePresence = ({ children }) => React.createElement(React.Fragment, null, children);

const useAnimation = () => ({ start: () => {}, stop: () => {} });
const useMotionValue = (initial) => ({ get: () => initial, set: () => {} });
const useTransform = (_val, _from, _to) => ({ get: () => 0 });
const useSpring = (val) => val;
const useScroll = () => ({ scrollY: { get: () => 0 } });

module.exports = {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
};
