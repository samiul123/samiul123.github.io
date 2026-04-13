import { github } from '../assets';
import { styles } from '../styles';
import { projects } from '../constants';
import { motion } from 'framer-motion';
import { driftUp, staggerContainer } from '../utils/motion';

/*
 * Previous layout: fan/accordion (cards expand on click).
 * Preserved below in comments for reference.
 * Hybrid idea: show 3 featured cards in fan mode, rest in a grid below.
 *
 * Fan layout code kept in git history (commit before masonry switch).
 */

const statusConfig = {
  live:     { label: 'Live',        className: 'text-custom-green bg-[rgba(0,214,70,0.08)] border border-[rgba(0,214,70,0.25)]' },
  wip:      { label: 'In Progress', className: 'text-amber-400 bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]' },
  archived: { label: 'Archived',    className: 'text-gray-600 bg-[#111] border border-[#1a1a1a]' },
};

const ProjectCard = ({ title, type, year, status, skills = [], description, githubUrl, demoUrl, index }) => {
  const badge = statusConfig[status] ?? statusConfig.archived;

  return (
    <motion.div
      variants={driftUp(index * 0.08)}
      className="border border-[#1a1a1a] rounded-lg p-5 hover:border-[#333] transition-colors flex flex-col gap-3"
    >
      {/* Type eyebrow + icons */}
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-[3px] text-gray-600 uppercase">{type}</span>
        <div className="flex gap-2">
          {githubUrl && (
            <button
              onClick={() => window.open(githubUrl, '_blank')}
              className="opacity-40 hover:opacity-100 transition-opacity"
              aria-label="GitHub"
            >
              <img src={github} alt="GitHub" className="w-4 h-4 object-contain" />
            </button>
          )}
          {demoUrl && (
            <button
              onClick={() => window.open(demoUrl, '_blank')}
              className="text-gray-600 hover:text-custom-green transition-colors text-xs tracking-[2px]"
              aria-label="Demo"
            >
              ↗
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-sm leading-snug">{title}</h3>

      {/* Status + year */}
      <div className="flex items-center gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full tracking-[1px] ${badge.className}`}>
          {badge.label}
        </span>
        <span className="text-gray-700 text-[10px]">{year}</span>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-xs leading-relaxed">{description}</p>

      {/* Skill tags */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {skills.map(skill => (
            <span key={skill} className="text-[10px] text-gray-600 bg-[#111] border border-[#1a1a1a] px-2 py-0.5 rounded">
              {skill}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const Project = (props) => (
  <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="max-w-5xl mx-auto"
    >
      <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
        — Work
      </motion.p>
      <motion.h2
        variants={driftUp(0.05)}
        className={`${styles.pageTitle} mb-14`}
      >
        PROJECTS
      </motion.h2>

      {/* Masonry grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {[...projects]
          .sort((a, b) => parseInt(b.year) - parseInt(a.year))
          .map((project, i) => (
            <ProjectCard key={project.id} {...project} index={i} />
          ))}
      </div>
    </motion.div>
  </section>
);
