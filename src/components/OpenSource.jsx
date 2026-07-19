import { github } from '../assets';
import { styles } from '../styles';
import { contributions } from '../constants';
import { motion } from 'framer-motion';
import { driftUp, staggerContainer } from '../utils/motion';

const statusConfig = {
  merged: { label: 'Merged', className: 'text-custom-green bg-[rgba(0,214,70,0.08)] border border-[rgba(0,214,70,0.25)]' },
  open:   { label: 'Open',   className: 'text-amber-400 bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]' },
  closed: { label: 'Closed', className: 'text-gray-400 bg-[#111] border border-[#1a1a1a]' },
};

const ContributionCard = ({ repo, repoUrl, prTitle, prUrl, date, status, tags = [], description, index }) => {
  const badge = statusConfig[status] ?? statusConfig.closed;

  return (
    <motion.div
      variants={driftUp(index * 0.08)}
      className="border border-[#1a1a1a] rounded-lg p-5 hover:border-[#333] transition-colors flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.open(repoUrl, '_blank')}
          className="text-xs tracking-[3px] text-gray-400 uppercase opacity-70 hover:opacity-100 transition-opacity"
        >
          {repo}
        </button>
        <button
          onClick={() => window.open(repoUrl, '_blank')}
          className="opacity-40 hover:opacity-100 transition-opacity"
          aria-label="GitHub"
        >
          <img src={github} alt="GitHub" className="w-4 h-4 object-contain" />
        </button>
      </div>

      <button
        onClick={() => window.open(prUrl, '_blank')}
        className="text-white font-bold text-sm leading-snug text-left hover:text-custom-green transition-colors"
      >
        {prTitle} <span className="text-xs align-super">↗</span>
      </button>

      <div className="flex items-center gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full tracking-[1px] ${badge.className}`}>
          {badge.label}
        </span>
        <span className="text-gray-400 text-[10px]">{date}</span>
      </div>

      <p className="text-gray-300 text-xs leading-relaxed">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] text-gray-400 bg-[#111] border border-[#1a1a1a] px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const OpenSource = (props) => (
  <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="max-w-5xl mx-auto"
    >
      <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
        — Contributions
      </motion.p>
      <motion.h2
        variants={driftUp(0.05)}
        className={`${styles.pageTitle} mb-14`}
      >
        OPEN SOURCE
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {[...contributions]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((contribution, i) => (
            <ContributionCard key={contribution.id} {...contribution} index={i} />
          ))}
      </div>
    </motion.div>
  </section>
);
