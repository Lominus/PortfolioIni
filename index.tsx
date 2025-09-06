import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { settings } from './settings.js';

// --- Reusable Components ---

const Section = ({ id, title, children, className = '', boxed = true }: { id: string; title?: string; children: React.ReactNode; className?: string; boxed?: boolean; }) => {
  const content = (
    <>
      {title && <h2 className="section-title">{title}</h2>}
      {children}
    </>
  );

  return (
    <section id={id} className={`section ${className}`}>
      {boxed ? <div className="content-box">{content}</div> : content}
    </section>
  );
};


// --- Page Sections ---

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header>
        <div className="logo">{settings.personalInfo.name}</div>
        <button 
          className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="navigation-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav id="navigation-menu" className={isMenuOpen ? 'open' : ''}>
          <div className="main-nav-links">
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#portfolio" onClick={closeMenu}>Portfolio</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </div>
          <div className="dashboard-social-icons">
            <a href={settings.socialLinks.github} aria-label="GitHub" onClick={closeMenu}>G</a>
            <a href={settings.socialLinks.linkedin} aria-label="LinkedIn" onClick={closeMenu}>L</a>
            <a href={settings.socialLinks.twitter} aria-label="Twitter" onClick={closeMenu}>T</a>
          </div>
        </nav>
      </header>
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </>
  );
};

const Home = () => (
  <Section id="home" boxed={true}>
    <div className="home-content">
      <h1>{settings.home.title}<span>{settings.home.highlightedTitle}</span></h1>
      <p>{settings.home.subtitle}</p>
      <a href="#portfolio" className="cta-button">{settings.home.ctaButtonText}</a>
    </div>
  </Section>
);

const About = () => (
  <Section id="about" title={settings.about.title}>
    <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      {settings.about.description}
    </p>
  </Section>
);

const Portfolio = () => (
  <Section id="portfolio" title={settings.portfolio.title}>
    <div className="portfolio-grid">
      {settings.portfolio.items.map(item => (
        <div key={item.id} className="portfolio-card">
          <img src={item.imageUrl} alt={item.title} />
          <div className="portfolio-card-content">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

const Services = () => (
    <Section id="services" title={settings.services.title}>
        <div className="services-grid">
            {settings.services.items.map(service => (
                <div key={service.id} className="service-card">
                    <div className="icon">{service.icon}</div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                </div>
            ))}
        </div>
    </Section>
);


const Contact = () => (
  <Section id="contact" title={settings.contact.title}>
    <div className="contact-content">
        <p>{settings.contact.description}</p>
        <a href={`mailto:${settings.personalInfo.email}`} className="email-link">{settings.personalInfo.email}</a>
    </div>
    <div className="social-icons">
        <a href={settings.socialLinks.github} aria-label="GitHub"><i className="fab fa-github"></i>G</a>
        <a href={settings.socialLinks.linkedin} aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i>L</a>
        <a href={settings.socialLinks.twitter} aria-label="Twitter"><i className="fab fa-twitter"></i>T</a>
    </div>
  </Section>
);


// --- Main App Component ---

function App() {
  useEffect(() => {
    const canvas = document.getElementById('bg-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId;

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // --- Static Stars ---
    const staticStars = [];
    const staticStarCount = 200;
    for (let i = 0; i < staticStarCount; i++) {
        staticStars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.1,
            alpha: Math.random() * 0.5 + 0.2, // initial opacity
            alphaChange: (Math.random() * 0.02) - 0.01 // how fast it twinkles
        });
    }

    function drawStaticStars() {
        staticStars.forEach(star => {
            star.alpha += star.alphaChange;
            if (star.alpha <= 0.1 || star.alpha >= 0.7) {
                star.alphaChange *= -1;
            }
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });
    }

    // --- Shooting Stars ---
    class ShootingStar {
        // Fix: Declare class properties for ShootingStar to resolve "property does not exist" errors.
        x: number;
        y: number;
        len: number;
        speed: number;
        size: number;
        waitTime: number;
        active: boolean;

        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = 0;
            this.len = (Math.random() * 80) + 10;
            this.speed = (Math.random() * 8) + 5;
            this.size = (Math.random() * 1.2) + 0.1;
            this.waitTime = new Date().getTime() + (Math.random() * 3000);
            this.active = false;
        }

        update() {
            if (this.active) {
                this.x -= this.speed / 2; // Move left
                this.y += this.speed;   // Move down
                if (this.x < 0 || this.y >= height) {
                    this.reset();
                }
            } else {
                if (this.waitTime < new Date().getTime()) {
                    this.active = true;
                }
            }
        }

        draw() {
            if (this.active) {
                const tailX = this.x + this.len;
                const tailY = this.y - this.len;
                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, `rgba(0, 245, 200, ${this.size})`);
                gradient.addColorStop(1, "rgba(0, 245, 200, 0)");

                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.size;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();
            }
        }
    }

    const shootingStars = [];
    const shootingStarCount = 15;
    for (let i = 0; i < shootingStarCount; i++) {
        shootingStars.push(new ShootingStar());
    }

    // --- Animation Loop ---
    function animate() {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);

        drawStaticStars();

        shootingStars.forEach(star => {
            star.update();
            star.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <>
      <Header />
      <main>
        <Home />
        <About />
        <Portfolio />
        <Services />
        <Contact />
      </main>
    </>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}