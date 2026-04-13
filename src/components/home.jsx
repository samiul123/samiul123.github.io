import { motion } from 'framer-motion';
import { samiul, samiulWebp, download } from '../assets';
import { driftUp, staggerContainer } from '../utils/motion';

const Home = (props) => (
  <section id={props.id} className="min-h-screen bg-custom-dark flex items-center px-6 lg:px-20 pt-32 pb-20">
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      animate="show"
      className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center"
    >
      {/* Left column */}
      <div className="flex flex-col gap-6">
        <motion.p
          variants={driftUp(0.1)}
          className="text-xs tracking-[4px] text-custom-green uppercase"
        >
          — Software Engineer
        </motion.p>
        <motion.h1
          variants={driftUp(0.2)}
          className="font-lulo text-5xl lg:text-7xl font-black leading-none text-white"
        >
          SAMIUL<br />MUSHFIK<span className="text-custom-green">.</span>
        </motion.h1>
        <motion.p
          variants={driftUp(0.3)}
          className="text-sm text-gray-500 leading-relaxed max-w-md"
        >
          4+ years building scalable microservices, distributed systems, and production backends — alongside
          user-facing web and mobile interfaces. Graduated with an M.S. in Computer Science (August 2025)
          from the University of Minnesota Duluth, with research in SIMD-optimized in-memory bulk R-Tree
          construction. Interested in databases, distributed systems, machine learning, and the interfaces
          that bring them together.
        </motion.p>
        <motion.div variants={driftUp(0.4)} className="flex flex-wrap gap-4 mt-2">
          <a
            href="#projects"
            className="bg-custom-green text-black text-xs font-bold tracking-[2px] px-6 py-3 rounded hover:opacity-90 transition-opacity"
          >
            VIEW WORK
          </a>
          <a
            href="#contact"
            className="border border-[#1a1a1a] text-gray-500 text-xs tracking-[2px] px-6 py-3 rounded hover:border-[#333] hover:text-gray-300 transition-colors"
          >
            CONTACT
          </a>
          <button
            onClick={() => window.open('/resume.html')}
            className="flex items-center gap-2 border border-[#1a1a1a] text-gray-500 text-xs tracking-[2px] px-6 py-3 rounded hover:border-custom-green hover:text-custom-green transition-colors"
          >
            RESUME
            <img src={download} alt="download" className="w-3 h-3 object-contain opacity-60" />
          </button>
        </motion.div>
      </div>

      {/* Right column: photo — hidden on mobile */}
      <motion.div variants={driftUp(0.3)} className="hidden lg:flex justify-center">
        <div className="w-72 h-72 rounded-full border-[1.5px] border-custom-green overflow-hidden">
          <picture className="w-full h-full">
            <source type="image/webp" srcSet={samiulWebp} />
            <img
              src={samiul}
              alt="Samiul Mushfik"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default Home;
