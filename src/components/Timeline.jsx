import { motion } from 'framer-motion';
import { driftUp, staggerContainer } from '../utils/motion';

const TimelineItem = ({ title, subtitle, meta, date, images, index }) => (
  <motion.div
    variants={driftUp(index * 0.12)}
    className="relative pl-10 pb-12 last:pb-0"
  >
    {/* Vertical connecting line */}
    <div className="absolute left-[3px] top-2 bottom-0 w-px bg-[#1a1a1a]" />
    {/* Dot */}
    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-custom-green ring-2 ring-custom-dark" />

    <div className="flex items-start gap-4">
      {images && (
        <picture className="w-8 h-8 flex-shrink-0 mt-0.5">
          {images.map((img, i) => (
            <source key={i} type={img.type} srcSet={img.srcSet} />
          ))}
          <img
            src={(images.find(img => img.fallback) || images[images.length - 1]).srcSet}
            alt={subtitle}
            className="w-8 h-8 object-contain opacity-70"
          />
        </picture>
      )}
      <div>
        <h3 className="text-white font-bold text-sm tracking-wide">{title}</h3>
        <p className="text-custom-green text-xs tracking-[2px] uppercase mt-1">{subtitle}</p>
        <p className="text-gray-600 text-xs mt-1">{date}</p>
        {meta && <p className="text-gray-500 text-xs mt-0.5">{meta}</p>}
      </div>
    </div>
  </motion.div>
);

const Timeline = ({ items = [], label, title, id }) => (
  <section id={id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-3xl mx-auto"
    >
      <motion.p
        variants={driftUp(0)}
        className="text-xs tracking-[4px] text-custom-green uppercase mb-3"
      >
        — {label}
      </motion.p>
      <motion.h2
        variants={driftUp(0.05)}
        className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white"
      >
        {title}
      </motion.h2>
      <div className="relative">
        {items.map((item, i) => (
          <TimelineItem key={i} {...item} index={i} />
        ))}
      </div>
    </motion.div>
  </section>
);

export default Timeline;
