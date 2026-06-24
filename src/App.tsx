/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";

const mahendraAvatar = "/src/assets/images/mahendra_avatar_1782320540404.jpg";
import {
  Cpu,
  Layers,
  Bot,
  Workflow,
  Settings,
  Database,
  Sparkles,
  Terminal as TerminalIcon,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  ChevronDown,
  CheckCircle,
  TrendingUp,
  Send,
  Lock,
  Plus,
  Menu,
  Check,
  ShieldCheck,
  Zap,
  DollarSign
} from "lucide-react";

/* ==========================================
   PARTICLE CANVAS BACKGROUND COMPONENT
   ========================================== */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    // Scale particle count based on screen size
    const numParticles = Math.min(50, Math.floor((width * height) / 18000));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle Cyber Grid lines
      ctx.strokeStyle = "rgba(0, 240, 255, 0.025)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render connected floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wall rebound checks
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = "rgba(0, 240, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70 z-0"
    />
  );
}

/* ==========================================
   SCROLL REVEAL COMPONENT ( Intersection Observer )
   ========================================== */
function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  key?: React.Key;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : "translateY(35px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  /* ==========================================
     STATE MANAGEMENT
     ========================================== */
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootText, setBootText] = useState("INITIALIZING MAHENDRA_OS CORE...");
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState("welcome"); // welcome | automation

  // AI Avatar Speech Synthesis state
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isMutedVoice, setIsMutedVoice] = useState(false);
  const [speechSentenceIndex, setSpeechSentenceIndex] = useState(0);
  const [typedTextInSpeech, setTypedTextInSpeech] = useState("");
  const fallbackTimerRef = useRef<any>(null);

  // Interactive message dispatch box state
  const [formData, setFormData] = useState({ name: "", email: "", msg: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SYS_STATUS: Ready for inbound communication.",
    "AWAITING USER DATA DISPATCH..."
  ]);

  /* ==========================================
     BOOT LOADER EFFECTS
     ========================================== */
  useEffect(() => {
    const bootSequence = [
      { text: "INITIALIZING MAHENDRA_OS CORE...", time: 200 },
      { text: "ESTABLISHING GLOW MATRIX INTERFACES...", time: 500 },
      { text: "LOADING AUTOMATION CHANNELS (MAKE, ZAPIER, N8N)...", time: 900 },
      { text: "CACHING COMPREHENSIVE HR MIS LOGISTICS...", time: 1300 },
      { text: "INJECTING PRODUCT PROTOTYPES (FLOWNEXA & WORKLINK)...", time: 1600 },
      { text: "CONNECTION SECURED. SYSTEM STABLE.", time: 1950 }
    ];

    const textIntervals = bootSequence.map((item) => {
      return setTimeout(() => {
        setBootText(item.text);
      }, item.time);
    });

    const progressInterval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsBooting(false), 250);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      textIntervals.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, []);

  /* ==========================================
     MOUSE MOUSE TRACKER
     ========================================== */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* ==========================================
     SCROLL ACTIVE HIGHLIGHTER
     ========================================== */
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "experience", "projects", "education", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ==========================================
     TERMINAL INTEGRATION LOGGING
     ========================================== */
  const logToTerminal = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 6)]);
  };

  /* ==========================================
     AI AVATAR SPEECH SYNTHESIS CORE (MALE VOICE)
     ========================================== */
  const INTRO_SENTENCES = [
    "I'm Mahendra Singh Boura — a No-Code Automation Specialist, HR Professional, and Product Builder.",
    "From maintaining 99% accuracy in AI data operations to automating HR workflows that reduced processing time by 30%, I've always focused on solving problems through systems and innovation.",
    "Today, I'm building FlowNexa, WorkLink, and an AI Mock Interview Platform while pursuing my MBA in HR and Finance.",
    "I believe the future belongs to people who combine human understanding with the power of AI and automation.",
    "And that's exactly what I'm building.",
    "Welcome to my portfolio."
  ];

  const speakSentence = (index: number) => {
    if (index >= INTRO_SENTENCES.length) {
      setIsPlayingVoice(false);
      setSpeechSentenceIndex(0);
      logToTerminal("SPEECH_MATRIX: Complete narrative stream transmitted successfully.");
      return;
    }

    setSpeechSentenceIndex(index);
    logToTerminal(`SPEECH: Rendering index [${index + 1}/${INTRO_SENTENCES.length}]`);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }

    if (!isMutedVoice && typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(INTRO_SENTENCES[index]);
      
      const voices = window.speechSynthesis.getVoices();
      // Prioritize English male voices
      const maleVoice = voices.find(v => 
        v.lang.startsWith("en") && 
        (v.name.toLowerCase().includes("male") || 
         v.name.toLowerCase().includes("david") || 
         v.name.toLowerCase().includes("microsoft david") || 
         v.name.toLowerCase().includes("google us english") ||
         v.name.toLowerCase().includes("natural"))
      ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
      
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      
      // Set parameters for an engaging, grounded masculine tone
      utterance.pitch = 0.95;
      utterance.rate = 0.95;
      
      utterance.onend = () => {
        const timer = setTimeout(() => {
          speakSentence(index + 1);
        }, 1200);
        fallbackTimerRef.current = timer;
      };
      
      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis utterance error, shifting to timer simulation:", e);
        handleFallbackTransition(index);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      handleFallbackTransition(index);
    }
  };

  const handleFallbackTransition = (index: number) => {
    const sentence = INTRO_SENTENCES[index];
    const readingDuration = Math.max(3500, sentence.length * 60);
    
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }

    const timer = setTimeout(() => {
      speakSentence(index + 1);
    }, readingDuration + 1200);
    
    fallbackTimerRef.current = timer;
  };

  const startVoice = () => {
    setIsPlayingVoice(true);
    speakSentence(speechSentenceIndex);
    logToTerminal("SPEECH_MATRIX: Audio stream channels initialized.");
  };

  const pauseVoice = () => {
    setIsPlayingVoice(false);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }
    logToTerminal("SPEECH_MATRIX: Audio stream paused.");
  };

  const stopVoice = () => {
    setIsPlayingVoice(false);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }
    setSpeechSentenceIndex(0);
    setTypedTextInSpeech("");
    logToTerminal("SPEECH_MATRIX: Audio stream terminated.");
  };

  // Manage voice loading
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const handleVoicesChanged = () => {
        console.log("SpeechSynthesis system voices updated.");
      };
      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      };
    }
  }, []);

  // Sync subtitle typing effect
  useEffect(() => {
    if (!isPlayingVoice) {
      setTypedTextInSpeech("");
      return;
    }
    
    const activeSentence = INTRO_SENTENCES[speechSentenceIndex];
    if (!activeSentence) return;
    
    setTypedTextInSpeech("");
    let charIndex = 0;
    
    const interval = setInterval(() => {
      if (charIndex < activeSentence.length) {
        setTypedTextInSpeech((prev) => prev + activeSentence.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 28);
    
    return () => clearInterval(interval);
  }, [isPlayingVoice, speechSentenceIndex]);

  // Clean stop when modal closes or unmounts, and autostart when opened
  useEffect(() => {
    if (!videoModalOpen) {
      stopVoice();
    } else {
      const timer = setTimeout(() => {
        setIsPlayingVoice(true);
        speakSentence(0);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [videoModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    logToTerminal(`USER_INPUT: Changed key [${name.toUpperCase()}] to length ${value.length}`);
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.msg) {
      logToTerminal("ERROR_DISPATCH: Attempted transmission with empty variables!");
      return;
    }

    setIsSubmitting(true);
    logToTerminal("INITIATING PACKET TRANSMISSION TO BOURA_GATEWAY...");

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      logToTerminal("SUCCESS_DISPATCH: Message routed through local mail socket.");
      logToTerminal("ALERT: Mahendra will receive your dispatch shortly!");
      setFormData({ name: "", email: "", msg: "" });
      
      // Auto reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        logToTerminal("SYS_STATUS: Idle. Awaiting next dispatch.");
      }, 5000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-cyber-bg text-slate-100 selection:bg-neon-cyan/20 selection:text-neon-cyan overflow-hidden scanline">
      
      {/* ==========================================
         AISTUDIO MOUSE GLOW ORB (DESKTOP)
         ========================================== */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-96 h-96 rounded-full opacity-45 mix-blend-screen transition-transform duration-150 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`,
          background: "radial-gradient(circle, rgba(0, 240, 255, 0.12) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 100%)",
          zIndex: 40,
        }}
      />

      {/* ==========================================
         SCI-FI INITIAL SYSTEM BOOTING SCREEN
         ========================================== */}
      {isBooting && (
        <div className="fixed inset-0 bg-[#060913] z-50 flex flex-col items-center justify-center px-4 font-mono select-none">
          <div className="max-w-md w-full p-8 rounded-xl border border-neon-cyan/20 bg-cyber-dark relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]">
            {/* Holographic matrix styling */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink animate-grid-pulse" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-neon-cyan animate-ping" />
              <div className="text-xs uppercase tracking-widest text-neon-cyan font-bold font-display">
                SYS_BOOTING // COGNITIVE_PORTFOLIO
              </div>
            </div>

            <div className="mb-4 text-xs text-slate-400 font-mono h-20 overflow-hidden leading-relaxed">
              <div className="text-neon-purple font-semibold">&gt; {bootText}</div>
              <div className="text-[10px] opacity-60 mt-1">&gt; PROCESS_ID: {Math.floor(Math.random() * 90000) + 10000}</div>
              <div className="text-[10px] opacity-60">&gt; MEMORY_MAP: 0x7FFF8000 (VIRT_SYS)</div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between text-xs">
                <span className="text-neon-cyan font-semibold">SEQUENCING DATA CORE</span>
                <span className="text-neon-cyan font-semibold">{bootProgress}%</span>
              </div>
              <div className="overflow-hidden h-1.5 text-xs flex rounded bg-slate-900 border border-slate-800">
                <div
                  style={{ width: `${bootProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-100"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>HOST: PORT_3000_ACTIVE</span>
              <span>DEV_VER: 4.0.1_TS</span>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
         STICKY GLASSMORPHISM NAVBAR
         ========================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-white/5 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 group focus:outline-none">
              <div className="relative w-9 h-9 rounded-lg border border-neon-cyan/40 flex items-center justify-center overflow-hidden bg-cyber-dark group-hover:border-neon-cyan transition-all duration-300">
                <Cpu className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-display font-bold tracking-wider text-sm sm:text-base bg-gradient-to-r from-white via-slate-200 to-neon-cyan bg-clip-text text-transparent">
                M.S. BOURA
              </span>
            </a>

            {/* Desktop Navigation links */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: "home", label: "Hero" },
                { id: "about", label: "My Story" },
                { id: "skills", label: "Skills" },
                { id: "experience", label: "Experience" },
                { id: "projects", label: "Projects" },
                { id: "education", label: "Edu & Cert" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-4 py-2 text-xs font-medium tracking-wide rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Glowing CTA Button */}
            <div className="hidden md:flex items-center">
              <a
                href="#contact"
                className="relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-cyber-bg bg-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-white hover:text-cyber-bg hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all duration-300 focus:outline-none"
              >
                Hire Specialist
              </a>
            </div>

            {/* Hamburger Button for mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/5 absolute top-16 left-0 right-0 p-4 shadow-2xl flex flex-col gap-2 z-50 animate-fadeIn">
            {[
              { id: "home", label: "Hero" },
              { id: "about", label: "My Story" },
              { id: "skills", label: "Skills" },
              { id: "experience", label: "Experience" },
              { id: "projects", label: "Projects" },
              { id: "education", label: "Education & Certifications" },
              { id: "contact", label: "Contact / Inbound" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium tracking-wide rounded-xl transition-all duration-300 ${
                  activeSection === item.id
                    ? "text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ==========================================
         SECTION 1: HERO
         ========================================== */}
      <section
        id="home"
        className="relative min-h-screen pt-16 flex flex-col justify-center items-center overflow-hidden grid-bg z-10"
      >
        {/* Animated canvas particles inside hero only */}
        <ParticleCanvas />

        {/* Ambient neon radial glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col items-center justify-center text-center py-12">
          
          {/* Avatar Area with overlap Video Play */}
          <div className="relative mb-8 group">
            {/* Outer glowing pulsing orbit circle */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple opacity-75 blur-md animate-pulse" />
            
            {/* Actual photo frame */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-cyber-dark group/avatar shadow-[0_0_30px_rgba(0,240,255,0.15)]">
              <img
                src={mahendraAvatar}
                alt="Mahendra Singh Boura"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                referrerPolicy="no-referrer"
              />
              {/* Sci-fi tech scan overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent pointer-events-none animate-scan-up" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Overlapping Lightbox Play Button */}
            <button
              onClick={() => {
                setVideoModalOpen(true);
                logToTerminal("LIGHTBOX: Triggered video avatar player overlay");
              }}
              className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-cyber-bg border border-neon-cyan text-neon-cyan flex items-center justify-center hover:bg-neon-cyan hover:text-cyber-bg hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] active:scale-95 transition-all duration-300 cursor-pointer shadow-lg z-10"
              title="Play AI Avatar Intro Video"
            >
              <Play className="w-5 h-5 ml-0.5 animate-pulse" />
              
              {/* Outer pulsing ring */}
              <span className="absolute -inset-1 rounded-full border border-neon-cyan/50 animate-ping opacity-75" />
            </button>
          </div>

          {/* Subtitle Tech-Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 text-neon-purple mb-4 text-[10px] sm:text-xs font-mono uppercase tracking-widest animate-pulse">
            <Sparkles className="w-3 h-3 text-neon-cyan" />
            <span>AI OS // AUTOMATION ENGINEER</span>
          </div>

          {/* Huge Main Heading */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 select-text">
            <span className="text-white">MAHENDRA SINGH </span>
            <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent cyan-glow-text">
              BOURA
            </span>
          </h1>

          {/* Core Tagline */}
          <p className="max-w-2xl text-base sm:text-lg lg:text-xl text-slate-400 mb-8 font-sans leading-relaxed tracking-wide">
            No-Code Automation Specialist <span className="text-neon-cyan">//</span> HR &amp; Business Operations <span className="text-neon-cyan">//</span> Product Builder
          </p>

          {/* Hero Statistics Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-12">
            {[
              {
                metric: "30% Faster",
                label: "HR Workflows Built",
                accent: "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5",
                icon: <Zap className="w-4 h-4 text-neon-cyan" />
              },
              {
                metric: "99% Accuracy",
                label: "In Data Annotation Ops",
                accent: "text-neon-purple border-neon-purple/20 bg-neon-purple/5",
                icon: <ShieldCheck className="w-4 h-4 text-neon-purple" />
              },
              {
                metric: "3+ Products",
                label: "Live & In-Dev Projects",
                accent: "text-neon-pink border-neon-pink/20 bg-neon-pink/5",
                icon: <Layers className="w-4 h-4 text-neon-pink" />
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${stat.accent} transition-transform duration-300 hover:scale-105 flex flex-col items-center justify-center`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {stat.icon}
                  <span className="font-display font-bold text-lg sm:text-xl text-white">
                    {stat.metric}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll Down Indicator */}
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-neon-cyan transition-colors duration-300 group mt-4 focus:outline-none"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">
              DECRYPT_MY_STORY
            </span>
            <ChevronDown className="w-5 h-5 animate-bounce group-hover:text-neon-cyan" />
          </a>

        </div>
      </section>

      {/* ==========================================
         SECTION 2: ABOUT / MY STORY
         ========================================== */}
      <section id="about" className="py-24 relative border-t border-white/5 bg-cyber-dark z-10">
        
        {/* Decorative corner glows */}
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-neon-cyan/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="text-xs uppercase font-mono text-neon-cyan mb-2 tracking-widest">
                // SYSTEM_OVERVIEW
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                My Story
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual tech core left panel */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <ScrollReveal delay={200}>
                <div className="p-6 rounded-2xl geo-card relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    ACTIVE_COGNITION
                  </div>
                  
                  {/* Cyber Grid Visualization */}
                  <div className="space-y-4 font-mono text-xs text-slate-300">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <Cpu className="w-4 h-4 text-neon-cyan" />
                      <span className="text-white font-bold uppercase">Mahendra_OS // Core Skills</span>
                    </div>

                    <div className="space-y-3 pt-2">
                      {[
                        { label: "AI Integration & APIs", pct: "95%" },
                        { label: "Make & Zapier Automations", pct: "100%" },
                        { label: "HR Management & Operations", pct: "85%" },
                        { label: "Product Architecture (SaaS)", pct: "80%" },
                        { label: "Candidate Pipeline MIS", pct: "90%" }
                      ].map((bar, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">{bar.label}</span>
                            <span className="text-neon-cyan">{bar.pct}</span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                            <div
                              className="bg-gradient-to-r from-neon-cyan to-neon-purple h-full rounded-full"
                              style={{ width: bar.pct }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-3 mt-4 text-[10px] text-slate-400 space-y-1 leading-relaxed">
                      <div>&gt; STACK: MAKE, AIRTABLE, G-SUITE, PYTHON_HELPERS</div>
                      <div>&gt; DATABASE_CONNECTORS: ACTIVE</div>
                      <div>&gt; INTERVIEW_PREP_BOT: READY</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Warm, first person narrative text */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <ScrollReveal delay={100}>
                <p className="text-lg sm:text-xl font-medium text-slate-200 font-display">
                  Hi there! I am Mahendra Singh Boura, a business operations professional, HR manager, and self-taught no-code developer based in India.
                </p>
                <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                  <p>
                    My career journey began in the fast-paced realm of HR and data operations. At{" "}
                    <strong className="text-neon-cyan font-medium">Cogito</strong>, I entered the world of machine learning, coordinating high-intensity data annotation efforts for AI models with a relentless{" "}
                    <strong className="text-neon-cyan font-medium">99% accuracy rate</strong>. 
                  </p>
                  <p>
                    I later expanded into end-to-end IT recruitment at{" "}
                    <strong className="text-neon-purple font-medium">The HR Gallery</strong>, sourcing candidate pipelines for over 10 distinct, highly concurrent tech and non-tech roles. Transitioning into{" "}
                    <strong className="text-neon-purple font-medium">Alpha Lion Trucking</strong>, I wore two hats as HR manager and developer, realizing how much corporate drag stems from manual pipelines. This inspired me to automate our operations, slashing HR processing times by{" "}
                    <strong className="text-neon-cyan font-medium">30%</strong> using Make.com and Zapier.
                  </p>
                  <p>
                    Driven by a hunger to build products from scratch without standard coding bottlenecks, I plunged into the universe of no-code, API architectures, and AI-assisted engineering. I’m currently completing my{" "}
                    <strong className="text-white font-medium">MBA in HR &amp; Finance at IIMT</strong> and hold a B.Com from Uttarakhand Open University. I bridge the gap between people logistics and scalable tech engines.
                  </p>
                  <p className="text-slate-200">
                    At the moment, I’m actively launching three key products: <strong>FlowNexa</strong>, <strong>WorkLink</strong>, and my <strong>AI Mock Interview Platform</strong>. I am on the lookout for a forward-thinking team where my automation skills and operational grit can make a massive dent. Let’s collaborate and build the future!
                  </p>
                </div>

                {/* Glowing outline resume download button */}
                <div className="pt-6">
                  {/* PLACEHOLDER COMMENT FOR RESUME FILE:
                      Simply replace the href="#" below with your actual hosted resume PDF link (e.g. "/resume.pdf") 
                  */}
                  <a
                    href="#"
                    onClick={() => logToTerminal("DOWNLOAD: Initiated local resume fetch protocol")}
                    className="relative inline-flex items-center gap-2.5 px-6 py-3 border border-neon-cyan/50 hover:border-neon-cyan text-neon-cyan rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 group bg-neon-cyan/5 hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] focus:outline-none"
                    download="Mahendra_Singh_Boura_Resume.pdf"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Resume</span>
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan"></span>
                    </span>
                  </a>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION 3: SKILLS & TOOLS
         ========================================== */}
      <section id="skills" className="py-24 relative border-t border-white/5 grid-bg z-10">
        
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="text-xs uppercase font-mono text-neon-purple mb-2 tracking-widest">
                // CAPABILITIES_INVENTORY
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                Skills &amp; Tools
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-neon-purple to-neon-cyan mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {[
              {
                title: "Automation & Workflows",
                desc: "Connecting disconnected cloud tools into seamless self-healing networks.",
                icon: <Workflow className="text-neon-cyan w-5 h-5" />,
                skills: ["Make.com", "Zapier", "n8n", "Airtable", "Google Sheets", "Hookdeck", "Cron Scheduling"],
                glow: "glass-panel-cyan-hover"
              },
              {
                title: "HR & Business Operations",
                desc: "Sourcing talent, designing record models, and maximizing operational metrics.",
                icon: <Briefcase className="text-neon-purple w-5 h-5" />,
                skills: ["End-to-End Recruitment", "IT & Non-IT Sourcing", "MIS Reporting", "Process Optimization", "Compensation Logic", "Onboarding Automations"],
                glow: "glass-panel-purple-hover"
              },
              {
                title: "AI & Data Processing",
                desc: "Crafting fine-tuned training datasets and structuring intelligent agent logic.",
                icon: <Bot className="text-neon-pink w-5 h-5" />,
                skills: ["Data Annotation", "Prompt Engineering", "CRM Automations", "AI-assisted Development", "GPT-4 & Gemini API integration", "Vector embeddings"],
                glow: "glass-panel-cyan-hover"
              },
              {
                title: "Product & SaaS Design",
                desc: "Architecting visual mockups, databases, and structural monetization tiers.",
                icon: <Layers className="text-neon-cyan w-5 h-5" />,
                skills: ["SaaS Architecture", "Pricing Models Strategy", "UI/UX Wireframing", "Functional Specifications", "Bubble.io Mockups", "PRD Generation"],
                glow: "glass-panel-cyan-hover"
              },
              {
                title: "Modern Tech Concepts",
                desc: "Under the hood familiarity for seamless developer cooperation and API design.",
                icon: <Database className="text-neon-purple w-5 h-5" />,
                skills: ["REST APIs", "PostgreSQL", "Node.js", "Next.js", "Razorpay Integration", "JSON Datatypes", "Git Version Control"],
                glow: "glass-panel-purple-hover"
              },
              {
                title: "Personal Philosophy",
                desc: "Foundational mindset driving every build and optimization pipeline.",
                icon: <Sparkles className="text-neon-pink w-5 h-5" />,
                skills: ["Problem Solving", "Ambitious Execution", "Self-Taught Fast Learner", "Down-to-earth Collaboration", "Data-centric approach"],
                glow: "glass-panel-cyan-hover"
              }
            ].map((card, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className={`p-6 rounded-2xl ${idx % 2 === 0 ? "geo-card" : "geo-card-purple"} h-full flex flex-col justify-between`}>
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-cyber-bg">
                        {card.icon}
                      </div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-white">
                        {card.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  {/* Skills tags/pills with subtle hover glow */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {card.skills.map((tag, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 text-[10px] font-mono tracking-wide rounded-md border border-white/5 bg-slate-950/40 text-slate-300 hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all duration-300 select-none cursor-default"
                        onClick={() => logToTerminal(`SKILL_INTERACTIVE: Focused capability [${tag.toUpperCase()}]`)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}

          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION 4: EXPERIENCE (TIMELINE)
         ========================================== */}
      <section id="experience" className="py-24 relative border-t border-white/5 bg-cyber-dark z-10">
        
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="text-xs uppercase font-mono text-neon-cyan mb-2 tracking-widest">
                // PROFESSIONAL_TIMELINE
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                Experience
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          {/* Timeline Wrapper */}
          <div className="relative max-w-3xl mx-auto">
            {/* Middle glowing vertical rail */}
            <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink opacity-40 shadow-[0_0_10px_rgba(0,240,255,0.5)]" />

            {/* Entries list */}
            <div className="space-y-12">
              
              {/* Entry 1 */}
              <ScrollReveal delay={100}>
                <div className="relative flex flex-col sm:flex-row items-stretch">
                  
                  {/* Center Node (Glow node) */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-cyber-bg border-2 border-neon-cyan -translate-x-1.5 sm:-translate-x-2 z-10 shadow-[0_0_15px_rgba(0,240,255,0.8)] animate-pulse" />

                  {/* Left spacer for desktop */}
                  <div className="hidden sm:block w-1/2 pr-12 text-right">
                    <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-widest text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 rounded-full uppercase">
                      Sep 2025 – Nov 2025
                    </span>
                    <h4 className="font-display font-bold text-white text-lg mt-2">
                      Alpha Lion Trucking
                    </h4>
                    <span className="text-xs text-neon-purple font-mono uppercase tracking-widest block mt-0.5">
                      HR Manager &amp; Automation Specialist
                    </span>
                  </div>

                  {/* Right bubble content */}
                  <div className="w-full sm:w-1/2 pl-12 sm:pl-12">
                    <div className="p-6 rounded-2xl geo-card relative">
                      
                      {/* Mobile indicators */}
                      <div className="sm:hidden mb-2">
                        <span className="inline-block px-2 py-0.5 text-[9px] font-mono tracking-widest text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 rounded-full uppercase">
                          Sep 2025 – Nov 2025
                        </span>
                        <h4 className="font-display font-bold text-white text-base mt-1">
                          Alpha Lion Trucking
                        </h4>
                        <span className="text-[10px] text-neon-purple font-mono uppercase tracking-widest block mt-0.5">
                          HR Manager &amp; Automation Specialist
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Reduced manual HR processing time by <strong>30%</strong> by designing custom automations and trigger-action pipelines using Make.com and Zapier. Created optimized digital employee record systems and automated MIS reporting routines.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                        {["Make.com", "Zapier", "Airtable", "Automation"].map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[9px] font-mono bg-slate-950 text-slate-400 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </ScrollReveal>

              {/* Entry 2 */}
              <ScrollReveal delay={200}>
                <div className="relative flex flex-col sm:flex-row-reverse items-stretch">
                  
                  {/* Center Node (Glow node) */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-cyber-bg border-2 border-neon-purple -translate-x-1.5 sm:-translate-x-2 z-10 shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-pulse" />

                  {/* Left spacer for desktop (holds content now) */}
                  <div className="hidden sm:block w-1/2 pl-12 text-left">
                    <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-widest text-neon-purple border border-neon-purple/20 bg-neon-purple/5 rounded-full uppercase">
                      Sep 2024 – Jun 2025
                    </span>
                    <h4 className="font-display font-bold text-white text-lg mt-2">
                      The HR Gallery
                    </h4>
                    <span className="text-xs text-neon-cyan font-mono uppercase tracking-widest block mt-0.5">
                      HR Recruiter
                    </span>
                  </div>

                  {/* Right bubble content */}
                  <div className="w-full sm:w-1/2 pr-12 sm:pr-12">
                    <div className="p-6 rounded-2xl geo-card-purple relative">
                      
                      {/* Mobile indicators */}
                      <div className="sm:hidden mb-2">
                        <span className="inline-block px-2 py-0.5 text-[9px] font-mono tracking-widest text-neon-purple border border-neon-purple/20 bg-neon-purple/5 rounded-full uppercase">
                          Sep 2024 – Jun 2025
                        </span>
                        <h4 className="font-display font-bold text-white text-base mt-1">
                          The HR Gallery
                        </h4>
                        <span className="text-[10px] text-neon-cyan font-mono uppercase tracking-widest block mt-0.5">
                          HR Recruiter
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Managed full lifecycle candidate recruitment pipelines for <strong>10+ concurrent IT and Non-IT</strong> professional roles. Engineered organized candidate evaluation databases inside Airtable and produced periodic performance MIS sheets for stakeholders.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                        {["Airtable", "MIS Sourced", "IT Sourcing", "Talent"].map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[9px] font-mono bg-slate-950 text-slate-400 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </ScrollReveal>

              {/* Entry 3 */}
              <ScrollReveal delay={300}>
                <div className="relative flex flex-col sm:flex-row items-stretch">
                  
                  {/* Center Node (Glow node) */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-cyber-bg border-2 border-neon-pink -translate-x-1.5 sm:-translate-x-2 z-10 shadow-[0_0_15px_rgba(255,0,127,0.8)] animate-pulse" />

                  {/* Left spacer for desktop */}
                  <div className="hidden sm:block w-1/2 pr-12 text-right">
                    <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-widest text-neon-pink border border-neon-pink/20 bg-neon-pink/5 rounded-full uppercase">
                      Dec 2023 – Jun 2024
                    </span>
                    <h4 className="font-display font-bold text-white text-lg mt-2">
                      Cogito
                    </h4>
                    <span className="text-xs text-neon-purple font-mono uppercase tracking-widest block mt-0.5">
                      Data Operations Executive
                    </span>
                  </div>

                  {/* Right bubble content */}
                  <div className="w-full sm:w-1/2 pl-12 sm:pl-12">
                    <div className="p-6 rounded-2xl geo-card relative">
                      
                      {/* Mobile indicators */}
                      <div className="sm:hidden mb-2">
                        <span className="inline-block px-2 py-0.5 text-[9px] font-mono tracking-widest text-neon-pink border border-neon-pink/20 bg-neon-pink/5 rounded-full uppercase">
                          Dec 2023 – Jun 2024
                        </span>
                        <h4 className="font-display font-bold text-white text-base mt-1">
                          Cogito
                        </h4>
                        <span className="text-[10px] text-neon-purple font-mono uppercase tracking-widest block mt-0.5">
                          Data Operations Executive
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Executed high-volume precise data annotation tasks for machine learning training models. Preserved a rigorous quality control routine, ensuring a <strong>99% overall accuracy metric</strong> on structured dataset records.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                        {["Annotation", "ML Datasets", "Data QA", "Precision"].map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[9px] font-mono bg-slate-950 text-slate-400 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </ScrollReveal>

            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION 5: PROJECTS (MOST IMPORTANT)
         ========================================== */}
      <section id="projects" className="py-24 relative border-t border-white/5 grid-bg z-10">
        
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="text-xs uppercase font-mono text-neon-cyan mb-2 tracking-widest">
                // ACTIVE_DEPLOYMENTS
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                Projects I'm Building
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          {/* Grid of Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Card 1 - FlowNexa */}
            <ScrollReveal delay={100}>
              <div className="group rounded-2xl geo-card p-6 flex flex-col justify-between h-full relative overflow-hidden">
                <div>
                  
                  {/* Status & icon header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl border border-white/10 bg-cyber-bg flex items-center justify-center">
                      <Workflow className="w-5 h-5 text-neon-cyan animate-pulse" />
                    </div>
                    
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-neon-cyan transition-colors duration-300">
                    FlowNexa
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                    Enterprise-grade no-code automation hub which bridges databases, triggers social dispatchers, and streamlines repetitive corporate routines.
                  </p>

                  {/* Tech stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {["n8n", "Make.com", "Zapier", "Airtable"].map((tag, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metric & Action button footer */}
                <div className="mt-8 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 bg-cyber-dark/80 p-2.5 rounded-lg border border-white/5">
                    <Zap className="w-4 h-4 text-neon-cyan" />
                    <span><strong>⚡ Reduced manual workflow time by 30%</strong></span>
                  </div>

                  <a
                    href="https://flownexa-automation.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => logToTerminal("ROUTE: Visited external FlowNexa production")}
                    className="w-full py-2.5 rounded-xl border border-neon-cyan text-neon-cyan text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 bg-neon-cyan/5 hover:bg-neon-cyan hover:text-cyber-bg transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.1)] focus:outline-none"
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 - WorkLink */}
            <ScrollReveal delay={200}>
              <div className="group rounded-2xl geo-card-purple p-6 flex flex-col justify-between h-full relative overflow-hidden">
                <div>
                  
                  {/* Status & icon header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl border border-white/10 bg-cyber-bg flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-neon-purple" />
                    </div>
                    
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-amber-500/30 bg-amber-500/10 text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      IN DEVELOPMENT
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-neon-purple transition-colors duration-300">
                    WorkLink
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                    India's first verified professional networking &amp; job platform. An alternative to LinkedIn &amp; Naukri with mandatory employer verification, fake-job ban system, CV search, freelance marketplace with Razorpay escrow, and an AI feature suite (JD generator, interview question generator).
                  </p>

                  {/* Tech stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {["Bubble", "Webflow", "Airtable", "Razorpay"].map((tag, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metric & Action button footer */}
                <div className="mt-8 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 bg-cyber-dark/80 p-2.5 rounded-lg border border-white/5">
                    <DollarSign className="w-4 h-4 text-neon-purple" />
                    <span><strong>📈 4-tier pricing model (₹1.9k–₹1.5L/yr)</strong></span>
                  </div>

                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl border border-slate-800 text-slate-500 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 bg-slate-950/50 cursor-not-allowed select-none"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Coming Soon</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3 - AI Mock Interview Platform */}
            <ScrollReveal delay={300}>
              <div className="group rounded-2xl geo-card p-6 flex flex-col justify-between h-full relative overflow-hidden">
                <div>
                  
                  {/* Status & icon header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl border border-white/10 bg-cyber-bg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-neon-pink" />
                    </div>
                    
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-amber-500/30 bg-amber-500/10 text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      IN DEVELOPMENT
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-neon-pink transition-colors duration-300">
                    AI Mock Interview Platform
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                    AI-powered interview trainer. Paste a specific job role/JD, receive tailored interview questions, submit answers, and acquire AI-generated deep feedback with a structured performance score.
                  </p>

                  {/* Tech stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {["Voiceflow", "GPT-4", "Next.js", "PostgreSQL"].map((tag, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metric & Action button footer */}
                <div className="mt-8 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 bg-cyber-dark/80 p-2.5 rounded-lg border border-white/5">
                    <TrendingUp className="w-4 h-4 text-neon-pink" />
                    <span><strong>🎤 Full AI feedback + scoring loop</strong></span>
                  </div>

                  <a
                    href="https://github.com/mohitsinghboura07-spec/MockPrep_AI"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => logToTerminal("ROUTE: Visited external GitHub MockPrep_AI repository")}
                    className="w-full py-2.5 rounded-xl border border-neon-pink text-neon-pink text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 bg-neon-pink/5 hover:bg-neon-pink hover:text-cyber-bg transition-all duration-300 shadow-[0_0_10px_rgba(255,0,127,0.1)] focus:outline-none"
                  >
                    <span>View Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Smaller Github profile promo */}
          <ScrollReveal delay={400}>
            <div className="mt-12 max-w-xl mx-auto p-6 rounded-2xl geo-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left relative overflow-hidden">
              <div className="flex items-center gap-4 flex-col sm:flex-row">
                <div className="w-12 h-12 rounded-full border border-white/10 bg-cyber-bg flex items-center justify-center">
                  <Github className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-base">
                    More on GitHub
                  </h4>
                  <p className="text-xs text-slate-400">
                    Explore more projects, code frameworks, and experiments.
                  </p>
                </div>
              </div>

              <a
                href="https://github.com/mohitsinghboura07-spec"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logToTerminal("ROUTE: Visited external GitHub personal account")}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:border-white text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 text-xs font-semibold tracking-wide uppercase focus:outline-none"
              >
                <span>Github Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ==========================================
         SECTION 6: CERTIFICATIONS & EDUCATION
         ========================================== */}
      <section id="education" className="py-24 relative border-t border-white/5 bg-cyber-dark z-10">
        
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="text-xs uppercase font-mono text-neon-purple mb-2 tracking-widest">
                // QUALIFICATION_STANDARDS
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                Certifications &amp; Education
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-neon-purple to-neon-cyan mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Certifications Card */}
            <ScrollReveal delay={100}>
              <div className="p-8 rounded-2xl geo-card-purple relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  VERIFIED_ACC
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl border border-white/10 bg-cyber-bg flex items-center justify-center text-neon-purple">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Certifications
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-neon-purple/30 transition-colors duration-300">
                    <span className="text-[10px] font-mono text-neon-purple uppercase tracking-widest block mb-1">
                      GEMINI &amp; MICRO1 INC. // 2026
                    </span>
                    <h4 className="font-display font-bold text-white text-sm sm:text-base">
                      Certified AI Automation Specialist
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Specialized in constructing high-volume automation pipelines leveraging Google Gemini models and prompt-engineered workflows.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Education Card */}
            <ScrollReveal delay={200}>
              <div className="p-8 rounded-2xl geo-card relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  ACADEMIC_SYS
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl border border-white/10 bg-cyber-bg flex items-center justify-center text-neon-cyan">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Education
                  </h3>
                </div>

                <div className="space-y-4">
                  
                  {/* MBA */}
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-neon-cyan/30 transition-colors duration-300">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest block mb-1">
                        IIMT // PURSUING
                      </span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 uppercase tracking-widest animate-pulse">
                        Active
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-white text-sm sm:text-base">
                      MBA in HR &amp; Finance
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Syllabus centered on corporate governance, MIS analytics, human resources compensation, and process design.
                    </p>
                  </div>

                  {/* BCom */}
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-neon-cyan/30 transition-colors duration-300">
                    <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest block mb-1">
                      UTTARAKHAND OPEN UNIVERSITY // GRADUATED
                    </span>
                    <h4 className="font-display font-bold text-white text-sm sm:text-base">
                      Bachelor of Commerce (B.Com)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Foundational knowledge base in accounting spreadsheets, commercial economics, and audit compliance logs.
                    </p>
                  </div>

                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION 7: CONTACT / FOOTER
         ========================================== */}
      <section id="contact" className="py-24 relative border-t border-white/5 grid-bg z-10">
        
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="flex flex-col items-center mb-16 text-center">
              <div className="text-xs uppercase font-mono text-neon-cyan mb-2 tracking-widest">
                // INBOUND_TRANSMISSIONS
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                Let's Build Something Together
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple mt-4 rounded-full" />
            </div>
          </ScrollReveal>

          <div className="max-w-2xl mx-auto">
            
            {/* Contact Info Nodes */}
            <div className="space-y-6">
              
              <ScrollReveal delay={100}>
                <div className="p-6 rounded-2xl geo-card space-y-4">
                  <h3 className="font-display font-bold text-lg text-white">
                    Direct Directives
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Have a query regarding no-code architecture or IT/Non-IT talent pipelines? Ping my terminals directly via any preferred visual node below.
                  </p>
                </div>
              </ScrollReveal>

              {/* Grid of buttons */}
              <ScrollReveal delay={150}>
                <div className="space-y-3">
                  
                  {/* Call Button */}
                  <a
                    href="tel:+918958430370"
                    onClick={() => logToTerminal("NODE_CLICK: Native telephone dialer selected (+91-8958430370)")}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 transition-all duration-300 group focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-lg border border-white/10 bg-cyber-bg flex items-center justify-center text-slate-400 group-hover:text-neon-cyan group-hover:border-neon-cyan/30 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block uppercase">
                        Native Call
                      </span>
                      <span className="text-sm font-semibold text-white group-hover:text-neon-cyan transition-colors">
                        +91-8958430370
                      </span>
                    </div>
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href="https://wa.me/918958430370"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => logToTerminal("NODE_CLICK: WhatsApp messenger selected (+91-8958430370)")}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-300 group focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-lg border border-white/10 bg-cyber-bg flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block uppercase">
                        WhatsApp Msg
                      </span>
                      <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        +91-8958430370
                      </span>
                    </div>
                  </a>

                  {/* Email Button */}
                  <a
                    href="mailto:mohitsinghboura07@gmail.com"
                    onClick={() => logToTerminal("NODE_CLICK: Mailto client opened (mohitsinghboura07@gmail.com)")}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-neon-purple/40 hover:bg-neon-purple/5 transition-all duration-300 group focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-lg border border-white/10 bg-cyber-bg flex items-center justify-center text-slate-400 group-hover:text-neon-purple group-hover:border-neon-purple/30 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block uppercase">
                        Secure Email
                      </span>
                      <span className="text-sm font-semibold text-white group-hover:text-neon-purple transition-colors break-all">
                        mohitsinghboura07@gmail.com
                      </span>
                    </div>
                  </a>

                </div>
              </ScrollReveal>

              {/* High Contrast Social Capsule Links */}
              <ScrollReveal delay={200}>
                <div className="flex gap-3 justify-center pt-4 border-t border-white/5">
                  {[
                    {
                      icon: <Linkedin className="w-5 h-5" />,
                      url: "https://linkedin.com/in/mahendra-singh-boura-454165325",
                      label: "LinkedIn",
                      accent: "hover:border-neon-cyan hover:text-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    },
                    {
                      icon: <Github className="w-5 h-5" />,
                      url: "https://github.com/mohitsinghboura07-spec",
                      label: "GitHub",
                      accent: "hover:border-white hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    }
                  ].map((soc, i) => (
                    <a
                      key={i}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={soc.label}
                      onClick={() => logToTerminal(`ROUTE: Visited external ${soc.label} profile`)}
                      className={`w-12 h-12 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-400 transition-all duration-300 focus:outline-none ${soc.accent}`}
                    >
                      {soc.icon}
                    </a>
                  ))}
                </div>
              </ScrollReveal>
            </div>

          </div>

          {/* Footer Line */}
          <footer className="mt-20 pt-8 border-t border-white/5 text-center text-xs text-slate-500 font-mono space-y-2">
            <div>
              &copy; 2026 Mahendra Singh Boura. Crafted with no-code automation, AI architecture, and ambition.
            </div>
            <div className="text-[10px] text-slate-600 select-none">
              LOC: UTTARAKHAND // ACCURACY: 99% VERIFIED // BOOT_VER: V4.0
            </div>
          </footer>

        </div>
      </section>

      {/* ==========================================
         SCI-FI LIGHTBOX / INTRO VIDEO MODAL
         ========================================== */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03050a]/90 backdrop-blur-md animate-fadeIn">
          
          <div className="relative max-w-3xl w-full rounded-2xl border border-neon-cyan/40 bg-cyber-bg p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)] relative overflow-hidden">
            {/* Holographic scanning matrix bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-purple animate-grid-pulse" />
            
            {/* Header / Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
              
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-neon-cyan animate-pulse" />
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    AI Avatar Intro Portal
                  </h3>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                    Source: AI_AVATAR_INTRO_VOICE
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setVideoModalOpen(false);
                  logToTerminal("LIGHTBOX: Closed video avatar player");
                }}
                className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors focus:outline-none"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive AI Avatar Portal Container */}
            <div className="relative rounded-xl bg-slate-950/80 border border-white/5 overflow-hidden flex flex-col md:flex-row gap-6 p-6">
              
              {/* Left Side: Avatar Hologram Frame */}
              <div className="relative w-full md:w-1/3 rounded-lg overflow-hidden border border-white/10 bg-cyber-dark flex flex-col items-center justify-center p-4 group">
                
                {/* Neon Cyan & Purple Glowing Backdrop */}
                <div className="absolute inset-0 bg-radial-gradient from-neon-cyan/10 to-transparent pointer-events-none" />
                
                {/* Avatar Image */}
                <div className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-neon-cyan/30 shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all duration-500 ${isPlayingVoice ? "scale-105 border-neon-cyan/80 ring-4 ring-neon-cyan/10" : ""}`}>
                  <img
                    src={mahendraAvatar}
                    alt="Mahendra Singh Boura AI Avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Digital HUD overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent pointer-events-none animate-scan-up" />
                </div>

                {/* Voice Equalizer Visualizer Bars */}
                <div className="mt-4 flex items-end justify-center gap-1 h-6">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-gradient-to-t from-neon-cyan to-neon-purple transition-all duration-150 animate-pulse"
                      style={{
                        height: isPlayingVoice ? `${Math.floor(Math.random() * 20) + 4}px` : "4px",
                        animationName: isPlayingVoice ? "equalizerBar" : "none",
                        animationDuration: "0.8s",
                        animationTimingFunction: "ease-in-out",
                        animationIterationCount: "infinite",
                        animationDirection: "alternate",
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>

                {/* Status Indicator */}
                <div className="mt-3 flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${isPlayingVoice ? "bg-emerald-500 animate-ping" : "bg-amber-500 animate-pulse"}`} />
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                    {isPlayingVoice ? "TRANSMITTING" : "STANDBY"}
                  </span>
                </div>
              </div>

              {/* Right Side: Dialogue & Captions Screen */}
              <div className="flex-1 flex flex-col justify-between h-full min-h-[220px]">
                
                {/* Progress Indicators */}
                <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 uppercase tracking-wider mb-2">
                  <span>DIALOG_STREAM // PART {speechSentenceIndex + 1}_OF_{INTRO_SENTENCES.length}</span>
                  <span className="text-neon-cyan">ACCURACY: 99% VERIFIED</span>
                </div>

                {/* Sentence Captions Box */}
                <div className="flex-1 rounded-lg bg-slate-900/40 border border-white/5 p-4 min-h-[140px] flex flex-col justify-center relative overflow-hidden">
                  <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed relative z-10 font-medium">
                    {typedTextInSpeech || <span className="text-slate-500 italic">Initializing digital stream...</span>}
                    {isPlayingVoice && <span className="inline-block w-1.5 h-4 ml-1 bg-neon-cyan animate-blink" />}
                  </p>
                </div>

                {/* Controls Panel */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                  
                  {/* Player Buttons */}
                  <div className="flex items-center gap-2">
                    {isPlayingVoice ? (
                      <button
                        onClick={pauseVoice}
                        className="px-4 py-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/10 transition-colors flex items-center gap-2 text-xs font-mono font-bold"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        PAUSE
                      </button>
                    ) : (
                      <button
                        onClick={startVoice}
                        className="px-4 py-2 rounded-lg bg-neon-cyan text-slate-950 hover:bg-white transition-colors flex items-center gap-2 text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        PLAY VOICE
                      </button>
                    )}

                    <button
                      onClick={stopVoice}
                      className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                      title="Reset Stream"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Manual Navigation */}
                  <div className="flex items-center gap-1 bg-slate-900/60 rounded-lg p-1 border border-white/5">
                    <button
                      onClick={() => {
                        const prevIdx = Math.max(0, speechSentenceIndex - 1);
                        setSpeechSentenceIndex(prevIdx);
                        if (isPlayingVoice) {
                          speakSentence(prevIdx);
                        } else {
                          setTypedTextInSpeech(INTRO_SENTENCES[prevIdx]);
                        }
                      }}
                      disabled={speechSentenceIndex === 0}
                      className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs font-mono"
                    >
                      PREV
                    </button>
                    <span className="px-2 font-mono text-[10px] text-slate-500">
                      {speechSentenceIndex + 1} / {INTRO_SENTENCES.length}
                    </span>
                    <button
                      onClick={() => {
                        const nextIdx = Math.min(INTRO_SENTENCES.length - 1, speechSentenceIndex + 1);
                        setSpeechSentenceIndex(nextIdx);
                        if (isPlayingVoice) {
                          speakSentence(nextIdx);
                        } else {
                          setTypedTextInSpeech(INTRO_SENTENCES[nextIdx]);
                        }
                      }}
                      disabled={speechSentenceIndex === INTRO_SENTENCES.length - 1}
                      className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs font-mono"
                    >
                      NEXT
                    </button>
                  </div>

                  {/* Audio Mode Controls */}
                  <button
                    onClick={() => {
                      const newMuted = !isMutedVoice;
                      setIsMutedVoice(newMuted);
                      logToTerminal(`SPEECH: Synthesis audio ${newMuted ? "MUTED" : "UNMUTED"}`);
                      
                      if (isPlayingVoice) {
                        if (newMuted) {
                          if (typeof window !== "undefined" && window.speechSynthesis) {
                            window.speechSynthesis.cancel();
                          }
                          if (fallbackTimerRef.current) {
                            clearTimeout(fallbackTimerRef.current);
                          }
                          // Run purely visual fallback typing transition
                          handleFallbackTransition(speechSentenceIndex);
                        } else {
                          // Restart speaking with voice
                          speakSentence(speechSentenceIndex);
                        }
                      }
                    }}
                    className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${isMutedVoice ? "border-amber-500/30 bg-amber-500/5 text-amber-500" : "border-white/10 text-slate-400 hover:text-white"}`}
                    title={isMutedVoice ? "Unmute Character Voice" : "Mute Character Voice (Text-only subtitles)"}
                  >
                    {isMutedVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                </div>

              </div>

            </div>

            {/* Bottom info section */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/50 border border-white/5 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed font-sans">
                <strong>Holographic Interactive Portal:</strong> This system uses Web Speech Synthesis technology to translate Mahendra's real-world mission and career achievements into an immersive, narrated digital companion dialogue.
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
