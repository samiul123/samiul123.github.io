import { motion } from 'framer-motion';
import { experiences } from '../constants';
import { download } from '../assets';
import Timeline from './Timeline';
import { driftUp } from '../utils/motion';

export const Experience = (props) => {
  const items = experiences.map(exp => ({
    title: exp.title,
    subtitle: exp.company,
    date: exp.date,
    images: exp.images,
  }));

  return (
    <div id={props.id}>
      <Timeline items={items} label="Career" title="EXPERIENCE" />
      <div className="bg-custom-dark pb-16 px-6 lg:px-20 flex justify-center">
        <motion.button
          variants={driftUp(0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          onClick={() => window.open('/resume.html')}
          className="flex items-center gap-3 border border-[#1a1a1a] text-gray-400 text-xs tracking-[2px] px-6 py-3 rounded hover:border-custom-green hover:text-custom-green transition-colors"
        >
          MY RESUME
          <img src={download} alt="download" className="w-4 h-4 object-contain opacity-60" />
        </motion.button>
      </div>
    </div>
  );
};
