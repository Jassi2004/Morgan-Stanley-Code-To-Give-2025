import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Users, 
  Heart, 
  Target, 
  Award, 
  Brain, 
  Star, 
  Globe, 
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Add custom styles to remove scrollbar
const customStyles = `
  .slick-slider {
    overflow: hidden;
  }
  .slick-slide {
    overflow: hidden;
  }
  .slick-track {
    overflow: hidden;
  }
  .slick-list {
    overflow: hidden;
  }
`;

const LandingPages = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const heroImages = [
    "https://images.unsplash.com/photo-1519682577862-22b62b24e493?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1519682577862-22b62b24e493?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1519682577862-22b62b24e493?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
      setIsAnimating(true);
    },
    customPaging: (i) => (
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-white scale-125' : 'bg-white/50'}`} />
    ),
    arrows: false
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const stats = [
    { icon: <Users size={40} />, number: "500+", label: "Lives Impacted" },
    { icon: <Target size={40} />, number: "8+", label: "Years of Service" },
    { icon: <Heart size={40} />, number: "100%", label: "Dedicated Support" },
    { icon: <Award size={40} />, number: "15+", label: "Programs" }
  ];

  const programs = [
    {
      title: "Early Intervention",
      description: "Specialized programs for children aged 2-6 years focusing on developmental milestones.",
      icon: <Brain size={32} />
    },
    {
      title: "Educational Support",
      description: "Tailored learning programs for children with special needs.",
      icon: <Star size={32} />
    },
    {
      title: "Therapy Services",
      description: "Professional therapy sessions including speech, occupational, and behavioral therapy.",
      icon: <Heart size={32} />
    },
    {
      title: "Parent Training",
      description: "Workshops and support groups for parents and caregivers.",
      icon: <Users size={32} />
    }
  ];

  return (
    <div className="min-h-screen">
      <style>{customStyles}</style>
      {/* Hero Section */}
      <section className="relative h-screen">
        <Slider {...sliderSettings}>
          {heroImages.map((image, index) => (
            <div key={index} className="relative h-screen">
              <div className="absolute inset-0 bg-black/50 z-10" />
              <img 
                src={image} 
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                <div className="max-w-4xl">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6"
                  >
                    Making Society More Inclusive
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-white/90 mb-8"
                  >
                    Empowering individuals with special needs since 2015
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-[#E4B124] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#d4a424] transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    Join Our Movement
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-[#236638] mb-6 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-3">{stat.number}</h3>
                <p className="text-gray-600 text-lg font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-[#f3e9dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Programs</h2>
            <div className="w-32 h-1 bg-[#236638] mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-[#236638] mb-6">
                  {program.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{program.title}</h3>
                <p className="text-gray-600">{program.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Impact</h2>
            <div className="w-32 h-1 bg-[#236638] mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="bg-[#236638]/10 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#236638] mb-4">Success Stories</h3>
                <p className="text-gray-700">
                  Through our dedicated programs, we've helped hundreds of children achieve their full potential and lead fulfilling lives.
                </p>
              </div>
              <div className="bg-[#236638]/10 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#236638] mb-4">Community Impact</h3>
                <p className="text-gray-700">
                  Our work has created a ripple effect, fostering a more inclusive society where every child is valued and supported.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519682577862-22b62b24e493?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Impact"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-[#f3e9dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Get in Touch</h2>
            <div className="w-32 h-1 bg-[#236638] mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-lg text-center"
            >
              <div className="text-[#236638] mb-4 flex justify-center">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600">contact@ishanya.org</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-lg text-center"
            >
              <div className="text-[#236638] mb-4 flex justify-center">
                <Phone size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-600">+91 1234567890</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-lg text-center"
            >
              <div className="text-[#236638] mb-4 flex justify-center">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Main Street, Bangalore, India</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-[#236638] hover:text-[#1a4c2a] transition-colors duration-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-[#236638] hover:text-[#1a4c2a] transition-colors duration-300">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-[#236638] hover:text-[#1a4c2a] transition-colors duration-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-[#236638] hover:text-[#1a4c2a] transition-colors duration-300">
                <Linkedin size={24} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPages;
