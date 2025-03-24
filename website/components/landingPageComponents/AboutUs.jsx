import React from 'react';

const AboutUs = () => {
  return (
    <div className="w-full bg-[#f3e9dc] mt-[-980px] py-16 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <h2 className="text-5xl font-bold text-gray-700 mb-12 text-center animate-fade-down">
          About Us
        </h2>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/3 flex flex-col items-center animate-slide-in">
            <img 
              src="https://bangaloreinternationalcentre.org/wp-content/uploads/Ishanya_logo-592x296.png" 
              alt="Ishanya India Foundation Logo" 
              className="w-full max-w-xs mb-8"
            />
            
            <div className="bg-[#236638] text-white p-6 rounded-lg shadow-lg animate-scale-in">
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p className="italic">
                "To create a society built on Diversity, Equity & Inclusion for Persons with Disabilities."
              </p>
            </div>
          </div>
          
          <div className="lg:w-2/3 animate-fade-in" style={{animationDelay: "0.3s"}}>
            <div className="bg-white rounded-lg p-6 shadow-lg" style={{ borderLeft: '4px solid #ffc34f' }}>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Welcome to Ishanya India Foundation – a place where hearts, minds, and possibilities come together to create a more inclusive, compassionate world.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                At Ishanya, we believe that every individual, no matter their abilities or challenges, has the right to live with dignity, independence, and the power to dream. Since 2015, we've been walking alongside individuals with Autism, Down Syndrome, and learning challenges, helping them discover their strengths, build confidence, and live with dignity.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                At Ishanya, we dream of a future where no one is left behind – where diversity isn't just accepted but celebrated. And with every small step, we're moving closer to that world.
              </p>
              
              <p className="text-gray-700 font-medium">
                This isn't just our mission – it's a journey we take together. We invite you to walk with us, to be part of the change, and to help us build a brighter, more inclusive tomorrow.
              </p>
              
              <div className="mt-8 flex justify-center">
                <button className="bg-[#ffc34f] hover:bg-[#e6ae42] text-gray-800 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md">
                  Join Our Journey
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-[#236638] text-white p-8 rounded-lg shadow-lg animate-fade-up" style={{animationDelay: "0.5s"}}>
          <h3 className="text-2xl font-semibold mb-4">Our Impact Since 2015</h3>
          <p className="mb-6">
            In the past few years, IIF has established itself as a renowned name in the disability sector by providing a wide range of services catering to individuals with different diagnoses and varied age groups.
          </p>
          <p>
            Our team of therapists and educators is dedicated to leveraging the potential of each individual who comes to us & is constantly working towards finding new & innovative ways to engage them & help them become the best versions of themselves.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;