import { useEffect, useCallback, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMinus, FiPlus, FiDownload } from 'react-icons/fi';
import {
  resumeHeader,
  resumeSkills,
  resumeExperience,
  resumeResearch,
  resumeProjects,
  resumeEducation,
  resumeCertifications,
} from '../constants/resume';

const MIN_WIDTH = 320;
const MAX_WIDTH_RATIO = 0.85;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

const SectionTitle = ({ children }) => (
  <h3 className="text-[10px] tracking-[3px] uppercase font-bold text-custom-green border-b border-[#00d64622] pb-1 mb-3">
    {children}
  </h3>
);

const Divider = () => <div className="border-t border-[#1a1a1a] my-4" />;

const ResumeDrawer = ({ isOpen, onClose }) => {
  const [width, setWidth] = useState(() => Math.round(window.innerWidth * 0.38));
  const [zoom, setZoom] = useState(1.0);
  const isDragging = useRef(false);

  const zoomIn = useCallback(() => setZoom(z => Math.min(+(z + ZOOM_STEP).toFixed(1), MAX_ZOOM)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(+(z - ZOOM_STEP).toFixed(1), MIN_ZOOM)), []);

  const handleEscape = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.min(Math.max(newWidth, MIN_WIDTH), Math.round(window.innerWidth * MAX_WIDTH_RATIO)));
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const onResizeStart = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.72)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Resume"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-custom-dark border-l border-[#1a1a1a]"
            style={{ width }}
          >
            {/* Resize handle */}
            <div
              onMouseDown={onResizeStart}
              className="absolute top-0 left-0 bottom-0 w-[6px] z-10 cursor-col-resize group"
            >
              {/* Green accent line — brightens on hover/drag */}
              <div
                className="absolute top-0 left-0 bottom-0 w-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(to bottom, #00d646, transparent)' }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 px-4 border-b border-[#1a1a1a] flex-shrink-0" style={{ height: 48 }}>
              <span className="text-[9px] tracking-[3px] uppercase text-[#aaa] font-semibold">RESUME</span>

              {/* Zoom controls */}
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label="Zoom out"
                  className="flex items-center justify-center w-[22px] h-[22px] border border-[#1a1a1a] rounded-[3px] text-[#555] hover:text-white hover:border-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiMinus size={10} />
                </button>
                <span className="text-[9px] text-[#555] w-[34px] text-center select-none tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label="Zoom in"
                  className="flex items-center justify-center w-[22px] h-[22px] border border-[#1a1a1a] rounded-[3px] text-[#555] hover:text-white hover:border-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiPlus size={10} />
                </button>
              </div>

              {/* Download PDF */}
              <a
                href="/Samiul_Mushfik_Resume.pdf"
                download
                aria-label="Download resume PDF"
                className="flex items-center justify-center w-[22px] h-[22px] border border-[#1a1a1a] rounded-[3px] text-[#555] hover:text-custom-green hover:border-custom-green transition-colors"
              >
                <FiDownload size={11} />
              </a>

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close resume"
                className="flex items-center justify-center w-[22px] h-[22px] border border-[#1a1a1a] rounded-[3px] text-[#555] text-[13px] hover:text-white hover:border-[#333] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 text-[#888]" style={{ zoom }}>

              {/* ── Name & Contact ── */}
              <div className="mb-4">
                <h1 className="text-base font-bold tracking-[2px] text-white uppercase">{resumeHeader.name}</h1>
                <p className="text-[10px] tracking-[1px] mt-1 leading-relaxed">
                  {resumeHeader.phone}
                  {' · '}
                  <a href={resumeHeader.linkedin.url} className="hover:text-custom-green transition-colors" target="_blank" rel="noreferrer">
                    {resumeHeader.linkedin.label}
                  </a>
                  {' · '}
                  <a href={resumeHeader.email.url} className="hover:text-custom-green transition-colors">
                    {resumeHeader.email.label}
                  </a>
                  {' · '}
                  <a href={resumeHeader.github.url} className="hover:text-custom-green transition-colors" target="_blank" rel="noreferrer">
                    {resumeHeader.github.label}
                  </a>
                  {' · '}
                  {resumeHeader.location}
                </p>
                <p className="text-[10px] tracking-[1px] mt-0.5">{resumeHeader.tagline}</p>
              </div>

              <Divider />

              {/* ── Technical Skills ── */}
              <section>
                <SectionTitle>Technical Skills</SectionTitle>
                <dl className="flex flex-col gap-1.5">
                  {resumeSkills.map((row) => (
                    <div key={row.label} className="flex gap-2 text-[10px] leading-relaxed">
                      <dt className="font-semibold text-[#ccc] whitespace-nowrap">{row.label}:</dt>
                      <dd>{row.items}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <Divider />

              {/* ── Professional Experience ── */}
              <section>
                <SectionTitle>Professional Experience</SectionTitle>
                <div className="flex flex-col gap-4">
                  {resumeExperience.map((exp) => (
                    <div key={exp.company}>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[11px] font-bold text-[#eee]">{exp.company}</span>
                        <span className="text-[9px] tracking-[1px] whitespace-nowrap">{exp.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[10px] text-[#ccc]">
                          {exp.title}{exp.subtitle ? ` · ${exp.subtitle}` : ''}
                        </span>
                        <span className="text-[9px] tracking-[1px] whitespace-nowrap">{exp.date}</span>
                      </div>
                      <ul className="mt-1.5 flex flex-col gap-1 pl-3">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="text-[10px] leading-relaxed list-disc list-outside ml-1">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <Divider />

              {/* ── Research Experience ── */}
              <section>
                <SectionTitle>Research Experience</SectionTitle>
                <div className="flex flex-col gap-4">
                  {resumeResearch.map((r) => (
                    <div key={r.institution}>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[11px] font-bold text-[#eee]">{r.institution}</span>
                        <span className="text-[9px] tracking-[1px] whitespace-nowrap">{r.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[10px] text-[#ccc]">{r.title}</span>
                        <span className="text-[9px] tracking-[1px] whitespace-nowrap">{r.date}</span>
                      </div>
                      <ul className="mt-1.5 flex flex-col gap-1 pl-3">
                        {r.bullets.map((b, i) => (
                          <li key={i} className="text-[10px] leading-relaxed list-disc list-outside ml-1">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <Divider />

              {/* ── Projects ── */}
              <section>
                <SectionTitle>Projects</SectionTitle>
                <div className="flex flex-col gap-4">
                  {resumeProjects.map((p) => (
                    <div key={p.name}>
                      <div className="flex justify-between items-baseline gap-2">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-[#eee] hover:text-custom-green transition-colors"
                        >
                          {p.name}
                        </a>
                        <span className="text-[9px] tracking-[1px] whitespace-nowrap">{p.date}</span>
                      </div>
                      <ul className="mt-1.5 flex flex-col gap-1 pl-3">
                        {p.bullets.map((b, i) => (
                          <li key={i} className="text-[10px] leading-relaxed list-disc list-outside ml-1">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <Divider />

              {/* ── Education ── */}
              <section>
                <SectionTitle>Education</SectionTitle>
                <div className="flex flex-col gap-3">
                  {resumeEducation.map((ed) => (
                    <div key={ed.institution}>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[11px] font-bold text-[#eee]">{ed.institution}</span>
                        {ed.location && <span className="text-[9px] tracking-[1px] whitespace-nowrap">{ed.location}</span>}
                      </div>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[10px] text-[#ccc]">{ed.degree}</span>
                        {ed.date && <span className="text-[9px] tracking-[1px] whitespace-nowrap">{ed.date}</span>}
                      </div>
                      {ed.detail && <p className="text-[10px] mt-0.5">{ed.detail}</p>}
                    </div>
                  ))}
                </div>
              </section>

              <Divider />

              {/* ── Certifications ── */}
              <section className="mb-6">
                <SectionTitle>Certifications</SectionTitle>
                <div className="flex flex-col gap-2">
                  {resumeCertifications.map((c) => (
                    <div key={c.title} className="flex justify-between items-baseline gap-2">
                      <span className="text-[10px] text-[#ccc]">{c.title}</span>
                      <span className="text-[9px] tracking-[1px] whitespace-nowrap">{c.date}</span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResumeDrawer;
