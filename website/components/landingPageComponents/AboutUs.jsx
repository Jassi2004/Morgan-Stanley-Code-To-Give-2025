import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Target, Heart, Users, Award, Brain, Star, Globe } from 'lucide-react';

const CountUpNumber = ({ number, label, icon }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const duration = 2;
    const steps = 60;
    const increment = parseInt(number) / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= parseInt(number)) {
        setCount(parseInt(number));
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration * 1000 / steps);

    return () => clearInterval(interval);
  }, [number]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="text-[#236638] mb-6 flex justify-center">
        {icon}
      </div>
      <h3 className="text-4xl font-bold text-gray-800 mb-3">{count}{number.includes('+') ? '+' : ''}</h3>
      <p className="text-gray-600 text-lg font-medium">{label}</p>
    </motion.div>
  );
};

const MissionPoint = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/50 transition-colors duration-300">
    <div className="text-[#236638] mt-1">
      {icon}
    </div>
    <div>
      <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const AboutUs = () => {
  const stats = [
    { icon: <Users size={40} />, number: "500+", label: "Lives Impacted" },
    { icon: <Target size={40} />, number: "8+", label: "Years of Service" },
    { icon: <Heart size={40} />, number: "100%", label: "Dedicated Support" },
    { icon: <Award size={40} />, number: "15+", label: "Programs" }
  ];

  const missionPoints = [
    {
      icon: <Brain size={24} />,
      title: "Empowering Minds",
      description: "Helping individuals with Autism, Down Syndrome, and learning challenges discover their strengths and build confidence."
    },
    {
      icon: <Heart size={24} />,
      title: "Building Dignity",
      description: "Creating an environment where every individual can live with dignity and independence."
    },
    {
      icon: <Star size={24} />,
      title: "Celebrating Diversity",
      description: "Fostering a culture where differences are celebrated and every unique ability is valued."
    },
    {
      icon: <Globe size={24} />,
      title: "Creating Impact",
      description: "Making a lasting difference in society through innovative programs and dedicated support."
    }
  ];

  return (
    <div className="w-full bg-[#f3e9dc] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <img 
            src="https://bangaloreinternationalcentre.org/wp-content/uploads/Ishanya_logo-592x296.png" 
            alt="Ishanya India Foundation Logo" 
            className="w-64 mx-auto mb-12"
          />
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            About Us
          </h2>
          <div className="w-32 h-1 bg-[#236638] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <CountUpNumber key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h3>
            <p className="text-gray-700 text-2xl leading-relaxed">
              To create a society built on Diversity, Equity & Inclusion for Persons with Disabilities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Our Mission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missionPoints.map((point, index) => (
                <MissionPoint key={index} {...point} />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#236638] text-white p-16 rounded-lg shadow-xl"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-4xl font-bold mb-8">Our Impact</h3>
            <p className="text-xl leading-relaxed mb-6">
              In the past few years, IIF has established itself as a renowned name in the disability sector by providing a wide range of services catering to individuals with different diagnoses and varied age groups.
            </p>
            <p className="text-xl leading-relaxed">
              Our team of therapists and educators is dedicated to leveraging the potential of each individual who comes to us & is constantly working towards finding new & innovative ways to engage them & help them become the best versions of themselves.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;