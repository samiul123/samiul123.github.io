import { motion } from 'framer-motion';
import { skillGroups } from '../constants';
import { driftUp, staggerContainer } from '../utils/motion';

const SkillCard = ({ name, images, index }) => (
  <motion.div
    variants={driftUp(index * 0.05)}
    whileHover={{ y: -3 }}
    className="flex flex-col items-center gap-2 p-3 border border-[#1a1a1a] rounded-lg bg-[#0e0e0e] hover:border-[#333] transition-colors cursor-default"
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

const SkillCategory = ({ title, items }) => (
  <motion.div
    variants={staggerContainer()}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    className="mb-14"
  >
    <motion.p variants={driftUp(0)} className="text-xs tracking-[3px] text-custom-green uppercase mb-5">
      — {title}
    </motion.p>
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {items.map((item, i) => (
        <SkillCard key={item.id || item.name} name={item.name} images={item.images} index={i} />
      ))}
    </div>
  </motion.div>
);

const Skills = (props) => (
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
        className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white"
      >
        SKILLS
      </motion.h2>
      {(skillGroups || []).map(group => (
        <SkillCategory key={group.title} title={group.title} items={group.items} />
      ))}
    </motion.div>
  </section>
);

export default Skills;
