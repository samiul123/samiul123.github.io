import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { driftUp, staggerContainer } from '../utils/motion';

const TimelineRow = ({ title, subtitle, date, active, isLast, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-current={active}
    className="relative w-full text-left pl-10 pb-8 last:pb-0"
  >
    {/* Vertical connecting line */}
    {!isLast && <div className="absolute left-[3px] top-2 bottom-0 w-px bg-[#1a1a1a]" />}
    {/* Dot */}
    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-custom-green ring-2 ring-custom-dark" />

    <h3 className={`text-sm font-bold tracking-wide transition-colors ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
      {title}
    </h3>
    <p className={`text-xs tracking-[2px] uppercase mt-1 transition-colors ${active ? 'text-custom-green' : 'text-gray-600'}`}>
      {subtitle}
    </p>
    <p className="text-gray-700 text-xs mt-0.5">{date}</p>
  </button>
);

const DetailPanel = ({ item }) => (
  <div>
    <h3 className="text-white font-bold text-sm tracking-wide">{item.title}</h3>
    <p className="text-custom-green text-xs tracking-[2px] uppercase mt-1">{item.subtitle}</p>
    <p className="text-gray-600 text-xs mt-1">{item.date}</p>
    {item.bulletPoints?.length > 0 && (
      <ul className="mt-3 flex flex-col gap-2">
        {item.bulletPoints.map((bullet, i) => (
          <li key={i} className="text-gray-500 text-xs leading-relaxed pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-gray-700">
            {bullet}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const ExperienceTimeline = ({ items = [], label, title, id }) => {
  const [selected, setSelected] = useState(0);
  const active = items[selected];

  return (
    <section id={id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
          — {label}
        </motion.p>
        <motion.h2 variants={driftUp(0.05)} className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white">
          {title}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
          <div role="tablist" aria-label="Select a role">
            {items.map((item, i) => (
              <TimelineRow
                key={i}
                title={item.title}
                subtitle={item.subtitle}
                date={item.date}
                active={i === selected}
                isLast={i === items.length - 1}
                onClick={() => setSelected(i)}
              />
            ))}
          </div>

          {active && (
            <div className="lg:border-l lg:border-[#1a1a1a] lg:pl-8 pt-4 lg:pt-0 border-t border-[#1a1a1a] lg:border-t-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <DetailPanel item={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default ExperienceTimeline;
