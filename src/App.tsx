import { useState, useEffect, useRef, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dumbbell,
  Sparkles,
  Activity,
  Flame,
  Zap,
  TrendingUp,
  Apple,
  Users,
  BarChart3,
  UserCheck,
  Phone,
  MapPin,
  Clock,
  Send,
  Star,
  MessageSquare,
  Calendar,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  ArrowRight,
  Calculator,
  Lock,
  Instagram,
  Facebook,
  Youtube,
  CheckCircle2,
  Award,
  ChevronDown
} from 'lucide-react';
import {
  GYM_INFO,
  SERVICES,
  TRAINERS,
  PLANS,
  OFFERS,
  GALLERY,
  INITIAL_TESTIMONIALS,
  Service,
  Testimonial
} from './data';

export default function App() {
  // Navigation & UI States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // BMI Calculator States
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    advice: string;
    recommendedService: string;
    color: string;
  } | null>(null);

  // Gallery States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Testimonials Persistent State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 5 });
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  // Interactive Workout Recommender State
  const [selectedGoal, setSelectedGoal] = useState<string>('muscle');

  // Contact States
  const [contactForm, setContactForm] = useState({ name: '', phone: '', service: 'Strength Training', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Gym Open/Closed Status Logic
  const [gymStatus, setGymStatus] = useState<{ isOpen: boolean; message: string }>({
    isOpen: true,
    message: "Open Today"
  });

  // Track scroll position for header sticky styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section for nav highlighting
      const sections = ['home', 'about', 'services', 'trainers', 'pricing', 'gallery', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize and load testimonials from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('pulse_gym_testimonials');
    if (stored) {
      try {
        setTestimonials(JSON.parse(stored));
      } catch (e) {
        setTestimonials(INITIAL_TESTIMONIALS);
      }
    } else {
      setTestimonials(INITIAL_TESTIMONIALS);
      localStorage.setItem('pulse_gym_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
    }
  }, []);

  // Auto-slide Testimonials every 6 seconds
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  // Real-time Gym Status checker based on current time (Raipur, Indian Standard Time is UTC+5.30)
  // Our system's metadata contains Raipur timezone calculations
  useEffect(() => {
    const calculateOpenStatus = () => {
      // Create date object representing current Indian Standard Time
      const now = new Date();
      // UTC time offset
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      // Indian Standad Time is UTC + 5.5 hours
      const istTime = new Date(utc + (3600000 * 5.5));
      
      const day = istTime.getDay(); // 0: Sunday, 1: Mon, etc.
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const decimalTime = hours + minutes / 60;

      if (day === 0) {
        setGymStatus({
          isOpen: false,
          message: "CLOSED TODAY (SUNDAY) - WE REOPEN MONDAY 6:00 AM"
        });
        return;
      }

      // Business hours: 6:00 AM – 10:30 AM (6 to 10.5) and 5:00 PM – 10:00 PM (17 to 22)
      const isMorningSlot = decimalTime >= 6.0 && decimalTime <= 10.5;
      const isEveningSlot = decimalTime >= 17.0 && decimalTime <= 22.0;

      if (isMorningSlot || isEveningSlot) {
        setGymStatus({
          isOpen: true,
          message: "GYM IS OPEN NOW! PUSH YOUR LIMITS!"
        });
      } else {
        let nextOpen = "5:00 PM Today";
        if (decimalTime > 22.0) {
          nextOpen = "Tomorrow 6:00 AM";
        } else if (decimalTime < 6.0) {
          nextOpen = "6:00 AM Today";
        } else if (decimalTime > 10.5 && decimalTime < 17.0) {
          nextOpen = "5:00 PM Today";
        }
        setGymStatus({
          isOpen: false,
          message: `GYM IS CLOSED CURRENTLY - REOPENS AT ${nextOpen}`
        });
      }
    };

    calculateOpenStatus();
    const statusInterval = setInterval(calculateOpenStatus, 60000); // Check once a minute
    return () => clearInterval(statusInterval);
  }, []);

  // Filter gallery items
  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'All') return GALLERY;
    return GALLERY.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  // Compute BMI
  const handleCalculateBmi = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to meters
    
    if (isNaN(w) || isNaN(h) || h <= 0 || w <= 0) return;

    const bmi = parseFloat((w / (h * h)).toFixed(1));
    let category = '';
    let advice = '';
    let recommendedService = '';
    let color = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'Focus on high-protein nutrition, progressive resistance, and strength hypertrophy sessions to build healthy, functional muscle mass.';
      recommendedService = 'Muscle Building & Strength Training';
      color = 'text-blue-400';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Healthy Weight';
      advice = 'Incredible balance! Maintain your optimal metabolic performance through regular athletic conditioning, functional fitness, and lean strength exercises.';
      recommendedService = 'Functional Training & Body Transformation';
      color = 'text-green-400';
    } else if (bmi >= 24.9 && bmi < 29.9) {
      category = 'Overweight';
      advice = 'Enhance caloric expenditure and preserve lean muscle block with intensive high-intensity interval training, full-body cardiovascular circuits, and structural body transformations.';
      recommendedService = 'Weight Loss Programs & Cardio Training';
      color = 'text-yellow-400';
    } else {
      category = 'Obese';
      advice = 'Embark on a safer, structured path containing customized metabolic rate programs, joint-safe low-impact cardio, and calculated personal diet plan guidelines.';
      recommendedService = 'Body Transformation & Nutrition Guidance';
      color = 'text-brand-red';
    }

    setBmiResult({ bmi, category, advice, recommendedService, color });
  };

  // Run initial BMI calculation once
  useEffect(() => {
    handleCalculateBmi();
  }, []);

  // Handle Review Submission
  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;

    const reviewItem: Testimonial = {
      id: `custom-${Date.now()}`,
      name: newReview.name,
      rating: newReview.rating,
      text: newReview.text,
      date: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' // Generic premium avatar
    };

    const updated = [reviewItem, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('pulse_gym_testimonials', JSON.stringify(updated));
    setActiveTestimonialIndex(0);
    setNewReview({ name: '', text: '', rating: 5 });
    setReviewSuccessMessage('✨ Thank you! Your real-time review has been published below on our testimonial board.');
    
    setTimeout(() => {
      setReviewSuccessMessage('');
    }, 6000);
  };

  // Handle Contact Submit
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return;
    
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({ name: '', phone: '', service: 'Strength Training', message: '' });
    }, 5000);
  };

  // Generate WhatsApp Message Link for BMI Results
  const getBmiWhatsAppLink = () => {
    if (!bmiResult) return '';
    const text = `Hi Pulse Gym Mowa, I checked my BMI on your website. My score is ${bmiResult.bmi} (${bmiResult.category}). I'm looking forward to joining your "${bmiResult.recommendedService}" program. Please guide me through scheduling a free assessment.`;
    return `https://wa.me/919302972999?text=${encodeURIComponent(text)}`;
  };

  // Workout splits for Interactive Recommender
  const programSplits = {
    muscle: {
      title: 'Lean Hypertrophy Blueprint',
      frequency: '5 Days / Week',
      description: 'Engineered specifically for maximizing muscular tension, optimizing progressive overload, and packing on balanced dense size.',
      split: [
        { day: 'Mon', target: 'Push Focus (Chest, Shoulders & Triceps)' },
        { day: 'Tue', target: 'Pull Focus (Back, Rear Delts & Biceps)' },
        { day: 'Wed', target: 'Legs Development (Quads, Hamstrings & Calves)' },
        { day: 'Thu', target: 'Active Mobility & Stretching / Core' },
        { day: 'Fri', target: 'Upper Body Hypertrophy (Pump & Detailing)' },
        { day: 'Sat', target: 'Posterior Chain & Arms Blast' },
        { day: 'Sun', target: 'Complete Rest & Nutrient Syncing' }
      ]
    },
    weightloss: {
      title: 'Metabolic Shred System',
      frequency: '6 Days / Week',
      description: 'High mechanical output paired with high-intensity intervals to raise heart rate, burn deep visceral fat, and preserve lean tissue.',
      split: [
        { day: 'Mon', target: 'HIIT Cardio + Lower Body Strength Circuit' },
        { day: 'Tue', target: 'Upper Body Resistance Power-intervals' },
        { day: 'Wed', target: 'Fat-Shred Cycling & Core Inversion' },
        { day: 'Thu', target: 'Full Body Functional Metabolic Circuits' },
        { day: 'Fri', target: 'Cardiovascular Threshold Test + Plyometrics' },
        { day: 'Sat', target: 'Steady-State Cardio & Joint Rehabilitation' },
        { day: 'Sun', target: 'Rest Day / Recovery Steam' }
      ]
    },
    strength: {
      title: 'Absolute Powerlifting Protocol',
      frequency: '4 Days / Week',
      description: 'Neurological power focus designed around standard compound mechanical lifts, safety barbell setups, and peak bone-density density.',
      split: [
        { day: 'Mon', target: 'Heavy Bench Press & Auxiliaries' },
        { day: 'Tue', target: 'Maximum Back Squats & Core Foundations' },
        { day: 'Wed', target: 'Rest Day / Foam Rolling' },
        { day: 'Thu', target: 'Deatlift Lockouts & Posterior Accessory Block' },
        { day: 'Fri', target: 'Heavy Overhead Presses & Triceps Drive' },
        { day: 'Sat', target: 'Active Recovery Cardio & Stretching' },
        { day: 'Sun', target: 'Complete Rest / Nutrition Loading' }
      ]
    }
  };

  const activeRecommender = programSplits[selectedGoal as keyof typeof programSplits] || programSplits.muscle;

  // Handle active slide controls in carousel
  const nextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Helper to get service icon component
  const getServiceIcon = (iconName: string) => {
    const iconProps = { className: "w-6 h-6 text-brand-red group-hover:text-brand-orange transition-colors" };
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      case 'Activity': return <Activity {...iconProps} />;
      case 'UserCheck': return <UserCheck {...iconProps} />;
      case 'Flame': return <Flame {...iconProps} />;
      case 'Zap': return <Zap {...iconProps} />;
      case 'TrendingUp': return <TrendingUp {...iconProps} />;
      case 'Apple': return <Apple {...iconProps} />;
      case 'Users': return <Users {...iconProps} />;
      case 'BarChart3': return <BarChart3 {...iconProps} />;
      default: return <Dumbbell {...iconProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white font-poppins relative selection:bg-brand-red selection:text-white">
      
      {/* GLOWING AMBIENT BACKGROUNDS */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none -z-10 bg-radial-[circle_at_50%_-100px] from-[#ff2e2e1d] via-[#ff6b0005] to-transparent" />
      <div className="absolute top-[2200px] right-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10 bg-radial-[circle_at_90%_200px] from-[#ff6b0008] to-transparent" />
      <div className="absolute top-[4500px] left-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10 bg-radial-[circle_at_10%_300px] from-[#ff2e2e0a] to-transparent" />

      {/* FIXED TOP HEADER & STICKY NAVBAR */}
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-brand-dark/90 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#home" className="flex items-center space-x-3 group text-left">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red to-brand-orange flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Dumbbell className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-widest font-oswald text-white flex items-center">
                PULSE<span className="text-brand-red ml-1.5 group-hover:text-brand-orange transition-colors duration-300">GYM</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-inter font-semibold text-gray-500 group-hover:text-brand-gold transition-colors duration-300">
                MOWA • RAIPUR
              </span>
            </div>
          </a>

          {/* DESKTOP NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'services', label: 'Services' },
              { id: 'trainers', label: 'Coaches' },
              { id: 'pricing', label: 'Memberships' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'testimonials', label: 'Reviews' },
              { id: 'contact', label: 'Contact' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`text-sm font-medium tracking-wide transition-all duration-300 font-inter py-2 relative group uppercase hover:text-white ${
                  activeSection === link.id ? 'text-brand-red' : 'text-gray-400'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-brand-red to-brand-orange transition-all duration-300 ${
                    activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="#pricing"
              className="bg-brand-red hover:bg-brand-orange text-white text-xs font-semibold px-5 py-2.5 rounded-full uppercase tracking-wider font-inter transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-red/20 hover:shadow-brand-orange/20"
            >
              Join Now
            </a>
            <a
              href={`tel:${GYM_INFO.contact.replace(/\s+/g, '')}`}
              className="border border-white/10 hover:border-brand-red/40 hover:bg-white/5 text-white text-xs font-semibold px-4 py-2.5 rounded-full uppercase tracking-wider font-inter transition-all duration-300 flex items-center space-x-2"
            >
              <Phone className="w-3.5 h-3.5 text-brand-red" />
              <span>Call Coach</span>
            </a>
          </div>

          {/* MOBILE BURGER TOGGLE */}
          <div className="flex items-center lg:hidden space-x-3">
            {/* Live open indicator pill on mobile */}
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${gymStatus.isOpen ? 'bg-green-500' : 'bg-yellow-500'} animate-ping`} />
            
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWERS */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-brand-dark/95 border-b border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="px-4 pt-3 pb-6 space-y-2">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About Pulse Gym' },
                  { id: 'services', label: 'Services & Splits' },
                  { id: 'trainers', label: 'Meet Our Coaches' },
                  { id: 'pricing', label: 'Membership Plans' },
                  { id: 'gallery', label: 'Visual Gallery' },
                  { id: 'testimonials', label: 'Member Reviews' },
                  { id: 'contact', label: 'Contact & Map' }
                ].map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium tracking-wide uppercase font-inter transition-all ${
                      activeSection === link.id
                        ? 'bg-gradient-to-r from-brand-red/10 to-transparent text-brand-red border-l-4 border-brand-red'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 px-4">
                  <a
                    href="#pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-brand-red text-center text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs font-inter"
                  >
                    Enquire Now
                  </a>
                  <a
                    href={`tel:${GYM_INFO.contact.replace(/\s+/g, '')}`}
                    className="w-full border border-white/10 text-center text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs font-inter flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-red" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 1. HERO SECTION */}
      <section
        id="home"
        className="relative min-h-screen pt-24 pb-16 flex flex-col justify-center items-center overflow-hidden"
      >
        {/* Large overlay background poster image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920"
            alt="Pulse Gym Mowa Interior Background"
            className="w-full h-full object-cover opacity-15 filter grayscale contrast-125 scale-105 animate-[pulse_10s_infinite]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/40" />
        </div>

        {/* Real-Time Status Notification Banner */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full text-center mt-8 mb-6 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
          >
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${gymStatus.isOpen ? 'bg-green-500' : 'bg-brand-orange'} animate-pulse`} />
            <span className="text-xs font-semibold tracking-wider font-inter text-gray-300 uppercase">
              {gymStatus.message}
            </span>
          </motion.div>
        </div>

        {/* HERO CORE CONTENTS */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex flex-col items-center">
          <div className="text-center max-w-4xl">
            {/* Super premium pre-heading */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-sm sm:text-base font-bold font-inter tracking-[0.3em] text-brand-gold uppercase mb-4 text-center text-[#ffea79]"
            >
              🏋️ Raipur's Premier Strength & Performance Sanctuary
            </motion.h2>

            {/* Giant Title with premium fonts and high contrast gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bebas tracking-wide leading-tight text-white select-none text-center"
            >
              PUSH <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-orange to-brand-gold">HARDER.</span> <br className="hidden sm:block" />
              GET <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">STRONGER.</span>
            </motion.h1>

            {/* Sub-heading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-base sm:text-xl md:text-2xl text-gray-300 font-poppins leading-relaxed max-w-3xl mx-auto font-light"
            >
              Join <span className="text-brand-red font-semibold">Pulse Gym Mowa</span> and transform your fitness journey with Raipur's elite coaches, modern resistance machines, and customized muscle recomposition blueprints.
            </motion.p>

            {/* Premium CTA Buttons Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4 px-4"
            >
              <a
                href="#pricing"
                className="w-full sm:w-auto bg-gradient-to-r from-brand-red to-brand-orange hover:from-brand-orange hover:to-brand-red text-white font-bold px-8 py-4 px-10 rounded-xl uppercase tracking-wider text-sm font-inter transition-all duration-300 shadow-xl shadow-brand-red/20 transform hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-95 flex items-center justify-center space-x-2"
              >
                <Dumbbell className="w-5 h-5" />
                <span>Join Now</span>
              </a>
              
              <a
                href={`tel:${GYM_INFO.contact.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto border border-white/10 hover:border-brand-red/40 bg-white/[0.02] hover:bg-white/[0.06] text-white font-bold px-8 py-4 px-10 rounded-xl uppercase tracking-wider text-sm font-inter transition-all duration-300 flex items-center justify-center space-x-2 transform hover:-translate-y-1 hover:scale-105"
              >
                <Phone className="w-5 h-5 text-brand-red animate-bounce" />
                <span>Call Coach Now</span>
              </a>

              <a
                href="https://wa.me/919302972999?text=Hi,%20I%20am%20interested%20in%20joining%20Pulse%20Gym%20Mowa.%20Please%20share%20membership%20details."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto border border-green-500/20 hover:border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold px-8 py-4 rounded-xl uppercase tracking-wider text-sm font-inter transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5 text-green-400 fill-green-400/20" />
                <span>WhatsApp Now</span>
              </a>

              <a
                href="https://maps.app.goo.gl/B9Zka9dFzY96z9G58"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto border border-brand-gold/20 hover:border-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold font-bold px-8 py-4 rounded-xl uppercase tracking-wider text-sm font-inter transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MapPin className="w-5 h-5 text-brand-gold" />
                <span>Get Directions</span>
              </a>
            </motion.div>
          </div>

          {/* HIGH-ENERGY LIVE METRIC COUNTERS BLOCK */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-5xl mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                value: '4.1 ⭐',
                label: 'Google Rating',
                detail: 'Excellent Standards',
                icon: <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
              },
              {
                value: '121+ 📝',
                label: 'Google Reviews',
                detail: 'Trusted Reputation',
                icon: <MessageSquare className="w-5 h-5 text-brand-orange" />
              },
              {
                value: 'Elite 🎖️',
                label: 'Professional Coach List',
                detail: 'Result Oriented Guidance',
                icon: <UserCheck className="w-5 h-5 text-brand-red" />
              },
              {
                value: 'Modern 🏋️',
                label: 'Gym Equipment',
                detail: 'Heavy Cable Stations',
                icon: <Dumbbell className="w-5 h-5 text-brand-gold" />
              }
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 bg-[#121212]/80 border border-white/5 rounded-2xl flex flex-col items-center text-center backdrop-blur-md relative group hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 transition-all duration-500"
              >
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-2xl border-t border-r border-transparent group-hover:border-brand-red/50 transition-all duration-500" />
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-oswald font-bold text-white tracking-wide">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-300 font-inter mt-1">
                  {stat.label}
                </div>
                <div className="text-[10px] text-gray-500 font-inter mt-0.5">
                  {stat.detail}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT PULSE GYM MOWA */}
      <section id="about" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#0a0a0add] to-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual side with premium imagery stacking */}
            <div className="lg:col-span-5 relative group">
              {/* Highlight background light glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-brand-red to-brand-orange rounded-3xl blur-2xl opacity-15 group-hover:opacity-25 transition-opacity duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=870"
                  alt="Training Atmosphere at Pulse Gym Mowa"
                  className="w-full h-[380px] lg:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay card */}
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-brand-dark/90 backdrop-blur-xl border border-white/10 rounded-xl flex items-center space-x-4">
                  <div className="p-3 bg-brand-red/20 rounded-lg">
                    <Award className="w-8 h-8 text-brand-red" />
                  </div>
                  <div>
                    <h4 className="text-white font-oswald text-lg font-bold uppercase tracking-wider">Raipur's Reliable</h4>
                    <p className="text-gray-400 text-xs">Serving the local community in Dubey Colony, Mowa with pride.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct text side with bold design guidelines */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.3em] font-inter">
                ABOUT PULSE GYM MOWA
              </span>
              <h2 className="text-3xl sm:text-5xl font-bebas tracking-wider text-white mt-3 uppercase leading-tight">
                FUEL YOUR INNER ATHLETE. <br />
                BUILT ON PROGRESS.
              </h2>
              
              <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-orange mt-4 rounded-full" />

              <p className="mt-6 text-gray-300 text-base sm:text-lg leading-relaxed font-light font-poppins">
                Pulse Gym Mowa is recognized as one of the most trusted and energetic fitness centers in Raipur, Chhattisgarh. We actively support hundreds of members in transforming their physical wellness through structured progressive training, powerlifting, cardio programs, and consistent lifestyle adjustments.
              </p>

              <blockquote className="border-l-4 border-brand-red bg-white/[0.02] pl-4 py-3 my-6 italic text-gray-400 font-inter text-sm rounded-r-lg">
                "Our single focus is to deliver an elite-standard workout experience that remains highly affordable and welcoming. Strong communities yield healthier lives."
              </blockquote>

              <p className="text-gray-300 text-base leading-relaxed font-light font-poppins mb-6">
                Equipped with absolute high-grade mechanical cable machines, rows, free barbells, squat platforms, and interactive treadmills, we ensure every muscle tier is efficiently hit. No unnecessary fluff; just authentic, goal-oriented sweating.
              </p>

              {/* Dynamic list highlighting real amenities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {[
                  'Open Early Morning & Night Hours',
                  'Dedicated Free Weights Zone',
                  'Advanced Ventilation & High Airflow',
                  'Secure Locker & Shower Areas',
                  'High-Energy Custom Sound System',
                  'Affordable Premium Memberships'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand-red shrink-0" />
                    <span className="text-sm font-semibold text-gray-200 font-inter">{item}</span>
                  </div>
                ))}
              </div>

              {/* Instant Call CTA block */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#pricing"
                  className="bg-white text-brand-dark hover:bg-brand-red hover:text-white font-bold px-6 py-3.5 rounded-lg text-xs uppercase tracking-wider font-inter transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Explore plans</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                
                <a
                  href="https://wa.me/919302972999"
                  target="_blank"
                  aria-label="Direct Chat on WhatsApp"
                  rel="noreferrer"
                  className="border border-white/15 hover:border-green-500 hover:bg-green-500/10 text-white font-bold px-6 py-3.5 rounded-lg text-xs uppercase tracking-wider font-inter transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Chat with an advisor</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. PREMIUM SERVICES & CLASS REACTION SPLIT */}
      <section id="services" className="py-24 relative bg-brand-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.3em] font-inter">
              TAILORED PROGRAMS
            </span>
            <h2 className="text-4xl sm:text-6xl font-bebas tracking-wider text-white mt-3 uppercase leading-tight">
              ELITE SERVICES & CUSTOM DESIGNED SPLITS
            </h2>
            <p className="mt-4 text-gray-400 font-poppins text-sm sm:text-base font-light">
              Explore our range of premium training categories engineered by Raipur's athletic specialists to transform your physique.
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-brand-red to-brand-orange mx-auto mt-5 rounded-full" />
          </div>

          {/* INTERACTIVE COMPONENT: GOAL WORKOUT SPLIT GENERATOR */}
          <div className="mb-16 p-8 bg-brand-card border border-white/5 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-brand-red/10 to-transparent pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 text-left">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 mb-3">
                  <Calculator className="w-3.5 h-3.5 text-brand-red" />
                  <span className="text-[10px] text-brand-red font-bold uppercase tracking-wider font-inter">Interactive Tool</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-oswald font-heavy text-white uppercase tracking-wider">
                  Targeted Training Split Generator
                </h3>
                <p className="text-gray-400 text-sm mt-3 font-poppins leading-relaxed font-light">
                  Align your weekly calendar directly to your bodily outcomes. Click your specific athletic target to visualize your optimal training split immediately.
                </p>

                {/* Selective goal buttons */}
                <div className="flex flex-col space-y-2 mt-6">
                  {[
                    { id: 'muscle', label: '💪 Hypertrophy & Muscle Volume', desc: 'Accelerate muscular density' },
                    { id: 'weightloss', label: '🔥 Lean Shred & Visceral Loss', desc: 'Elevate heart rate output' },
                    { id: 'strength', label: '🏋️ Power & Compound Strength', desc: 'Focus strictly on compound physical force' }
                  ].map((goalItem) => (
                    <button
                      key={goalItem.id}
                      onClick={() => setSelectedGoal(goalItem.id)}
                      className={`p-3.5 rounded-xl text-left transition-all text-xs font-bold uppercase tracking-wider font-inter border ${
                        selectedGoal === goalItem.id
                          ? 'bg-gradient-to-r from-brand-red to-brand-orange border-transparent text-white shadow-lg'
                          : 'bg-brand-dark/50 border-white/5 text-gray-400 hover:border-brand-red/30 hover:text-white'
                      }`}
                    >
                      <div>{goalItem.label}</div>
                      <span className="text-[9px] lowercase opacity-70 block font-normal normal-case font-inter mt-0.5">
                        {goalItem.desc}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <a
                    href={`https://wa.me/919302972999?text=Hi, I am interested in joining your program for ${
                      selectedGoal === 'muscle' ? 'Muscle Building' : selectedGoal === 'weightloss' ? 'Weight Loss' : 'Strength Training'
                    }. Please share pricing details.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 text-brand-orange hover:text-brand-red text-xs font-bold uppercase tracking-wider font-inter mt-2 group"
                  >
                    <span>Enquire details of this split</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Show selected split dynamically */}
              <div className="lg:col-span-7 bg-brand-dark/85 p-6 sm:p-8 rounded-2xl border border-white/5 relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div>
                    <h4 className="text-brand-gold font-oswald text-lg font-bold uppercase tracking-wider">
                      {activeRecommender.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-inter mt-1">
                      Optimal Frequency: {activeRecommender.frequency}
                    </p>
                  </div>
                  <span className="text-[10px] bg-brand-red/15 text-brand-red px-3 py-1 rounded-full font-bold uppercase font-inter">
                    Verified Split
                  </span>
                </div>

                <p className="text-gray-300 text-xs font-poppins mb-6 leading-relaxed font-light italic">
                  "{activeRecommender.description}"
                </p>

                {/* Day splits list */}
                <div className="space-y-2.5">
                  {activeRecommender.split.map((dayObj, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-brand-red/20 transition-all text-xs"
                    >
                      <span className="font-bold text-brand-red font-inter uppercase w-12 shrink-0">
                        {dayObj.day}
                      </span>
                      <span className="text-gray-300 font-poppins text-left flex-1 pl-4">
                        {dayObj.target}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN 10 PREMIUM SERVICE CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group bg-brand-card border border-white/5 rounded-2xl overflow-hidden relative flex flex-col justify-between hover:border-brand-red/30 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-red/5"
              >
                {/* Standard header image inside each card */}
                <div className="relative h-48 overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent z-10" />
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating index label */}
                  <span className="absolute top-4 left-4 z-20 bg-brand-dark/85 text-[10px] text-gray-400 font-bold px-3 py-1 rounded-full font-inter uppercase py-1 border border-white/5">
                    Service {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Body details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      {/* Round logo containers */}
                      <div className="p-2.5 bg-white/[0.03] border border-white/10 rounded-lg shrink-0 group-hover:border-brand-red/40 transition-colors">
                        {getServiceIcon(service.iconName)}
                      </div>
                      <h3 className="text-xl font-oswald font-bold text-white uppercase tracking-wider group-hover:text-brand-orange transition-colors">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-xs sm:text-sm font-poppins leading-relaxed font-light mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-inter">
                      Induction Included
                    </span>
                    <a
                      href={`https://wa.me/919302972999?text=Hi, I want to inquire about your ${service.title} services near Mowa Raipur.`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full bg-white/[0.03] hover:bg-brand-red border border-white/10 hover:border-transparent text-gray-300 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. MEET OUR TRAINERS */}
      <section id="trainers" className="py-24 relative bg-gradient-to-b from-[#121212] to-brand-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.3em] font-inter">
              COACHING EXCELLENCE
            </span>
            <h2 className="text-4xl sm:text-6xl font-bebas tracking-wider text-white mt-3 uppercase">
              MEET OUR EXPERT COACHES
            </h2>
            <p className="mt-4 text-gray-400 font-poppins text-sm font-light">
              We recruit only certified coaching experts from Raipur who focus comprehensively on progress tracking, anatomy safety, and sustainable physical improvements.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-orange mx-auto mt-5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TRAINERS.map((trainer, i) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group bg-brand-card border border-white/5 hover:border-brand-red/30 rounded-2xl overflow-hidden relative transition-all duration-500 hover:shadow-2xl hover:shadow-brand-orange/5"
              >
                {/* Trainer Stack Photo */}
                <div className="relative h-[320px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/25 to-transparent z-10" />
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top filter grayscale contrast-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating Bio Tag */}
                  <span className="absolute top-4 right-4 z-20 bg-brand-dark/95 border border-white/10 text-[9px] text-brand-gold font-bold uppercase tracking-wider px-3 py-1 rounded-full font-inter">
                    ⭐ Lead Trainer
                  </span>
                </div>

                {/* Trainer Info Footer Block */}
                <div className="p-6">
                  <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-wide">
                    {trainer.name}
                  </h3>
                  <span className="text-xs font-bold text-brand-red uppercase tracking-wider font-inter block mt-1">
                    {trainer.role}
                  </span>
                  
                  <div className="my-4 h-[1px] bg-white/5" />

                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">
                      <span className="text-white font-semibold">Specialization:</span> {trainer.specialization}
                    </div>
                    <div className="text-xs text-gray-400">
                      <span className="text-white font-semibold">Experience Level: </span>
                      <span className="text-[#a2f7ab] font-bold bg-[#a2f7ab]/10 px-2 py-0.5 rounded-full text-[10px]">
                        {trainer.experience} Certified
                      </span>
                    </div>
                  </div>

                  {/* Social actions */}
                  <div className="mt-6 flex items-center justify-between">
                    <a
                      href={`https://wa.me/919302972999?text=Hi, I am interested in seeking personal training guidance with ${trainer.name}. Please share details.`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-white group-hover:text-brand-orange font-bold font-inter uppercase tracking-wide flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Inquire Session</span>
                      <ChevronRight className="w-3.5 h-3.5 truncate text-brand-red" />
                    </a>
                    
                    <div className="flex space-x-2">
                      <a href={trainer.instagram} className="p-1 px-2.5 rounded-lg bg-white/[0.03] hover:bg-gradient-to-tr hover:from-brand-red hover:to-brand-orange hover:text-white transition-all text-xs text-gray-400">
                        IG
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* INTERACTIVE COMPONENT: REAL-TIME PREMIUM BMI FITNESS CALCULATOR */}
      <section id="bmi-calculator" className="py-20 relative bg-brand-dark overflow-hidden border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-[#121212] to-brand-card p-6 sm:p-10 rounded-3xl border border-white/10 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-12 xl:col-span-5 text-left">
                <span className="text-brand-gold font-bold text-xs uppercase tracking-[0.2em] font-inter">
                  DIAGNOSTIC WORKBENCH
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bebas tracking-wider text-white mt-3 uppercase leading-tight">
                  KNOW YOUR STANDARDS. <br />
                  CALCULATE YOUR BMI INSTANTLY.
                </h2>
                <p className="mt-4 text-gray-400 font-poppins text-xs sm:text-sm font-light leading-relaxed">
                  Enter your corresponding structural weight and standing length metrics. Our real-time medical-standard calculation index computes physical BMI categories immediately and recommends matching gym training splits automatically.
                </p>

                {/* Informative diagnostics */}
                <div className="mt-6 space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Underweight</span>
                    <span className="text-blue-400 font-semibold font-mono">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Healthy Weight Range</span>
                    <span className="text-green-400 font-semibold font-mono">18.5 – 24.9</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Overweight Block</span>
                    <span className="text-yellow-400 font-semibold font-mono">24.9 – 29.9</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Obesity Threshold</span>
                    <span className="text-brand-red font-semibold font-mono">&gt; 29.9</span>
                  </div>
                </div>
              </div>

              {/* Calculator Widget form */}
              <div className="lg:col-span-12 xl:col-span-7 bg-brand-dark/80 p-6 sm:p-8 rounded-2xl border border-white/5">
                <form onSubmit={handleCalculateBmi} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bmi-weight-input" className="block text-xs font-bold uppercase tracking-wider text-gray-400 font-inter mb-2">
                      Weight in Kilograms (KG)
                    </label>
                    <div className="relative">
                      <input
                        id="bmi-weight-input"
                        type="number"
                        min="20"
                        max="300"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white font-mono text-sm focus:border-brand-red focus:outline-none transition-colors"
                        required
                        placeholder="e.g. 72"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">KG</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bmi-height-input" className="block text-xs font-bold uppercase tracking-wider text-gray-400 font-inter mb-2">
                      Height in Centimeters (CM)
                    </label>
                    <div className="relative">
                      <input
                        id="bmi-height-input"
                        type="number"
                        min="80"
                        max="260"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white font-mono text-sm focus:border-brand-red focus:outline-none transition-colors"
                        required
                        placeholder="e.g. 175"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">CM</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => handleCalculateBmi()}
                      className="w-full bg-gradient-to-r from-brand-red to-brand-orange text-white font-bold p-4 rounded-xl text-xs uppercase tracking-wider font-inter transition-all hover:opacity-95 text-center cursor-pointer"
                    >
                      Calculate Dynamic BMI & Find My Routine
                    </button>
                  </div>
                </form>

                {/* Animated real-time diagnostic outcomes display */}
                {bmiResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-5 bg-white/[0.02] border border-brand-red/10 rounded-xl text-left"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-inter">Your Exact Score</span>
                        <div className="text-3xl font-oswald font-heavy tracking-wide text-white flex items-baseline">
                          <span>{bmiResult.bmi}</span>
                          <span className="text-xs uppercase font-medium text-gray-400 font-inter ml-1">Index Units</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-inter block">Category</span>
                        <span className={`text-base sm:text-lg font-bold uppercase font-oswald ${bmiResult.color}`}>
                          {bmiResult.category}
                        </span>
                      </div>
                    </div>

                    <div className="my-3">
                      <span className="text-[10px] text-[#ffdd52] uppercase tracking-widest font-inter block mb-1">
                        👉 Recommended Program Target
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white uppercase font-inter">
                        {bmiResult.recommendedService}
                      </span>
                    </div>

                    <p className="text-gray-400 text-xs font-poppins leading-relaxed font-light">
                      {bmiResult.advice}
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] text-gray-500 font-inter italic">
                        Want 1-on-1 counselor advice?
                      </span>
                      <a
                        href={getBmiWhatsAppLink()}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-lg text-[10px] uppercase font-inter tracking-wider transition-all flex items-center space-x-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white/10" />
                        <span>Share Results to Coach via WhatsApp</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. MEMBERSHIP PRICING PLANS */}
      <section id="pricing" className="py-24 relative bg-[#121212] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.3em] font-inter">
              MEMBERSHIP PLANS
            </span>
            <h2 className="text-4xl sm:text-6xl font-bebas tracking-wider text-white mt-3 uppercase leading-tight">
              COMMITTED TO RESULTS
            </h2>
            <p className="mt-4 text-gray-400 font-poppins text-sm font-light">
              Choose an access rhythm that matches your long term lifestyle target. No high-pressure contracts. Premium physical equipment provided for all.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-orange mx-auto mt-5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-brand-card border rounded-3xl p-8 flex flex-col justify-between relative transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl ${
                  plan.isPopular
                    ? 'border-brand-red/60 shadow-xl shadow-brand-red/5'
                    : 'border-white/5'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-red to-brand-orange text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    ✨ MOST POPULAR SAVER
                  </span>
                )}

                <div>
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest font-inter block mb-1">
                    {plan.duration}
                  </span>
                  
                  <h3 className="text-2xl sm:text-3xl font-oswald font-heavy text-white uppercase tracking-wider mt-1">
                    {plan.title}
                  </h3>

                  <div className="my-6 flex flex-col pt-4 border-t border-white/5">
                    <span className="text-gray-400 text-[10px] uppercase font-inter tracking-widest">Pricing Structure</span>
                    <span className="text-3xl font-oswald font-bold text-white uppercase mt-1 tracking-wide">
                      Contact for Pricing
                    </span>
                    <span className="text-xs text-gray-500 font-inter mt-1 italic">
                      Highly affordable student & couple packages available
                    </span>
                  </div>

                  <div className="my-6 h-[1px] bg-white/5" />

                  {/* Bullet features */}
                  <ul className="space-y-3.5 mb-10 text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#79ff8c] shrink-0 mt-0.5" />
                        <span className="font-poppins font-light leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-auto border-t border-white/5">
                  <a
                    href={`https://wa.me/919302972999?text=Hi, I am interested in inquiring about pricing and slots for the ${plan.title} package at Pulse Gym Mowa Raipur.`}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full text-center block font-bold py-4 rounded-xl text-xs uppercase tracking-wider font-inter transition-all duration-300 ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-brand-red to-brand-orange hover:from-brand-orange hover:to-brand-red text-white shadow-xl shadow-brand-red/10'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10'
                    }`}
                  >
                    Enquire Now
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. MEMBERSHIP RENEWAL SECTION */}
      <section id="renewal" className="py-20 relative bg-brand-dark overflow-hidden border-t border-b border-white/5">
        <div className="absolute inset-0 bg-radial-[circle_at_10%_30%] from-[#ff2e2e04] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="bg-brand-card border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-gradient-to-r from-brand-red to-brand-orange rounded-xl shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>

            <div className="max-w-2xl mx-auto mt-4">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.2em] font-inter">
                EXISTING MEMBERS PASSAGE
              </span>
              <h2 className="text-3xl sm:text-4xl font-bebas tracking-wider text-white mt-3 uppercase">
                RENEW YOUR MEMBERSHIP INSTANTLY
              </h2>
              <p className="mt-4 text-gray-400 font-poppins text-xs sm:text-sm font-light leading-relaxed">
                Running busy with heavy schedules? Skip the desk lineup paper processes. Active or past members of Pulse Gym Mowa can immediately process renewals digitally over simple WhatsApp confirmation tags.
              </p>

              <div className="my-8 flex justify-center">
                <a
                  href="https://wa.me/919302972999?text=Hi,%20I%20would%20like%20to%20renew%20my%20Pulse%20Gym%20Mowa%20membership.%20Please%20share%20the%20renewal%20details."
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-5 rounded-2xl uppercase tracking-wider text-xs sm:text-sm font-inter transition-all scale-100 hover:scale-105 duration-300 shadow-xl shadow-green-500/10 flex items-center justify-center space-x-3"
                >
                  <MessageSquare className="w-5 h-5 fill-white/10" />
                  <span>Renew Membership via WhatsApp</span>
                </a>
              </div>

              <p className="text-[10.5px] text-gray-500 font-inter font-medium uppercase tracking-widest leading-relaxed">
                🕒 Desk managers will share immediate secure QR scan codes directly to process your payment quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC OFFERS & UP-TO-DATE PROMOTIONS */}
      <section id="offers" className="py-24 relative bg-[#121212] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-gold font-bold text-xs uppercase tracking-[0.3em] font-inter">
              PROMOTIONS & BUMPERS
            </span>
            <h2 className="text-4xl sm:text-6xl font-bebas tracking-wider text-white mt-3 uppercase">
              ACTIVE SEASONAL OFFERS
            </h2>
            <p className="mt-4 text-gray-400 font-poppins text-sm font-light">
              Claim our active special pricing bonuses and complimentary wellness slots before slots expire this week.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-orange mx-auto mt-5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {OFFERS.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-brand-card border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-brand-orange/40 transition-all duration-300"
              >
                {/* Visual glow element behind */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-radial-gradient from-brand-orange/5 to-transparent pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-brand-orange font-bold uppercase tracking-widest font-inter">
                      {offer.tag}
                    </span>
                    <span className="text-[10px] bg-brand-red/15 text-brand-red font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-inter">
                      {offer.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-oswald font-bold text-white uppercase tracking-wider mt-4">
                    {offer.title}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm font-poppins font-light leading-relaxed mt-3">
                    {offer.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-gray-500 font-mono">
                    ⏰ {offer.expiry}
                  </span>
                  <a
                    href={`https://wa.me/919302972999?text=Hi, I would like to claim the "${offer.title}" promotional pricing package.`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-orange font-bold font-inter uppercase tracking-wide flex items-center space-x-1 hover:text-brand-red transition-all"
                  >
                    <span>Claim Promo Code</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. GALLERY SECTION WITH LIGHTBOX FILTER */}
      <section id="gallery" className="py-24 relative bg-brand-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.3em] font-inter">
              VISUAL TOUR
            </span>
            <h2 className="text-4xl sm:text-6xl font-bebas tracking-wider text-white mt-3 uppercase">
              PULSE GYM WORKOUT GALLERY
            </h2>
            <p className="mt-4 text-gray-400 font-poppins text-sm font-light">
              Catch a glimpse of our authentic training environments, heavy lifting platforms, and interactive cardio zones.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-orange mx-auto mt-5 rounded-full" />
          </div>

          {/* Filtering buttons row */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {['All', 'Strength', 'Cardio', 'Equipment', 'Workouts', 'Transformations'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider font-inter transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-red text-white shadow-lg'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery image grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, index) => {
                // Find actual global index in full GALLERY array
                const globalIndex = GALLERY.findIndex(g => g.id === item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setActiveImageIndex(globalIndex)}
                    className="group relative h-72 rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-brand-red/40 transition-colors bg-brand-card shrink-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Caption on zoom hover */}
                    <div className="absolute bottom-5 left-5 right-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[9px] bg-brand-orange text-white font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-inter">
                        {item.category}
                      </span>
                      <h4 className="text-white font-oswald text-base font-bold uppercase tracking-wide mt-2">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-inter uppercase tracking-widest mt-0.5">
                        ➕ Tap to Expand Image
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {activeImageIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-2xl flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
            >
              <button
                id="lightbox-close"
                onClick={() => setActiveImageIndex(null)}
                className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-brand-red rounded-full text-white transition-all transform hover:scale-105 cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                id="lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => prev !== null ? (prev - 1 + GALLERY.length) % GALLERY.length : null);
                }}
                className="absolute left-6 p-3 bg-white/5 hover:bg-brand-red rounded-full text-white transition-all transform hover:scale-105 cursor-pointer hidden sm:block"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={GALLERY[activeImageIndex].image}
                  alt={GALLERY[activeImageIndex].title}
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                
                <div className="text-center mt-4">
                  <span className="text-[10px] bg-brand-orange text-white font-bold uppercase tracking-widest px-3 py-1 rounded-full font-inter">
                    {GALLERY[activeImageIndex].category}
                  </span>
                  <h3 className="text-xl font-oswald text-white uppercase tracking-wider mt-2.5 font-bold">
                    {GALLERY[activeImageIndex].title}
                  </h3>
                  <p className="text-xs text-gray-500 font-inter mt-1">
                    Image {activeImageIndex + 1} of {GALLERY.length}
                  </p>
                </div>
              </div>

              <button
                id="lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => prev !== null ? (prev + 1) % GALLERY.length : null);
                }}
                className="absolute right-6 p-3 bg-white/5 hover:bg-brand-red rounded-full text-white transition-all transform hover:scale-105 cursor-pointer hidden sm:block"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Bottom Swipe hint helper for responsive viewports */}
              <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-500 font-inter uppercase tracking-wide sm:hidden">
                Tap Screen edges to cycle images
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 9. REVIEWS & TESTIMONIAL CAROUSEL + LIVE SUBMISSION */}
      <section id="testimonials" className="py-24 relative bg-[#121212] overflow-hidden">
        <div className="absolute inset-0 bg-radial-[circle_at_90%_80%] from-[#ff6b0003] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.3em] font-inter">
                COMMUNITY VOICE
              </span>
              <h2 className="text-4xl sm:text-5xl font-bebas tracking-wider text-white mt-3 uppercase leading-none">
                MEMBER TRANSFORMATIONS & TRUST
              </h2>
              
              <div className="flex items-center space-x-3 mt-6">
                <div className="text-5xl font-oswald font-bold text-white">4.1</div>
                <div>
                  <div className="flex space-x-0.5">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                    ))}
                    <Star className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-inter">
                    ⭐ Based on 121 Unbiased Google Reviews
                  </div>
                </div>
              </div>

              <p className="mt-6 text-gray-400 text-sm leading-relaxed font-light">
                Authentic, verifiable reviews left by working professionals, athletes, and fitness developers around Dubey colony, Raipur. All reviews are real and unfiltered.
              </p>

              {/* LIVE REVIEW SUBMISSION FORM BLOCK */}
              <div className="mt-10 p-6 bg-brand-dark/90 rounded-2xl border border-white/5 text-left">
                <h3 className="text-lg font-oswald font-heavy text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-brand-red" />
                  <span>Leave a Real-Time Review</span>
                </h3>

                {reviewSuccessMessage && (
                  <div className="mb-4 p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-inter leading-relaxed">
                    {reviewSuccessMessage}
                  </div>
                )}

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="review-name" className="block text-[10px] font-bold text-gray-400 uppercase font-inter mb-1">
                        Your Full Name
                      </label>
                      <input
                        id="review-name"
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-red"
                        placeholder="Alok Verma"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="review-rating" className="block text-[10px] font-bold text-gray-400 uppercase font-inter mb-1">
                        Select Rating Stars
                      </label>
                      <select
                        id="review-rating"
                        value={newReview.rating}
                        onChange={(e) => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-red"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 Star Optimal)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 Star Excellent)</option>
                        <option value={3}>⭐⭐⭐ (3 Star Standard)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="review-text" className="block text-[10px] font-bold text-gray-400 uppercase font-inter mb-1">
                      Write your experience honestly
                    </label>
                    <textarea
                      id="review-text"
                      rows={2}
                      value={newReview.text}
                      onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-red resize-none"
                      placeholder="Excellent gym atmosphere, clean workouts..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-brand-red to-brand-orange text-white font-bold p-3 rounded-xl text-[10px] uppercase font-inter tracking-wider transition-all hover:scale-102"
                  >
                    Submit Live Google Review
                  </button>
                </form>
              </div>
            </div>

            {/* Testimonials Slide Area */}
            <div className="lg:col-span-7">
              <div className="bg-brand-card p-8 sm:p-12 rounded-3xl border border-white/5 relative shadow-inner">
                
                {/* Carousel core rendering */}
                {testimonials.length > 0 && (
                  <div className="min-h-[220px] flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center space-x-1.5 text-brand-gold mb-6">
                        {Array.from({ length: testimonials[activeTestimonialIndex].rating }).map((_, st) => (
                          <Star key={st} className="w-5 h-5 fill-brand-gold text-brand-gold shrink-0" />
                        ))}
                      </div>

                      <p className="text-white text-base sm:text-lg font-light font-poppins leading-relaxed italic">
                        "{testimonials[activeTestimonialIndex].text}"
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={testimonials[activeTestimonialIndex].avatar}
                          alt={testimonials[activeTestimonialIndex].name}
                          className="w-12 h-12 rounded-full object-cover border border-brand-red/30"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-white font-inter font-bold text-sm">
                            {testimonials[activeTestimonialIndex].name}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {testimonials[activeTestimonialIndex].date} via Website Reviewer
                          </span>
                        </div>
                      </div>

                      {/* Manual Arrow Nav Actions */}
                      <div className="flex space-x-2">
                        <button
                          id="review-prev"
                          onClick={prevTestimonial}
                          className="p-2.5 rounded-lg bg-brand-dark hover:bg-brand-red border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                          aria-label="Previous Testimonial"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          id="review-next"
                          onClick={nextTestimonial}
                          className="p-2.5 rounded-lg bg-brand-dark hover:bg-brand-red border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                          aria-label="Next Testimonial"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. BUSINESS HOURS & SCHEDULES */}
      <section id="hours" className="py-24 relative bg-brand-dark overflow-hidden border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.3em] font-inter">
              TIMINGS SHEET
            </span>
            <h2 className="text-4xl sm:text-6xl font-bebas tracking-wider text-white mt-3 uppercase">
              WORKOUT OPERATIONAL HOURS
            </h2>
            <p className="mt-4 text-gray-400 font-poppins text-sm font-light">
              We structure morning and evening splits to prevent overcrowding and allow dedicated machine usage.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-orange mx-auto mt-5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Weekday Card */}
            <div className="bg-brand-card p-8 rounded-3xl border border-brand-red/10 relative overflow-hidden group hover:border-brand-red/40 transition-colors">
              <div className="absolute top-0 right-0 w-20 h-20 bg-radial-gradient from-brand-red/5 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <span className="text-[10px] bg-brand-red/15 text-brand-red px-3 py-1 rounded-full font-bold uppercase font-inter tracking-wider">
                  Operational Days
                </span>
                <Clock className="w-5 h-5 text-brand-red" />
              </div>

              <h3 className="text-2xl font-oswald font-heavy text-white uppercase tracking-wider mb-2">
                Monday to Saturday
              </h3>
              
              <div className="my-6 space-y-4">
                <div className="flex justify-between items-center bg-brand-dark/60 p-3.5 rounded-xl border border-white/5">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-inter">Morning Batch</span>
                  <span className="text-[13px] font-bold text-brand-gold font-mono uppercase tracking-wide">
                    6:00 AM – 10:30 AM
                  </span>
                </div>

                <div className="flex justify-between items-center bg-brand-dark/60 p-3.5 rounded-xl border border-white/5">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-inter">Evening Batch</span>
                  <span className="text-[13px] font-bold text-brand-gold font-mono uppercase tracking-wide">
                    5:00 PM – 10:00 PM
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 font-poppins leading-relaxed pt-2">
                📢 Desk advisory services and personal trainer inductive programs are active during above batches.
              </p>
            </div>

            {/* Sunday Card */}
            <div className="bg-brand-card p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <span className="text-[10px] bg-white/[0.05] text-gray-400 px-3 py-1 rounded-full font-bold uppercase font-inter tracking-wider">
                    Weekly Rest
                  </span>
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>

                <h3 className="text-2xl font-oswald font-heavy text-gray-400 uppercase tracking-wider mb-2">
                  Sunday Closed
                </h3>

                <p className="text-gray-400 text-xs sm:text-sm font-poppins font-light leading-relaxed my-6 bg-brand-dark/60 p-4 rounded-xl border border-white/5 italic">
                  "Muscle tissue repair occurs strictly during deep rest windows. We utilize Sundays to fully sanitize active gym zones and service mechanical cables."
                </p>
              </div>

              <p className="text-[10px] text-brand-red font-semibold font-inter uppercase tracking-widest">
                💪 Reopens Monday Sharp morning at 6:00 AM
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 11. UNIFIED CORE CONTACT CARD & LOCATIONS MAP */}
      <section id="contact" className="py-24 relative bg-[#121212] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange font-bold text-xs uppercase tracking-[0.3em] font-inter">
              LOCATE AN CHAT
            </span>
            <h2 className="text-4xl sm:text-6xl font-bebas tracking-wider text-white mt-3 uppercase">
              VISIT THE SANCTUARY
            </h2>
            <p className="mt-4 text-gray-400 font-poppins text-sm font-light">
              We are located perfectly in front of Shubhkamna Hospital in Dubey Colony, Raipur. Give us a walk-in visit to review files first hand.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-brand-red to-brand-orange mx-auto mt-5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
            
            {/* Form Section */}
            <div className="lg:col-span-5 bg-brand-card p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-oswald font-heavy text-white uppercase tracking-wider mb-6">
                  Send a Direct Message
                </h3>

                {contactSuccess && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-inter rounded-xl">
                    ✨ Your details have been transmitted! A Pulse Gym advisor will call or text your phone number shortly.
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[10px] font-bold text-gray-400 uppercase font-inter mb-1">
                      Your Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-red"
                      placeholder="e.g. Rahul Sharma"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-[10px] font-bold text-gray-400 uppercase font-inter mb-1">
                      Phone Number / WHATSAPP NUMBER
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-red"
                      placeholder="e.g. 093029 72999"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-service" className="block text-[10px] font-bold text-gray-400 uppercase font-inter mb-1">
                      Select Program of Interest
                    </label>
                    <select
                      id="contact-service"
                      value={contactForm.service}
                      onChange={(e) => setContactForm(prev => ({ ...prev, service: e.target.value }))}
                      className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-xs text-secondary-text focus:outline-none focus:border-brand-red text-white"
                    >
                      <option>Strength Training Program</option>
                      <option>Weight Loss Transformation</option>
                      <option>Muscle Building Protocol</option>
                      <option>Personal 1-on-1 Session</option>
                      <option>Group Circuit Workout</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-[10px] font-bold text-gray-400 uppercase font-inter mb-1">
                      Custom Remarks (Optional)
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-red resize-none"
                      placeholder="Share injury records, goals etc..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-brand-red to-brand-orange text-white font-bold p-3.5 rounded-xl text-xs uppercase tracking-wider font-inter cursor-pointer transition-all hover:opacity-95"
                  >
                    Submit Booking Enquiry
                  </button>
                </form>
              </div>

              {/* Direct addresses contacts list */}
              <div className="mt-8 pt-6 border-t border-white/5 space-y-4 text-left">
                <div className="flex items-start space-x-3.5 text-xs text-gray-300">
                  <MapPin className="w-5 h-5 text-brand-red shrink-0" />
                  <div>
                    <span className="font-bold text-white block uppercase tracking-wide">Gym Location Address</span>
                    <p className="mt-0.5 leading-relaxed font-light">{GYM_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 text-xs text-gray-300">
                  <Phone className="w-5 h-5 text-brand-orange shrink-0 animate-pulse" />
                  <div>
                    <span className="font-bold text-white block uppercase tracking-wide">Direct Contact Number</span>
                    <p className="mt-0.5 font-bold text-brand-gold">{GYM_INFO.contact}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Google Map Embedded Frame */}
            <div className="lg:col-span-7 bg-brand-card p-4 rounded-3xl border border-white/5 flex flex-col justify-between h-[450px] sm:h-auto">
              <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden relative border border-white/10">
                <iframe
                  title="Pulse Gym Mowa Google Map Locator"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.1729605553013!2d81.658252!3d21.2646271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28ddbb87ec42ef%3A0xe54d3d1da90ef8ab!2sPulse%20Gym!5e0!3m2!1sen!2sin!4v1718873420000!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full border-0 grayscale invert opacity-80"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              
              <div className="pt-4 flex flex-wrap items-center justify-between gap-2 px-1">
                <span className="text-[10px] text-gray-400 font-inter font-medium uppercase tracking-widest">
                  📍 In Front of Shubhkamna Hospital Raipur
                </span>
                <a
                  href="https://maps.app.goo.gl/B9Zka9dFzY96z9G58"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-brand-red hover:bg-brand-orange text-white font-bold px-4 py-2 text-[10px] uppercase font-inter tracking-wider rounded-lg transition-all"
                >
                  Configure Navigation Directions
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-brand-dark/95 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
            
            {/* Column 1: Business Branding */}
            <div>
              <div className="flex items-center space-x-2.5 font-oswald text-xl font-bold tracking-wider text-white">
                <span className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-white" />
                </span>
                <span>PULSE <span className="text-brand-orange">GYM MOWA</span></span>
              </div>
              
              <p className="mt-4 text-xs text-gray-400 leading-relaxed font-poppins font-light">
                Raipur's specialized physical strength training center, facilitating structured body recomposition and weight conditioning at highly affordable subscription ranges.
              </p>

              {/* Verified icons badges */}
              <div className="mt-6 flex space-x-3.5">
                <a href={GYM_INFO.socials.instagram} className="p-2 bg-white/[0.02] border border-white/10 hover:border-brand-red text-gray-400 hover:text-white rounded-lg transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href={GYM_INFO.socials.facebook} className="p-2 bg-white/[0.02] border border-white/10 hover:border-brand-red text-gray-400 hover:text-white rounded-lg transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href={GYM_INFO.socials.youtube} className="p-2 bg-white/[0.02] border border-white/10 hover:border-brand-red text-gray-400 hover:text-white rounded-lg transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Program categories */}
            <div>
              <h4 className="text-white font-oswald text-sm font-bold uppercase tracking-widest border-l-2 border-brand-red pl-2.5 mb-5 mb-5">
                FITNESS PROGRAMS
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-400 leading-relaxed">
                {SERVICES.slice(0, 5).map((srv) => (
                  <li key={srv.id}>
                    <a href="#services" className="hover:text-brand-orange transition-colors">
                      {srv.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Navigation Quick Links */}
            <div>
              <h4 className="text-white font-oswald text-sm font-bold uppercase tracking-widest border-l-2 border-brand-red pl-2.5 mb-5 mb-5">
                COMPANY NAVIGATION
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-400 leading-relaxed">
                <li><a href="#about" className="hover:text-brand-red transition-colors font-inter">About Mission</a></li>
                <li><a href="#trainers" className="hover:text-brand-red transition-colors font-inter">Qualified Staff Coaches</a></li>
                <li><a href="#pricing" className="hover:text-brand-red transition-colors font-inter">Membership pricing list</a></li>
                <li><a href="#gallery" className="hover:text-brand-red transition-colors font-inter">Gym Space Tour</a></li>
                <li><a href="#renewal" className="hover:text-brand-red transition-colors font-inter">WhatsApp renewal desk</a></li>
                <li><a href="#testimonials" className="hover:text-brand-red transition-colors font-inter">Real google reviews board</a></li>
              </ul>
            </div>

            {/* Column 4: Contact metrics */}
            <div>
              <h4 className="text-white font-oswald text-sm font-bold uppercase tracking-widest border-l-2 border-brand-red pl-2.5 mb-5 mb-5">
                OFFICE BAT ZONE
              </h4>
              <ul className="space-y-4 text-xs text-gray-400 leading-relaxed text-left">
                <li className="flex items-start space-x-2.5">
                  <MapPin className="w-4.5 h-4.5 text-brand-red shrink-0" />
                  <span className="font-light">{GYM_INFO.address}</span>
                </li>

                <li className="flex items-center space-x-2.5">
                  <Phone className="w-4.5 h-4.5 text-brand-orange shrink-0" />
                  <span className="font-bold text-white text-sm">{GYM_INFO.contact}</span>
                </li>

                <li className="flex items-center space-x-2.5">
                  <Clock className="w-4.5 h-4.5 text-brand-gold shrink-0" />
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-inter">Mon - Sat batches</span>
                    <span>6:00 AM – 10:30 AM</span> <br />
                    <span>5:00 PM – 10:00 PM</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-inter text-center md:text-left gap-4">
            <div>
              &copy; {new Date().getFullYear()} Pulse Gym Mowa. All Rights Reserved. Designed for premium performance standards.
            </div>
            
            <div className="flex space-x-4">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Use</a>
              <span>•</span>
              <a href="#sitemap" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 12. FLOATING WHATSAPP CHAT DRAWER ACTOR */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
        {/* Floating pulse text helper prompt */}
        <div className="bg-brand-card border border-white/10 text-white p-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce max-w-[250px] text-left">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <div className="text-[10px] leading-snug font-inter">
            <span className="font-bold text-brand-orange block uppercase tracking-wider">Coach Online</span>
            Join now & get free shaker kit on WhatsApp enquiry!
          </div>
        </div>

        <a
          href="https://wa.me/919302972999?text=Hi,%20I%20am%20interested%20in%20joining%20Pulse%20Gym%20Mowa.%20Please%20share%20membership%20details."
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] rounded-full flex items-center justify-center text-white shadow-2xl transform scale-100 hover:scale-110 active:scale-95 transition-all text-center relative group"
          aria-label="Chat over WhatsApp"
        >
          {/* Glowing pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-25 animate-ping group-hover:scale-125 pointer-events-none" />
          <MessageSquare className="w-7 h-7 fill-white/10 text-white" />
        </a>
      </div>

    </div>
  );
}
