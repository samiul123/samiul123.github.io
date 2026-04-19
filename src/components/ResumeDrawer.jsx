import { useEffect, useCallback, useState, useRef } from 'react'; // useState kept for future zoom restoration
import { AnimatePresence, motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';

const MIN_WIDTH = 320;
const MAX_WIDTH_RATIO = 0.85;

const ResumeDrawer = ({ isOpen, onClose }) => {
  const [width, setWidth] = useState(() =>
    window.innerWidth < 1024 ? '100vw' : Math.round(window.innerWidth * 0.38)
  );
  const isDragging = useRef(false);
  const iframeRef = useRef(null);

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
      if (iframeRef.current) iframeRef.current.style.pointerEvents = '';
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
    if (iframeRef.current) iframeRef.current.style.pointerEvents = 'none';
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
            data-testid="resume-overlay"
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
              <span className="text-xs tracking-[3px] uppercase text-[#aaa] font-semibold">RESUME</span>

              {/* Download PDF */}
              <a
                href="/Samiul_Mushfik_Resume.pdf"
                download
                aria-label="Download resume PDF"
                className="ml-auto flex items-center justify-center w-[22px] h-[22px] border border-[#1a1a1a] rounded-[3px] text-[#aaa] hover:text-custom-green hover:border-custom-green transition-colors"
              >
                <FiDownload size={11} />
              </a>

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close resume"
                className="flex items-center justify-center w-[22px] h-[22px] border border-[#1a1a1a] rounded-[3px] text-[#aaa] text-[13px] hover:text-white hover:border-[#333] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* PDF viewer */}
            <div className="flex-1 overflow-hidden" style={{ filter: 'invert(1)' }}>
              <iframe
                ref={iframeRef}
                src="/Samiul_Mushfik_Resume.pdf"
                title="Resume PDF"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResumeDrawer;
