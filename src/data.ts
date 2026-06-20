export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  iconName: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialization: string;
  image: string;
  experience: string;
  instagram: string;
}

export interface MembershipPlan {
  id: string;
  title: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

export interface Offer {
  id: string;
  tag: string;
  title: string;
  description: string;
  expiry: string;
  badge: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Equipment' | 'Cardio' | 'Workouts' | 'Strength' | 'Transformations';
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

export const GYM_INFO = {
  name: 'Pulse Gym Mowa',
  category: 'Gym & Fitness Center',
  contact: '093029 72999',
  whatsapp: '093029 72999',
  address: 'In Front of Shubhkamna Hospital, Dubey Colony, Mowa, Raipur, Chhattisgarh 492014',
  googleRating: 4.1,
  reviewsCount: 121,
  hours: [
    { days: 'Monday - Saturday', time: '6:00 AM – 10:30 AM, 5:00 PM – 10:00 PM' },
    { days: 'Sunday', time: 'Closed' }
  ],
  socials: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
  }
};

export const SERVICES: Service[] = [
  {
    id: 'strength',
    title: 'Strength Training',
    description: 'Build robust muscle mass and physical resilience with premium free weights, advanced racks, and expert-designed powerlifting protocols.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=700',
    iconName: 'Dumbbell'
  },
  {
    id: 'weight-loss',
    title: 'Weight Loss Programs',
    description: 'Achieve safe, sustainable weight reduction utilizing advanced metabolic conditioning circuits and integrated caloric trackers.',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=700',
    iconName: 'Sparkles'
  },
  {
    id: 'muscle',
    title: 'Muscle Building',
    description: 'Precision hypertrophy programs with advanced mechanical tension guidelines to stimulate targeted, optimal muscle volume growth.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=700',
    iconName: 'Activity'
  },
  {
    id: 'personal-training',
    title: 'Personal Training',
    description: 'Highly customized 1-on-1 coaching focusing closely on posture correction, progressive overload tracking, and structural balance.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=700',
    iconName: 'UserCheck'
  },
  {
    id: 'cardio',
    title: 'Cardio Training',
    description: 'State-of-the-art interactive treadmills, cycles, and cross-trainers optimized to elevate cardiorespiratory threshold and lung capacity.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=700',
    iconName: 'Flame'
  },
  {
    id: 'functional',
    title: 'Functional Training',
    description: 'Interactive kettlebell routines, balance boards, and slam-balls engineered to enhance functional everyday mobility and core stability.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=700',
    iconName: 'Zap'
  },
  {
    id: 'transformation',
    title: 'Body Transformation',
    description: 'Complete lifestyle rewires combining rigorous strength regimens, body recomposition blueprints, and continuous mental coaching.',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=700',
    iconName: 'TrendingUp'
  },
  {
    id: 'nutrition',
    title: 'Nutrition Guidance',
    description: 'Customized macro-nutrient profiling matching your physical output to optimize muscle recovery, sleep, and metabolic efficiency.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=700',
    iconName: 'Apple'
  },
  {
    id: 'group-workout',
    title: 'Group Workout Sessions',
    description: 'High-energy, community-driven circuits that build powerful endurance, mutual accountability, and supportive peer motivation.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=700',
    iconName: 'Users'
  },
  {
    id: 'assessment',
    title: 'Fitness Assessment',
    description: 'Comprehensive physical diagnostics including body mass indexing, body fat distribution, flexibility checks, and VO2 estimates.',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=700',
    iconName: 'BarChart3'
  }
];

export const TRAINERS: Trainer[] = [
  {
    id: 'rahul',
    name: 'Rahul Verma',
    role: 'Strength & Conditioning Coach',
    specialization: 'Hypertrophy Specialist, Olympic Powerlifting, Muscle Recomposition',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
    experience: '6+ Years',
    instagram: '#'
  },
  {
    id: 'amit',
    name: 'Amit Sahu',
    role: 'Weight Loss & Transformation Expert',
    specialization: 'High Intensity Circuit Training, Custom Diet Blueprinting, Lean Shreds',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=600',
    experience: '5+ Years',
    instagram: '#'
  },
  {
    id: 'nitesh',
    name: 'Nitesh Sharma',
    role: 'Personal Fitness Trainer',
    specialization: 'Posture Correction, Athletic Agility, Injury Rehabilitation',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=600',
    experience: '4+ Years',
    instagram: '#'
  }
];

export const PLANS: MembershipPlan[] = [
  {
    id: 'monthly',
    title: 'Monthly Membership',
    duration: '1 Month Validity',
    features: [
      'Full Gym Access to Premium Cardio Zone',
      'Advanced Strength Section Access',
      'Secure Electronic Locker Facility',
      'Complimentary Wi-Fi & Lounge Access',
      'Initial Equipment Induction Session'
    ]
  },
  {
    id: 'quarterly',
    title: 'Quarterly Membership',
    duration: '3 Months Validity',
    isPopular: true,
    features: [
      'All Monthly Access Privileges Included',
      'On-Demand Dedicated Trainer Support',
      'Comprehensive Bi-Weekly Fitness Assessment',
      'Personalized Cardio Target Profiling',
      'Special Discounts on Protein Nutrition Bar'
    ]
  },
  {
    id: 'annual',
    title: 'Annual Membership',
    duration: '12 Months Validity',
    features: [
      'All Quarterly Access Privileges Included',
      'Comprehensive 1-on-1 Customized Workout Plan',
      'Priority Support & Routine Reviews',
      'Complimentary 1-Hour Personal Training Induction',
      'Exclusive Anniversary Merchandise Pack',
      'Membership Pause Option (Up to 30 Days)'
    ]
  }
];

export const OFFERS: Offer[] = [
  {
    id: 'offer-1',
    tag: 'LIMITED TIME DEAL',
    title: '🔥 New Member Special Offer',
    description: 'Get an extra 10% off on your gym enrollment fee + free fitness kit and shaker this week.',
    expiry: 'Valid till June 30, 2026',
    badge: 'NEW ENROLLEES'
  },
  {
    id: 'offer-2',
    tag: 'FREE DIAGNOSTIC',
    title: '🎯 Free First-Time Fitness Assessment',
    description: 'Receive full BMI analysis, fat-percentage mapping, and structural mobility review on your initial day.',
    expiry: 'No coupon required',
    badge: 'ALL FIRST-TIMERS'
  },
  {
    id: 'offer-3',
    tag: 'TRANSFORM FASTER',
    title: '💪 Personal Training Deep Discounts',
    description: 'Book 12 customized personal trainer sessions and receive 3 additional intensive body recomposition sessions absolutely free!',
    expiry: 'Valid for current members',
    badge: 'PT BUNDLE'
  },
  {
    id: 'offer-4',
    tag: 'ULTIMATE EXCLUSIVITY',
    title: '🏋️ Annual Membership Benefits',
    description: 'Lock in the lowest per-month rate, secure free permanent locker access, and get a premium customized diet sheet.',
    expiry: 'Premium Saver Package',
    badge: 'BEST VALUE'
  }
];

export const GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Heavy Strength Training Area',
    category: 'Strength',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-2',
    title: 'High-Performance Cardio Trackers',
    category: 'Cardio',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-3',
    title: 'Personal Training Progress Set',
    category: 'Workouts',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-4',
    title: 'Pro-grade Dumbbells & Barbells',
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-5',
    title: 'Hypertrophic Cable Cross stations',
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'gal-6',
    title: 'Aesthetic Transformations Area',
    category: 'Transformations',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Alok Tiwari',
    rating: 5,
    text: 'Pulse Gym Mowa has completely transformed my definition of workout. The trainers are incredibly supportive, especially Rahul Verma, who helped me fix my squat posture.',
    date: '2 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'test-2',
    name: 'Priya Dewangan',
    rating: 4,
    text: 'Highly affordable memberships with premium standard equipment. The cardio area is spacious, clean, and well-ventilated. Perfect for female fitness enthusiasts!',
    date: '1 month ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'test-3',
    name: 'Sanjeev Sahu',
    rating: 5,
    text: 'Amit Sahu is an outstanding trainer for fat loss. Lost 8 kilograms in 2.5 months through his targeted conditioning plans and persistent macro reviews.',
    date: '3 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'test-4',
    name: 'Rohan Kurre',
    rating: 5,
    text: 'A clean and high-powered local gym. Highly energetic playlist, disciplined crowd, and absolutely professional equipment. Best fitness spot in Dubey colony Raipur!',
    date: 'A Day ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
  }
];
