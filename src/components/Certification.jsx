import { motion } from 'framer-motion';
import { certifications } from '../constants';
import { driftUp, staggerContainer } from '../utils/motion';

export const Certification = (props) => (
  <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="max-w-5xl mx-auto"
    >
      <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
        — Credentials
      </motion.p>
      <motion.h2
        variants={driftUp(0.05)}
        className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white uppercase"
      >
        CERTIFICATIONS
      </motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, i) => (
          <motion.div
            key={i}
            variants={driftUp(i * 0.1)}
            whileHover={{ y: -3 }}
            className="border border-[#1a1a1a] rounded-lg p-5 hover:border-[#333] transition-colors"
          >
            <h3 className="text-white text-sm font-bold leading-snug mb-2">{cert.title}</h3>
            <p className="text-gray-600 text-xs mb-4">{cert.issueDate ?? cert.date}</p>
            <a
              href={cert.credentialUrl ?? cert.url ?? cert.link}
              target="_blank"
              rel="noreferrer"
              className="text-xs tracking-[2px] text-custom-green hover:underline"
            >
              VIEW CREDENTIAL →
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);
