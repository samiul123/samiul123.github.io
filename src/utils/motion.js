export const driftUp = (delay = 0, duration = 0.6) => ({
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'tween', ease: 'easeOut', delay, duration },
    },
});

export const fadeIn = (direction, type, delay, duration) => {
    return {
        hidden: {
            x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
            y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
            opacity: 0,
        },
        show: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
                type: type,
                delay: delay,
                duration: duration,
                ease: 'easeOut',
            },
        },
    };
};

export const slideIn = (direction, type, delay= 0, duration = 0) => {
    return {
        hidden: {
            x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
            y: direction === 'up' ? '-100%' : direction === 'down' ? '100%' : 0,
        },
        show: {
            x: 0,
            y: 0,
            transition: {
                type: type,
                delay: delay,
                duration: duration,
                ease: 'easeOut',
            },
        },
    };
};

export const vibrate = {
    hidden: { opacity: 0, y: 0 },
    show: {
        opacity: 1,
        y: [0, -3, 3, -3, 3, -3, 3, -3, 3, -3, 0],
        transition: {
            duration: 0.5,
            ease: "easeInOut"
        }
    }
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren) => {
    return {
        hidden: {},
        show: {
            transition: {
                staggerChildren: staggerChildren,
                delayChildren: delayChildren || 0,
            },
        },
    };
};
