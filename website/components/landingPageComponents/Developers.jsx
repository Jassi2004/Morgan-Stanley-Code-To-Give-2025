// Team.js
import React, { useState, useRef } from 'react';
import PersonBobblehead from '../ui/PersonBobblehead';
import './Developer.css';

const Team = () => {
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [showSpotlight, setShowSpotlight] = useState(false);
  const spotlightRef = useRef(null);
  
  const teamMembers = [
    {
      name: "Piyush Arora",
      headImage: "/images/piyushHead.png",
      bodyImage: "/images/suit.png",
      role: 'Developer',
      description: 'Alice designs awesome stuff.',
    },
    {
      name: "Kritica Jain",
      headImage: "/images/kriticaHead.png",
      bodyImage: "/images/women-suit.png",
      role: 'Developer',
      description: 'Alice designs awesome stuff.',
    },
    {
      name: "Jaskirat Singh",
      headImage: "/images/jaskiratHead.png",
      bodyImage: "/images/suit.png",
      role: 'Developer',
      description: 'My name Jaskirat Singh, a third-year student at Chitkara University. I am contributing as a Frontend Developer for both the website and mobile app.',
    },  
    {
      name: "Soumya Makkar",
      headImage: "/images/soumyaHead.png",
      bodyImage: "/images/women-suit.png",
      role: 'Developer',
      description: 'My name is Soumya Makkar, a third-year student at Chitkara University. I am contributing as a Frontend Developer for the mobile app and handling the backend for mobile-specific APIs.',
    },
    {
      name: "Anshul Sharma",
      headImage: "/images/anshulHead.png",
      bodyImage: "/images/suit.png",
      role: 'Developer',
      description: 'My name is Anshul Sharma, a pre-final year student at chitkara University. I am contributing as a backend developer for website and will also be handling the deployment work.',
    },
    {
      name: "Harneet Atwal",
      headImage: "/images/harneetHead.png",
      bodyImage: "/images/women-suit.png",
      role: 'Developer',
      description: 'Alice designs awesome stuff.',
    },
  ];

  const handleMouseEnter = (person, e) => {
    setHoveredPerson(person);
    setShowModal(true);
    // setShowSpotlight(true);
    
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSpotlightPos({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
  
      // First, dim and shrink all team members
      document.querySelectorAll('.team-member-wrapper').forEach(el => {
        el.style.filter = 'brightness(0.3)';
        el.style.transform = 'scale(0.8)'; // 👈 shrink
        el.style.transition = 'all 0.3s ease'; // smooth transition
      });
  
      // Then highlight and scale up the hovered one
      e.currentTarget.style.filter = 'brightness(1)';
      e.currentTarget.style.transform = 'scale(1.1)'; // 👈 enlarge hovered one
    }
  };
  
  const handleMouseLeave = () => {
    setShowModal(false);
    setShowSpotlight(false);
  
    // Reset brightness and scale for all team members
    document.querySelectorAll('.team-member-wrapper').forEach(el => {
      el.style.filter = 'brightness(1)';        // reset brightness
      el.style.transform = 'scale(1)';          // reset scale
      el.style.transition = 'all 0.3s ease';    // smooth transition back
    });
  };
  

  // Update spotlight position on mouse move when hovering a team member
  const handleMouseMove = (e) => {
    if (showSpotlight && hoveredPerson) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSpotlightPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2 - 500
      });
    }
  };

  return (
    <div className="main-container">
      <h1 className="main-title">Our Team</h1>
      {/* <p className="main-subtitle">Meet our amazing team members!</p> */}

      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className={`team-member-wrapper ${hoveredPerson === member ? 'team-member-spotlight' : ''}`}
            onMouseEnter={(e) => handleMouseEnter(member, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <PersonBobblehead
              name={member.name}
              headImage={member.headImage}
              bodyImage={member.bodyImage}
            />
          </div>
        ))}
      </div>

      {/* Spotlight Overlay */}
      <div className={`team-spotlight-overlay ${showSpotlight ? 'team-spotlight-active' : ''}`}>
        <div 
          className="team-spotlight" 
          ref={spotlightRef}
          style={{ 
            left: `${spotlightPos.x}px`, 
            top: `${spotlightPos.y}px` 
          }}
        />
      </div>

      {/* Floating Modal that doesn't require scrolling */}
      <div className="floating-modal-container">
        <div className={`floating-modal ${showModal ? 'floating-modal-visible' : ''}`}>
          {hoveredPerson && (
            <>
              <h3 className='text-black'>{hoveredPerson.name}</h3>
              <p className='text-black'><strong>Role:</strong> {hoveredPerson.role}</p>
              <p className='text-black'><strong>Description:</strong> {hoveredPerson.description}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;