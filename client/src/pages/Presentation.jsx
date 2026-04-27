import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineX,
  HiOutlineLightBulb, HiOutlineUserGroup, HiOutlineTemplate,
  HiOutlineColorSwatch, HiOutlineLockOpen, HiOutlineCamera,
  HiOutlinePencilAlt, HiOutlineCode, HiOutlineServer,
  HiOutlineDatabase, HiOutlineShieldCheck, HiOutlineAdjustments,
  HiOutlineGlobeAlt, HiOutlineChartBar, HiOutlineLightningBolt,
  HiOutlineRocket, HiOutlineCheckCircle
} from 'react-icons/hi';

const slides = [
  {
    title: "FeedByMe",
    subtitle: "The Future of Multi-Project Feedback",
    content: "A professional, shareable feedback management system designed for developers and product teams who need clear insights without the friction.",
    icon: <HiOutlineRocket />,
    accent: "#005ea2"
  },
  {
    title: "The Problem",
    subtitle: "Why feedback is often a mess",
    content: "Scattered emails, generic forms, and forced logins create huge barriers. Users don't report bugs because it takes too long, and developers lose context without screenshots or structured data.",
    icon: <HiOutlineLightBulb />,
    accent: "#d32f2f"
  },
  {
    title: "The Solution",
    subtitle: "Simplicity meets Power",
    content: "FeedByMe provides a centralized hub where you can manage feedback boards for every project you own. It's fast, visual, and requires zero effort from your users.",
    icon: <HiOutlineCheckCircle />,
    accent: "#2e7d32"
  },
  {
    title: "Project Vision",
    subtitle: "Building for high-quality interactions",
    content: "Our goal was to build a tool that looks as good as the apps it supports. By using dark glassmorphism and modern UI patterns, we give your feedback portal instant credibility.",
    icon: <HiOutlineGlobeAlt />,
    accent: "#7b1fa2"
  },
  {
    title: "Target Audience",
    subtitle: "Who benefits from FeedByMe?",
    content: "From solo developers running beta tests to small SaaS teams managing feature requests. It's built for anyone who values user input but hates the overhead of heavy enterprise tools.",
    icon: <HiOutlineUserGroup />,
    accent: "#0097a7"
  },
  {
    title: "Multi-Project Boards",
    subtitle: "Organized by default",
    content: "Create dedicated boards for your Mobile App, Web Portal, and API. Each board has its own link, its own settings, and its own dedicated feedback stream.",
    icon: <HiOutlineTemplate />,
    accent: "#ed6c02"
  },
  {
    title: "Custom Branding",
    subtitle: "It feels like your own app",
    content: "You can fully customize the look of every board. Choose theme colors and upload your brand logo so that when users click your link, it feels like a seamless part of your ecosystem.",
    icon: <HiOutlineColorSwatch />,
    accent: "#005ea2"
  },
  {
    title: "Frictionless Guest Access",
    subtitle: "Lowering the barrier to entry",
    content: "We removed the login requirement. Users can submit feedback as guests in seconds. This ensures you get more feedback, more often, while still capturing optional emails for follow-up.",
    icon: <HiOutlineLockOpen />,
    accent: "#2e7d32"
  },
  {
    title: "Visual Context",
    subtitle: "Screenshots built-in",
    content: "Users can drag and drop images directly into the feedback form. Seeing exactly what the user sees saves hours of debugging time and clarifies vague descriptions.",
    icon: <HiOutlineCamera />,
    accent: "#ed6c02"
  },
  {
    title: "Dynamic Questionnaires",
    subtitle: "Ask exactly what you need",
    content: "Need to know their device or role? Add custom questions with types like Text, Long Text, or Rating. Mark them as required to ensure you get the data that matters.",
    icon: <HiOutlinePencilAlt />,
    accent: "#7b1fa2"
  },
  {
    title: "Tech Stack (Frontend)",
    subtitle: "React 18 & Vite",
    content: "Built for speed and modern standards. We used React for a snappy SPA experience and Vite for ultra-fast development. The UI is hand-crafted with pure CSS for a unique look.",
    icon: <HiOutlineCode />,
    accent: "#0097a7"
  },
  {
    title: "Tech Stack (Backend)",
    subtitle: "Node.js & Express",
    content: "A robust API layer that handles everything from JWT-based security to multipart file uploads. It's built to be scalable, secure, and fast.",
    icon: <HiOutlineServer />,
    accent: "#1b1b1b"
  },
  {
    title: "Database Strategy",
    subtitle: "MongoDB & Mongoose",
    content: "The flexible document model allowed us to implement 'Custom Questions' easily. MongoDB Atlas ensures high availability and cloud scalability for all your data.",
    icon: <HiOutlineDatabase />,
    accent: "#2e7d32"
  },
  {
    title: "Security & Privacy",
    subtitle: "Enterprise-grade protection",
    content: "Features include JWT session management, Bcrypt password encryption, and Role-Based Access Control. Only you see your feedback, and only you manage your boards.",
    icon: <HiOutlineShieldCheck />,
    accent: "#d32f2f"
  },
  {
    title: "Admin Experience",
    subtitle: "Full control over your portal",
    content: "A powerful dashboard gives you a bird's eye view of all projects. Moderate feedback, track submission counts, and update project settings with a single click.",
    icon: <HiOutlineAdjustments />,
    accent: "#005ea2"
  },
  {
    title: "UI/UX Philosophy",
    subtitle: "The beauty of Glassmorphism",
    content: "The app uses a sophisticated 'frosted glass' aesthetic. This creates a sense of depth and focus, making the interaction feel premium and state-of-the-art.",
    icon: <HiOutlineChartBar />,
    accent: "#7b1fa2"
  },
  {
    title: "Engineering Challenges",
    subtitle: "How we built the best tool",
    content: "We solved complex problems like handling guest vs. user permissions and building a dynamic form generator that adapts to any project configuration.",
    icon: <HiOutlineLightningBolt />,
    accent: "#ed6c02"
  },
  {
    title: "Project Impact",
    subtitle: "Transforming user communication",
    content: "FeedByMe turns vague complaints into structured insights. It helps teams listen better and build products that users actually love.",
    icon: <HiOutlineCheckCircle />,
    accent: "#2e7d32"
  },
  {
    title: "Future Roadmap",
    subtitle: "Where we're heading next",
    content: "Integrations with Slack and Discord, AI-powered sentiment analysis to auto-categorize feedback, and detailed CSV/Excel reports for stakeholders.",
    icon: <HiOutlineRocket />,
    accent: "#0097a7"
  },
  {
    title: "Thank You",
    subtitle: "Feedback is the heartbeat of growth",
    content: "FeedByMe is your project's ears. Build better, listen closer. Any questions?",
    icon: <HiOutlineRocket />,
    accent: "#005ea2"
  }
];

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') navigate('/dashboard');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="presentation-container">
      <div style={{ position: 'fixed', top: 10, left: 10, background: 'red', color: 'white', padding: '5px 10px', zIndex: 10001, borderRadius: 4, fontSize: '10px' }}>DEBUG: PRESENTATION LOADED</div>
      <div className="presentation-nav-header">
        <div className="slide-progress">
          {slides.map((_, i) => (
            <div key={i} className={`progress-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
          ))}
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')} title="Exit Presentation">
          <HiOutlineX />
        </button>
      </div>

      <div className="slide-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="slide-content"
          >
            <div className="slide-icon-wrapper" style={{ color: slides[current].accent }}>
              {slides[current].icon}
            </div>
            <h2 className="slide-subtitle" style={{ color: slides[current].accent }}>{slides[current].subtitle}</h2>
            <h1 className="slide-title">{slides[current].title}</h1>
            <p className="slide-text">{slides[current].content}</p>
            
            <div className="slide-number">
              {current + 1} / {slides.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="presentation-controls">
        <button className="nav-btn" onClick={prev} disabled={current === 0}>
          <HiOutlineChevronLeft />
        </button>
        <button className="nav-btn" onClick={next} disabled={current === slides.length - 1}>
          <HiOutlineChevronRight />
        </button>
      </div>

      <style>{`
        .presentation-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle at top right, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .presentation-nav-header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 24px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .slide-progress {
          display: flex;
          gap: 8px;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .progress-dot.active {
          background: white;
          width: 24px;
          border-radius: 4px;
        }

        .slide-wrapper {
          width: 100%;
          max-width: 1000px;
          padding: 40px;
          text-align: center;
        }

        .slide-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .slide-icon-wrapper {
          font-size: 5rem;
          margin-bottom: 24px;
          filter: drop-shadow(0 0 20px currentColor);
        }

        .slide-subtitle {
          font-size: 1.2rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }

        .slide-title {
          font-size: 5rem;
          font-weight: 800;
          margin-bottom: 32px;
          background: linear-gradient(to bottom, #fff, #aaa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .slide-text {
          font-size: 1.6rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.8);
          max-width: 800px;
        }

        .slide-number {
          position: absolute;
          bottom: 40px;
          right: 40px;
          font-size: 1.2rem;
          font-weight: 700;
          opacity: 0.5;
        }

        .presentation-controls {
          position: absolute;
          bottom: 40px;
          display: flex;
          gap: 24px;
        }

        .nav-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .nav-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
        }

        .nav-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .slide-title { font-size: 3rem; }
          .slide-text { font-size: 1.2rem; }
          .slide-icon-wrapper { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
}
