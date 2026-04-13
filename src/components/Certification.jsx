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
        {[...certifications]
          .sort((a, b) => new Date(b.issueDate ?? b.date) - new Date(a.issueDate ?? a.date))
          .map((cert, i) => (
          <motion.div
            key={i}
            variants={driftUp(i * 0.1)}
            whileHover={{ y: -3 }}
            className="border border-[#1a1a1a] rounded-lg p-5 hover:border-[#333] transition-colors flex flex-col gap-2"
          >
            {cert.issuerLogo && (
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={cert.issuerLogo}
                  alt={cert.issuer}
                  className="h-4 w-auto object-contain opacity-60"
                />
                <span className="text-gray-600 text-[10px] tracking-[2px] uppercase">{cert.issuer}</span>
              </div>
            )}
            <h3 className="text-white text-sm font-bold leading-snug">{cert.title}</h3>
            <p className="text-gray-600 text-xs">{cert.issueDate ?? cert.date}</p>
            <a
              href={cert.credentialUrl ?? cert.url ?? cert.link}
              target="_blank"
              rel="noreferrer"
              className="text-xs tracking-[2px] text-custom-green hover:underline mt-1"
            >
              VIEW CREDENTIAL →
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);
