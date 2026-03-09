import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users,
  TrendingUp,
  Globe,
  Building2,
  Cpu,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Play,
  Briefcase,
  Menu,
  X,
  Sparkles,
  Zap,
  Award,
} from "lucide-react";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

// Startup data
const startups = [
  {
    id: 1,
    name: "GreenPlate",
    category: "Climate",
    description: "Sustainable packaging for cloud kitchens.",
    image: "/images/startup_greenplate.jpg",
  },
  {
    id: 2,
    name: "FinStack",
    category: "SaaS",
    description: "Embedded finance for Indian neobanks.",
    image: "/images/startup_finstack.jpg",
  },
  {
    id: 3,
    name: "CuraHome",
    category: "Health",
    description: "Post-operative care at home.",
    image: "/images/startup_curahome.jpg",
  },
  {
    id: 4,
    name: "BoltRun",
    category: "D2C",
    description: "Performance footwear for Indian roads.",
    image: "/images/startup_boltrun.jpg",
  },
  {
    id: 5,
    name: "AgriView",
    category: "Deep Tech",
    description: "Drone-based crop analytics.",
    image: "/images/startup_agriview.jpg",
  },
  {
    id: 6,
    name: "EduMap",
    category: "SaaS",
    description: "Career pathways for tier-2 colleges.",
    image: "/images/startup_edumap.jpg",
  },
];

const categories = ["All", "D2C", "SaaS", "Climate", "Health", "Deep Tech"];

const investorLogos = [
  { name: "Sequoia India", initials: "SQ" },
  { name: "Accel Partners", initials: "AC" },
  { name: "Blume Ventures", initials: "BV" },
  { name: "Matrix Partners", initials: "MX" },
  { name: "Lightspeed India", initials: "LS" },
  { name: "Tiger Global", initials: "TG" },
  { name: "SoftBank", initials: "SB" },
  { name: "Elevation Capital", initials: "EL" },
];

// Particle component for background effect
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.min(30, Math.floor(window.innerWidth / 50));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 212, 0, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(43, 127, 255, ${0.1 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(drawParticles);
    };

    resize();
    createParticles();
    drawParticles();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ opacity: 0.6 }}
    />
  );
};

// Animated counter hook
const useAnimatedCounter = (
  end: number,
  duration: number = 2000,
  start: number = 0,
) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (end - start) + start));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, end, duration, start]);

  return { count, ref };
};

// Stat item with animated counter
const StatItem = ({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) => {
  const { count, ref } = useAnimatedCounter(value, 2500);

  return (
    <div ref={ref} className="stat-item text-center">
      <div className="text-3xl lg:text-5xl font-bold text-[#FFD400] mb-1">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-white/60">{label}</div>
    </div>
  );
};

// Loading screen component
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.5,
              onComplete,
            });
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#0B0F17] flex flex-col items-center justify-center"
    >
      <div className="font-display text-4xl font-bold text-white mb-8 tracking-tight">
        Pitch<span className="text-[#FFD400]">Connect</span>
      </div>
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#2B7FFF] to-[#FFD400] rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="mt-4 text-white/50 text-sm font-mono-label">
        LOADING EXPERIENCE
      </div>
    </div>
  );
};

function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const foundersRef = useRef<HTMLDivElement>(null);
  const investorsRef = useRef<HTMLDivElement>(null);
  const fundingRef = useRef<HTMLDivElement>(null);
  const mentorshipRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  const filteredStartups =
    activeCategory === "All"
      ? startups
      : startups.filter((s) => s.category === activeCategory);

  // Custom cursor effect
  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });

      gsap.to(cursorDotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Show nav after scrolling past hero
    const handleScroll = () => {
      setNavVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Hero entrance animation
    const heroTl = gsap.timeline({ delay: 0.3 });

    heroTl
      .fromTo(
        ".hero-card",
        { opacity: 0, scale: 0.95, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" },
      )
      .fromTo(
        ".hero-headline span",
        { y: 80, opacity: 0, rotateX: -40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.04,
          ease: "power3.out",
        },
        "-=0.8",
      )
      .fromTo(
        ".hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      )
      .fromTo(
        ".hero-cta",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      )
      .fromTo(
        ".hero-label",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=1",
      );

    // Parallax effect for hero image
    gsap.to(".hero-card img", {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Scroll-triggered animations for sections
    const sections = [
      { ref: foundersRef, class: "founders" },
      { ref: investorsRef, class: "investors" },
      { ref: fundingRef, class: "funding" },
      { ref: mentorshipRef, class: "mentorship" },
      { ref: communityRef, class: "community" },
      { ref: howItWorksRef, class: "howitworks" },
    ];

    sections.forEach(({ ref, class: className }) => {
      if (!ref.current) return;

      // Parallax for section images
      gsap.to(`.${className}-card img`, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        `.${className}-card`,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        `.${className}-headline`,
        {
          opacity: 0,
          x:
            className === "investors" ||
            className === "mentorship" ||
            className === "howitworks"
              ? -60
              : 60,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        `.${className}-body`,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        `.${className}-label`,
        { opacity: 0, y: -15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    // Featured startups animation
    if (featuredRef.current) {
      gsap.fromTo(
        ".featured-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".category-chip",
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".startup-card-item",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }

    // About section animation
    if (aboutRef.current) {
      gsap.fromTo(
        ".about-text",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".about-image",
        { opacity: 0, x: 60, scale: 0.95, rotateY: 10 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          rotateY: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }

    // Contact section animation
    if (contactRef.current) {
      gsap.fromTo(
        ".contact-info",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".contact-form",
        { opacity: 0, y: 60, scale: 0.95, rotateX: 5 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }

    // Investor cards animation
    gsap.fromTo(
      ".investor-card",
      { opacity: 0, y: 40, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ".investors-grid",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // Who can apply cards animation
    gsap.fromTo(
      ".apply-card",
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ".apply-grid",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isLoading]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Custom cursor (desktop only) */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 rounded-full border border-[#FFD400]/50 pointer-events-none z-[9998] hidden lg:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 rounded-full bg-[#FFD400] pointer-events-none z-[9998] hidden lg:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      <div className="relative min-h-screen bg-[#0B0F17]">
        {/* Particle background */}
        <ParticleBackground />

        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Corner frame */}
        <div className="corner-frame" />

        {/* Chevron band */}
        <div className="chevron-band" />

        {/* Navigation */}
        <nav
          className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${navVisible ? "bg-[#0B0F17]/90 backdrop-blur-md py-4" : "py-6"}`}
        >
          <div className="px-6 lg:px-12 flex items-center justify-between">
            <div className="font-display text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFD400]" />
              PitchConnect
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection(foundersRef)}
                className="nav-link"
              >
                For Founders
              </button>
              <button
                onClick={() => scrollToSection(investorsRef)}
                className="nav-link"
              >
                For Investors
              </button>
              <button
                onClick={() => scrollToSection(featuredRef)}
                className="nav-link"
              >
                Startups
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="nav-link"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="btn-primary text-sm group"
              >
                Apply to Pitch
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          <div
            className={`lg:hidden absolute top-full left-0 right-0 bg-[#0B0F17]/98 backdrop-blur-md border-t border-white/10 transition-all duration-300 overflow-hidden ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="py-6 px-6 space-y-4">
              <button
                onClick={() => scrollToSection(foundersRef)}
                className="block w-full text-left text-white/80 py-3 hover:text-white hover:bg-white/5 rounded-lg px-4 transition-all"
              >
                For Founders
              </button>
              <button
                onClick={() => scrollToSection(investorsRef)}
                className="block w-full text-left text-white/80 py-3 hover:text-white hover:bg-white/5 rounded-lg px-4 transition-all"
              >
                For Investors
              </button>
              <button
                onClick={() => scrollToSection(featuredRef)}
                className="block w-full text-left text-white/80 py-3 hover:text-white hover:bg-white/5 rounded-lg px-4 transition-all"
              >
                Startups
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="block w-full text-left text-white/80 py-3 hover:text-white hover:bg-white/5 rounded-lg px-4 transition-all"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="btn-primary text-sm w-full justify-center mt-4"
              >
                Apply to Pitch
              </button>
            </div>
          </div>
        </nav>

        {/* Section 1: Hero */}
        <section
          ref={heroRef}
          className="section-pinned flex items-center justify-center min-h-screen"
        >
          <div className="hero-card card-stage w-[92vw] lg:w-[88vw] h-[70vh] lg:h-[64vh] mt-16 relative overflow-hidden group">
            <img
              src="/images/hero_stage_founder.jpg"
              alt="Founder pitching on stage"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/95 via-[#0B0F17]/70 to-transparent" />

            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-20 h-20 border border-[#FFD400]/20 rounded-full animate-pulse-slow" />
            <div
              className="absolute bottom-8 right-16 w-12 h-12 border border-[#2B7FFF]/20 rounded-full animate-pulse-slow"
              style={{ animationDelay: "1s" }}
            />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16">
              <div className="hero-label font-mono-label text-[#FFD400] mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                PITCHCONNECT PLATFORM
              </div>

              <h1
                className="hero-headline text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white max-w-3xl leading-[0.95] mb-6"
                style={{ perspective: "1000px" }}
              >
                {"PITCH YOUR STARTUP TO INDIA'S TOP INVESTORS"
                  .split(" ")
                  .map((word, i) => (
                    <span
                      key={i}
                      className="inline-block mr-[0.25em]"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {word}
                    </span>
                  ))}
              </h1>

              <p className="hero-sub text-lg lg:text-xl text-white/80 max-w-xl mb-8">
                Apply to pitch live. Get feedback, visibility, and funding.
              </p>

              <div className="hero-cta flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="btn-primary group"
                >
                  Apply to Pitch
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection(featuredRef)}
                  className="btn-secondary group"
                >
                  <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                  Explore Startups
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: For Founders */}
        <section
          ref={foundersRef}
          className="section-pinned flex items-center justify-center min-h-screen"
        >
          <div className="founders-card card-stage w-[92vw] lg:w-[88vw] h-[70vh] lg:h-[64vh] relative overflow-hidden group">
            <img
              src="/images/founder_laptop_glow.jpg"
              alt="Founder working"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0B0F17]/95 via-[#0B0F17]/60 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-center items-end text-right px-8 lg:px-16">
              <div className="founders-label font-mono-label text-[#FFD400] mb-6 flex items-center gap-2 justify-end">
                <Users className="w-4 h-4" />
                FOR FOUNDERS
              </div>

              <h2 className="founders-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white max-w-2xl leading-[0.95] mb-6">
                BUILT FOR EARLY‑STAGE FOUNDERS
              </h2>

              <p className="founders-body text-lg text-white/80 max-w-lg">
                Pre-seed to Series A. D2C, SaaS, climate, health, and deep tech.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: For Investors */}
        <section
          ref={investorsRef}
          className="section-pinned flex items-center justify-center min-h-screen"
        >
          <div className="investors-card card-stage w-[92vw] lg:w-[88vw] h-[70vh] lg:h-[64vh] relative overflow-hidden group">
            <img
              src="/images/investor_reviewing_deal.jpg"
              alt="Investor reviewing deal"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/95 via-[#0B0F17]/60 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16">
              <div className="investors-label font-mono-label text-[#FFD400] mb-6 flex items-center gap-2">
                <Award className="w-4 h-4" />
                FOR INVESTORS
              </div>

              <h2 className="investors-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white max-w-2xl leading-[0.95] mb-6">
                CURATED DEALS FOR INVESTORS
              </h2>

              <p className="investors-body text-lg text-white/80 max-w-lg">
                Verified pitches. Clean data rooms. Warm intros to founders.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Funding + Visibility */}
        <section
          ref={fundingRef}
          className="section-pinned flex items-center justify-center min-h-screen"
        >
          <div className="funding-card card-stage w-[92vw] lg:w-[88vw] h-[70vh] lg:h-[64vh] relative overflow-hidden group">
            <img
              src="/images/team_collaboration.jpg"
              alt="Team collaboration"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0B0F17]/95 via-[#0B0F17]/60 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-center items-end text-right px-8 lg:px-16">
              <div className="funding-label font-mono-label text-[#FFD400] mb-6 flex items-center gap-2 justify-end">
                <TrendingUp className="w-4 h-4" />
                WHAT YOU GET
              </div>

              <h2 className="funding-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white max-w-2xl leading-[0.95] mb-6">
                FUNDING, VISIBILITY, AND PRESS
              </h2>

              <p className="funding-body text-lg text-white/80 max-w-lg">
                Get in front of angels, VCs, and media. Turn one pitch into a
                month of momentum.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Mentorship */}
        <section
          ref={mentorshipRef}
          className="section-pinned flex items-center justify-center min-h-screen"
        >
          <div className="mentorship-card card-stage w-[92vw] lg:w-[88vw] h-[70vh] lg:h-[64vh] relative overflow-hidden group">
            <img
              src="/images/mentor_teaching.jpg"
              alt="Mentor teaching"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/95 via-[#0B0F17]/60 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-16">
              <div className="mentorship-label font-mono-label text-[#FFD400] mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                WHAT YOU GET
              </div>

              <h2 className="mentorship-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white max-w-2xl leading-[0.95] mb-6">
                MENTORSHIP THAT MOVES THE NEEDLE
              </h2>

              <p className="mentorship-body text-lg text-white/80 max-w-lg">
                Weekly office hours. GTM playbooks. Investor intros that
                actually reply.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Community */}
        <section
          ref={communityRef}
          className="section-pinned flex items-center justify-center min-h-screen"
        >
          <div className="community-card card-stage w-[92vw] lg:w-[88vw] h-[70vh] lg:h-[64vh] relative overflow-hidden group">
            <img
              src="/images/audience_event.jpg"
              alt="Community event"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0B0F17]/95 via-[#0B0F17]/60 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-center items-end text-right px-8 lg:px-16">
              <div className="community-label font-mono-label text-[#FFD400] mb-6 flex items-center gap-2 justify-end">
                <Globe className="w-4 h-4" />
                COMMUNITY
              </div>

              <h2 className="community-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white max-w-2xl leading-[0.95] mb-6">
                JOIN A FOUNDER COMMUNITY THAT SHOWS UP
              </h2>

              <p className="community-body text-lg text-white/80 max-w-lg">
                Thousands of founders. Hundreds of pitches. One network that
                helps you scale.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: How It Works */}
        <section
          ref={howItWorksRef}
          className="section-pinned flex items-center justify-center min-h-screen"
        >
          <div className="howitworks-card card-stage w-[92vw] lg:w-[88vw] h-[70vh] lg:h-[64vh] relative overflow-hidden group">
            <img
              src="/images/founder_presenting_screen.jpg"
              alt="Founder presenting"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/98 via-[#0B0F17]/80 to-[#0B0F17]/60" />

            <div className="relative z-10 h-full flex flex-col lg:flex-row justify-between px-8 lg:px-16 py-12">
              <div className="flex flex-col justify-center max-w-xl">
                <div className="howitworks-label font-mono-label text-[#FFD400] mb-6 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  HOW IT WORKS
                </div>

                <h2 className="howitworks-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[0.95] mb-6">
                  APPLY. PITCH. RAISE.
                </h2>

                <p className="howitworks-body text-lg text-white/80">
                  Submit your deck. If selected, pitch live. Get feedback and
                  term sheets.
                </p>
              </div>

              <div className="flex flex-col justify-center mt-8 lg:mt-0">
                <div className="space-y-6">
                  {[
                    "Apply with your deck",
                    "Get shortlisted",
                    "Pitch to investors",
                    "Close your round",
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#FFD400] flex items-center justify-center text-[#0B0F17] font-bold text-lg group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#FFD400]/30 transition-all">
                        {i + 1}
                      </div>
                      <span className="text-white text-lg font-medium group-hover:text-[#FFD400] transition-colors">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Featured Startups */}
        <section ref={featuredRef} className="py-24 lg:py-32 px-6 lg:px-12">
          <div className="featured-header max-w-7xl mx-auto mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              FEATURED STARTUPS
            </h2>
            <p className="text-lg text-white/70 max-w-xl">
              A few teams that pitched, shipped, and scaled.
            </p>

            {/* Category chips */}
            <div className="flex flex-wrap gap-3 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-chip ${activeCategory === cat ? "active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Startup grid */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <div
                key={startup.id}
                className="startup-card-item startup-card group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={startup.image}
                    alt={startup.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FFD400] transition-colors">
                      {startup.name}
                    </h3>
                    <span className="text-xs font-mono-label text-[#FFD400]">
                      {startup.category}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-4">
                    {startup.description}
                  </p>
                  <button className="text-[#2B7FFF] text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                    View pitch <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9: Investors */}
        <section className="py-24 lg:py-32 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                INVESTORS ON OUR PLATFORM
              </h2>
              <p className="text-lg text-white/70 max-w-xl mx-auto">
                Connect with leading VCs, angels, and institutional investors
                from across India.
              </p>
            </div>

            <div className="investors-grid grid grid-cols-2 md:grid-cols-4 gap-6">
              {investorLogos.map((investor, i) => (
                <div
                  key={i}
                  className="investor-card bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-[#FFD400]/50 hover:bg-white/10 hover:scale-105 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2B7FFF] to-[#1a5fcc] flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:shadow-lg group-hover:shadow-[#2B7FFF]/30 transition-all">
                    {investor.initials}
                  </div>
                  <span className="text-white font-medium text-center">
                    {investor.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 10: About */}
        <section ref={aboutRef} className="py-24 lg:py-32 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="about-text">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  WE'RE BUILDING THE NEW STARTUP STAGE
                </h2>

                <div className="space-y-4 text-white/70 text-lg">
                  <p>
                    PitchConnect is a startup media platform that has shared
                    thousands of founder stories.
                  </p>
                  <p>
                    We run live pitch events, publish operator playbooks, and
                    connect builders to capital.
                  </p>
                  <p>
                    From metros to emerging hubs—if you're building, we want to
                    hear from you.
                  </p>
                </div>

                {/* Stats with animated counters */}
                <div className="grid grid-cols-3 gap-6 mt-12">
                  <StatItem value={2400} suffix="+" label="Pitches" />
                  <StatItem value={180} suffix="+" label="Events" />
                  <StatItem value={600} suffix="+" label="Investors" />
                </div>
              </div>

              <div className="about-image" style={{ perspective: "1000px" }}>
                <div className="card-stage overflow-hidden aspect-[4/3] group">
                  <img
                    src="/images/about_team_event.jpg"
                    alt="Team at event"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 11: Who Can Apply */}
        <section className="py-24 lg:py-32 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                WHO CAN APPLY
              </h2>
              <p className="text-lg text-white/70 max-w-xl mx-auto">
                We welcome startups from diverse sectors and stages.
              </p>
            </div>

            <div className="apply-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  label: "D2C Brands",
                },
                { icon: <Users className="w-8 h-8" />, label: "Consumer" },
                { icon: <Building2 className="w-8 h-8" />, label: "MSMEs" },
                { icon: <Cpu className="w-8 h-8" />, label: "SaaS" },
                {
                  icon: <Briefcase className="w-8 h-8" />,
                  label: "Manufacturing",
                },
                {
                  icon: <Globe className="w-8 h-8" />,
                  label: "Bharat-Focused",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="apply-card bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#FFD400]/50 hover:bg-white/10 hover:scale-105 transition-all cursor-pointer group"
                >
                  <div className="text-[#FFD400] mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-white font-medium text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 12: Contact */}
        <section
          ref={contactRef}
          className="py-24 lg:py-32 px-6 lg:px-12 bg-[#F6F7FB]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <div className="contact-info">
                <h2 className="text-4xl lg:text-5xl font-bold text-[#0B0F17] mb-4">
                  READY TO PITCH?
                </h2>
                <p className="text-lg text-[#0B0F17]/70 max-w-md mb-12">
                  Apply in 5 minutes. We review every deck.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#0B0F17] flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
                      <Mail className="w-5 h-5 text-[#FFD400] group-hover:text-[#0B0F17] transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0B0F17]/60">Email</div>
                      <div className="text-[#0B0F17] font-medium">
                        hello@pitchconnect.in
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#0B0F17] flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
                      <Phone className="w-5 h-5 text-[#FFD400] group-hover:text-[#0B0F17] transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0B0F17]/60">Phone</div>
                      <div className="text-[#0B0F17] font-medium">
                        +91 80 4601 8842
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#0B0F17] flex items-center justify-center group-hover:bg-[#FFD400] transition-colors">
                      <MapPin className="w-5 h-5 text-[#FFD400] group-hover:text-[#0B0F17] transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm text-[#0B0F17]/60">Locations</div>
                      <div className="text-[#0B0F17] font-medium">
                        Bangalore • Mumbai • Delhi NCR
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="contact-form bg-white rounded-3xl p-8 shadow-xl"
                style={{ perspective: "1000px" }}
              >
                <form
                  className="space-y-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0B0F17] mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2B7FFF] focus:ring-2 focus:ring-[#2B7FFF]/20 outline-none transition-all hover:border-gray-300"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B0F17] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2B7FFF] focus:ring-2 focus:ring-[#2B7FFF]/20 outline-none transition-all hover:border-gray-300"
                        placeholder="you@startup.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0B0F17] mb-2">
                        Startup Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2B7FFF] focus:ring-2 focus:ring-[#2B7FFF]/20 outline-none transition-all hover:border-gray-300"
                        placeholder="Your startup"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B0F17] mb-2">
                        Stage
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border text-gray-400 border-gray-200 focus:border-[#2B7FFF] focus:ring-2 focus:ring-[#2B7FFF]/20 outline-none transition-all bg-white hover:border-gray-300">
                        <option>Select stage</option>
                        <option>Ideation</option>
                        <option>MVP</option>
                        <option>Pre-seed</option>
                        <option>Seed</option>
                        <option>Series A</option>
                        <option>Series B+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0B0F17] mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2B7FFF] focus:ring-2 focus:ring-[#2B7FFF]/20 outline-none transition-all resize-none hover:border-gray-300"
                      placeholder="Tell us about your startup..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      type="submit"
                      className="btn-primary flex-1 justify-center group"
                    >
                      Submit Application
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 rounded-full font-medium text-[#0B0F17] border border-[#0B0F17]/20 hover:bg-[#0B0F17]/5 transition-all"
                    >
                      Partner With Us
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 lg:px-12 bg-[#0B0F17] border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#FFD400]" />
                PitchConnect
              </div>

              <div className="flex flex-wrap justify-center gap-8">
                <button
                  onClick={() => scrollToSection(foundersRef)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  For Founders
                </button>
                <button
                  onClick={() => scrollToSection(investorsRef)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  For Investors
                </button>
                <button
                  onClick={() => scrollToSection(featuredRef)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Startups
                </button>
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </div>

              <div className="text-white/40 text-sm">
                © 2026 PitchConnect. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
