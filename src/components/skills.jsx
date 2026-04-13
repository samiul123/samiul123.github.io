import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillGroups } from '../constants';
import { driftUp, staggerContainer } from '../utils/motion';

const TAB_LABELS = {
  'PROGRAMMING LANGUAGES': 'Languages',
  'FRAMEWORKS & LIBRARIES': 'Frameworks',
  'DATABASE & CACHING': 'Databases',
  'TOOLS': 'Tools',
};

const SkillCard = ({ name, images, index }) => (
  <motion.div
    variants={driftUp(index * 0.05)}
    whileHover={{ y: -3 }}
    className="flex flex-col items-center gap-2 p-3 border border-[#1a1a1a] rounded-lg bg-[#0e0e0e] hover:border-[#222] transition-colors cursor-default"
  >
    {images && images.length > 0 && (
      <picture className="w-8 h-8">
        {images.filter(img => !img.fallback).map((img, i) => (
          <source key={i} type={img.type} srcSet={img.srcSet} />
        ))}
        <img
          src={(images.find(img => img.fallback) ?? images[images.length - 1])?.srcSet}
          alt={name}
          className="w-8 h-8 object-contain"
        />
      </picture>
    )}
    <span className="text-[9px] tracking-[1px] text-gray-500 text-center">{name}</span>
  </motion.div>
);

const Skills = (props) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-5xl mx-auto"
      >
        <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
          — What I Work With
        </motion.p>
        <motion.h2
          variants={driftUp(0.05)}
          className="font-lulo text-3xl lg:text-4xl font-black mb-10 text-white"
        >
          SKILLS
        </motion.h2>

        {/* Tab bar */}
        <motion.div
          variants={driftUp(0.1)}
          className="flex border-b border-[#1a1a1a] mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {skillGroups.map((group, i) => (
            <button
              key={group.title}
              onClick={() => setActiveTab(i)}
              className={`text-[9px] tracking-[2px] uppercase px-4 py-2 whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === i
                  ? 'text-custom-green border-custom-green'
                  : 'text-gray-600 border-transparent hover:text-gray-400'
              }`}
            >
              {TAB_LABELS[group.title]}
            </button>
          ))}
        </motion.div>

        {/* Active panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <motion.div
              variants={staggerContainer()}
              initial="hidden"
              animate="show"
              className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3"
            >
              {skillGroups[activeTab].items.map((item, i) => (
                <SkillCard key={item.id || item.name} name={item.name} images={item.images} index={i} />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Skills;
