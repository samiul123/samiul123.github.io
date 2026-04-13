import { useState } from 'react';
import { motion } from 'framer-motion';
import { publications } from '../constants';
import { driftUp, staggerContainer } from '../utils/motion';

export const Publication = (props) => {
  const [showAbstract, setShowAbstract] = useState(null);

  return (
    <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
          — Research
        </motion.p>
        <motion.h2
          variants={driftUp(0.05)}
          className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white uppercase"
        >
          PUBLICATIONS
        </motion.h2>
        <div className="flex flex-col">
          {[...publications].sort((a, b) => new Date(b.date) - new Date(a.date)).map((pub, i) => (
            <motion.div
              key={i}
              variants={driftUp(i * 0.1)}
              className="py-8 border-b border-[#181818] last:border-b-0"
            >
              {showAbstract === i ? (
                <div>
                  <p className="text-xs tracking-[3px] text-custom-green uppercase mb-4">Abstract</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{pub.abstract}</p>
                  <button
                    onClick={() => setShowAbstract(null)}
                    className="mt-6 text-xs tracking-[2px] text-gray-600 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-6">
                  <div>
                    <a
                      href={pub.url ?? pub.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-white hover:text-custom-green transition-colors text-sm leading-snug"
                    >
                      {pub.title}
                    </a>
                    <p className="text-custom-green text-xs tracking-[1px] mt-3">{pub.conference ?? pub.venue}</p>
                    <p className="text-gray-600 text-xs mt-1">{pub.date}</p>
                  </div>
                  {pub.abstract && (
                    <button
                      onClick={() => setShowAbstract(i)}
                      className="flex-shrink-0 text-gray-600 hover:text-white text-xs tracking-[2px] transition-colors whitespace-nowrap"
                    >
                      ABSTRACT →
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
