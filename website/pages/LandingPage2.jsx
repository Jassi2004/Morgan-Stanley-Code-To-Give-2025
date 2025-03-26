import React, { useEffect } from 'react';
import { Heart, Brain, Users, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
// import { ImageGallery } from './components/ImageGallery';
import { LandingNavbar } from '../components/landingPageComponents/LandingNavbar';
import { SectionTitle } from '../components/landingPageComponents/SectionTitle';
import { ImageGallery } from '../components/landingPageComponents/ImageGallery';
import './landingPage2.css';

function LandingPage() {
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
      section.classList.add('fade-in-section');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <LandingNavbar />
        {/* Hero Section */}
        <header className="relative h-screen bg-gradient-to-br from-yellow-100 via-green-50 to-yellow-50 py-24">
       
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold text-green-900 mb-6">
              Creating a Society Built on Diversity, Equity & Inclusion
            </h1>
            <p className="text-xl text-green-800 mb-8 max-w-2xl">
              Supporting individuals with Autism, Down Syndrome, and learning challenges to discover their strengths, build confidence, and live with dignity.
            </p>
            <div className="flex gap-4">
              <button 
                className="btn-primary"
                onClick={() => scrollToSection('connect-with-us')}
              >
                Connect With Us
              </button>
              <button 
                className="btn-secondary"
                onClick={() => scrollToSection('awareness-initiatives')}
              >
                Awareness Initiatives
              </button>
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?auto=format&fit=crop&w=2000"
          alt="Children playing together"
          className="absolute top-0 right-0 w-1/2 h-full object-cover rounded-l-3xl opacity-20 lg:opacity-90"
        />
      </header>

      {/* About Section */}
      <section className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="About Us"
            subtitle="Welcome to Ishanya India Foundation – a place where hearts, minds, and possibilities come together."
          />
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-md border-2 border-yellow-200">
                <h3 className="text-2xl font-semibold text-green-900 mb-4">Our Vision</h3>
                <p className="text-lg text-green-800">
                  To create a society built on Diversity, Equity & Inclusion for Persons with Disabilities.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-md border-2 border-yellow-200">
                <h3 className="text-2xl font-semibold text-green-900 mb-4">Our Journey</h3>
                <p className="text-lg text-green-800 mb-4">
                  Since 2015, we've been dedicated to empowering individuals with Autism, Down Syndrome, and learning challenges. Our mission goes beyond support – we're building a community where every person's unique abilities are celebrated and nurtured.
                </p>
                <p className="text-lg text-green-800">
                  Through innovative programs, dedicated care, and unwavering commitment, we help our participants discover their strengths, build confidence, and achieve their full potential.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800"
                  alt="Community Support"
                  className="w-full rounded-xl shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border-2 border-yellow-200">
                  <img 
                    src="https://bangaloreinternationalcentre.org/wp-content/uploads/Ishanya_logo-592x296.png"
                    alt="Ishanya Logo"
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Awards & Recognition"
            subtitle="Celebrating our journey of making a difference"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <img 
                src="https://media.licdn.com/dms/image/v2/D5622AQHC_GcB-RdKBA/feedshare-shrink_800/B56ZV5HxjPHoAg-/0/1741493932443?e=1745452800&v=beta&t=HLbfzWHfekCpaIe5Oewp8XGJtBmeI4U1LK9Mna_cv2s"
                alt="Women's Day Celebration"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-green-900">Women's Day Recognition</h3>
            </div>
            <div className="card">
              <img 
                src="https://media.licdn.com/dms/image/v2/D5622AQFOFPMivNm73g/feedshare-shrink_800/feedshare-shrink_800/0/1733391311010?e=1745452800&v=beta&t=wTiDNLUuVS9HnaiEepBdbK6uWfmweJmKVyRjlK-cAvM"
                alt="Karnataka State Award"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-green-900">Karnataka State Award</h3>
              <p className="text-green-800">Organizations Empowering Persons with Disabilities</p>
            </div>
            <div className="card">
              <img 
                src="https://media.licdn.com/dms/image/v2/D5622AQH3XVxF8WFgmA/feedshare-shrink_800/B56ZR4xWQIHwAg-/0/1737192990760?e=1745452800&v=beta&t=aBRLV_oXGm8F-k9YpIPZPdeTg6L3eF62fK17ISAxmiU"
                alt="TEDx talk at PESU"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-green-900">TEDx Talk at PESU</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Awareness Gallery */}
      <section id="awareness-initiatives" className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Awareness Initiatives"
            subtitle="Spreading awareness and fostering understanding in our community"
          />
          <ImageGallery
            images={[
              "https://media.licdn.com/dms/image/v2/D5622AQH0eHMDapDo6Q/feedshare-shrink_800/B56ZXDJjXgHEAg-/0/1742735818598?e=1745452800&v=beta&t=nSsW8NaLqQ6UekgurumWNLrbO4qzg6dTSiMH2S5brIE",
              "https://media.licdn.com/dms/image/v2/D5622AQGL7iqVxYn6WQ/feedshare-shrink_1280/B56ZW.StCfGoAk-/0/1742654330969?e=1745452800&v=beta&t=esze32Oce44gzIPZXXBOvO2mofhceuufrwNxI1FjE8s",
              "https://media.licdn.com/dms/image/v2/D5622AQGsWFurfmvyNw/feedshare-shrink_800/B56ZW5kc0wHEAk-/0/1742575095772?e=1745452800&v=beta&t=1NzxqCGgROhgG93tXOKu7-nKtbjSfULnnpHy8Q4fxKk"
            ]}
          />
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Corporate Partnerships"
            subtitle="Creating meaningful opportunities through industry collaboration"
          />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card">
              <h3 className="text-2xl font-semibold mb-4 text-green-900">Honeywell Experience</h3>
              <p className="text-green-800 mb-6">
                The students not only interacted with employees through engaging games and immersed themselves in the company's dynamic work culture, but also experienced the thrill of flying a plane using a flight simulator.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://media.licdn.com/dms/image/v2/D4E22AQFUuAo8jitAEw/feedshare-shrink_800/B4EZPAk.n5HAAg-/0/1734102745490?e=1745452800&v=beta&t=cSDgpuf4ilq_3E2sA7dwcDrq1kDs3GyL26WfvrdYSJo"
                  alt="Honeywell Visit"
                  className="rounded-lg"
                />
                <img 
                  src="https://media.licdn.com/dms/image/v2/D4E22AQF_YdaA7VxTOw/feedshare-shrink_2048_1536/B4EZPAk.oiHsAw-/0/1734102743702?e=1745452800&v=beta&t=oTsVxA4gUvbzduSMRDnRSZikOEo8dqPieulwgDD4Twc"
                  alt="Honeywell Activities"
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="card">
              <h3 className="text-2xl font-semibold mb-4 text-green-900">Thomson Reuters Office</h3>
              <p className="text-green-800 mb-6">
                Our students engaged with TR employees and even took the lead in a thrilling competitive game of robot building - an incredible opportunity to get a taste of corporate life!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://media.licdn.com/dms/image/v2/D5622AQHAgyzv7QPTsQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1733839106473?e=1745452800&v=beta&t=cwvUiQTMC3TkUVTdv5O-2wObygtIsjR96_6GQJsdC7g"
                  alt="Thomson Reuters Visit"
                  className="rounded-lg"
                />
                <img 
                  src="https://media.licdn.com/dms/image/v2/D5622AQF8Bpcy7UCWsw/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1733839106636?e=1745452800&v=beta&t=6fT2UJ77ih67AfuU-rYQQnjDu5zuVsXg57I6ichGPI0"
                  alt="Thomson Reuters Activities"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Field Work Section */}
      <section className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Our Impact in the Field"
            subtitle="Making a difference in communities through hands-on engagement"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <img 
                src="https://media.licdn.com/dms/image/v2/D5622AQEha0yIz6Ht1Q/feedshare-shrink_800/feedshare-shrink_800/0/1720683393568?e=1745452800&v=beta&t=XoSXPP1BHwxHy0YV7Rsq8uyJ3pRi92Q62ftoR7GXKwI"
                alt="Asha Workers Training"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-green-900">Asha Workers Training</h3>
              <p className="text-green-800">
                Front line workers play a crucial role in identifying red flag signs and guiding families to access the right resources.
              </p>
            </div>
            <div className="card">
              <img 
                src="https://media.licdn.com/dms/image/v2/D5622AQHhxU2-jqaR5Q/feedshare-shrink_800/B56ZUkHASgGsAg-/0/1740067576668?e=1745452800&v=beta&t=3PQh9FWYgPX_3yQNcgvqyHqBYVd27q5UghmXeu-4YuE"
                alt="UDID Camp"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-green-900">UDID Camp</h3>
              <p className="text-green-800">
                Facilitating UDID assessments and registrations for children and their families.
              </p>
            </div>
            <div className="card">
              <img 
                src="https://media.licdn.com/dms/image/v2/D4E22AQGMS2wzIQEgUw/feedshare-shrink_1280/feedshare-shrink_1280/0/1715853241618?e=1745452800&v=beta&t=Msjot8rOsP5vsdaAlrC3qcUOJJuoZXaZUhCWvs_466I"
                alt="Coding Workshop"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-green-900">Coding Workshop</h3>
              <p className="text-green-800">
                Developing problem-solving skills and enhancing cognitive abilities through coding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Testimonials"
            subtitle="Voices of impact and transformation"
          />
          <div className="grid md:grid-cols-3 gap-8">
            <img 
              src="https://ishanyaindia.org/wp-content/uploads/2021/05/20201018_154737_0000-724x1024.png"
              alt="Testimonial 1"
              className="w-full rounded-lg shadow-md"
            />
            <img 
              src="https://ishanyaindia.org/wp-content/uploads/2021/05/20201018_152314_0000-724x1024.png"
              alt="Testimonial 2"
              className="w-full rounded-lg shadow-md"
            />
            <img 
              src="https://ishanyaindia.org/wp-content/uploads/2021/05/20201018_130232_0000-724x1024.png"
              alt="Testimonial 3"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="connect-with-us" className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Connect With Us"
            subtitle="We're here to help you take the first step towards a brighter future"
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card flex flex-col items-center text-center">
              <Phone className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-green-900">Call Us</h3>
              <p className="text-green-800">+91 73496 76668</p>
            </div>
            <div className="card flex flex-col items-center text-center">
              <Mail className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-green-900">Email Us</h3>
              <p className="text-green-800">info@ishanyaindia.org</p>
            </div>
            <div className="card flex flex-col items-center text-center">
              <MapPin className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-green-900">Visit Us</h3>
              <p className="text-green-800">Bangalore, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p className="text-green-100">
                Dedicated to creating a society built on Diversity, Equity & Inclusion for Persons with Disabilities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-green-100">
                <li>Our Services</li>
                <li>Get Involved</li>
                <li>Resources</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-green-100">
                <li>FAQ</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Accessibility</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <p className="text-green-100 mb-4">
                Stay updated with our latest news and events.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-green-800/50 rounded-lg px-4 py-2 flex-1 text-green-100 placeholder-green-200"
                />
                <button className="btn-primary">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 mt-12 pt-8 text-center text-green-100">
            <p>© 2024 Ishanya India Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;