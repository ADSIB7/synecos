import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Leaf, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import heroImage from "../../../assets/synecos-hero.jpg";
import facilityImage from "../../../assets/synecos-facility.jpg";
import teamImage from "../../../assets/synecos-team.jpg";
import logo from "../../../assets/logo.png";
import about_logo from "../../../assets/logo.jpg";
const navItems = [
  { label: "About", href: "#about" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label"><span className="section-label-dot" />{children}</p>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Synecos Organics home">
          <span className="brand-mark" aria-hidden="true"><img src={logo} alt="" /></span>
          <span className="brand-copy"><strong>Synecos</strong><small>Organics Pvt. Ltd.</small></span>
        </a>
        <nav className={`desktop-nav ${menuOpen ? "mobile-open" : ""}`} aria-label="Main navigation">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Discuss a project <ArrowUpRight size={15} strokeWidth={1.7} /></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-image" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="hero-wash" />
          <div className="hero-content page-width">
            <Reveal>
              <p className="eyebrow light"><span>01</span> Research · Development · Manufacturing</p>
            </Reveal>
            <Reveal delay={70}>
              <h1>Thoughtful work.<br /><em>Made well.</em></h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="hero-intro">Synecos is a Pune-based partner for ambitious ideas — from early research to dependable custom manufacturing.</p>
            </Reveal>
            <Reveal delay={200}>
              <a className="text-link light-link" href="#about">Discover Synecos <ArrowDown size={16} /></a>
            </Reveal>
          </div>
          <div className="hero-foot page-width">
            <span>Established 2011 · Pune, India</span>
            <span className="scroll-note"><span className="scroll-line" /> Scroll to explore</span>
          </div>
        </section>

        <section id="about" className="about-section section-pad">
          <div className="page-width split-grid">
            <Reveal><SectionLabel>About Synecos</SectionLabel><span className="about-logo"><img src={about_logo} alt=""/></span></Reveal>
            <div className="about-copy">
              <Reveal delay={60}><h2>A steady hand for <em>complex work.</em></h2></Reveal>
              <Reveal delay={120}><p className="lead-copy">For more than a decade, we have helped organisations move from a promising brief to something real, reliable and ready for the world.</p></Reveal>
              <Reveal delay={180}><p>Our work sits at the intersection of curiosity and rigour. We bring thoughtful research, practical development and disciplined execution together under one roof — with the clarity and care that meaningful partnerships require.</p></Reveal>
              <Reveal delay={230}><a className="text-link dark-link" href="#capabilities">How we can help <ArrowUpRight size={16} /></a></Reveal>
            </div>
          </div>
          <div className="page-width about-note"><span className="year-mark">2011</span><p>Founded in Pune with a simple belief: good work is built through attention, patience and trust.</p></div>
        </section>

        <section id="capabilities" className="capabilities-section section-pad dark-section">
          <div className="page-width">
            <div className="section-heading-row">
              <Reveal><SectionLabel>What we do</SectionLabel></Reveal>
              <Reveal delay={80}><p className="section-aside">One connected team, supporting the journey from first question to finished outcome.</p></Reveal>
            </div>
            <div className="capability-list">
              {[
                { no: "01", title: "Research & development", body: "Turning questions into clear, workable directions through focused research and considered experimentation." },
                { no: "02", title: "Process development", body: "Building robust, repeatable processes that hold up beyond the bench and into everyday production." },
                { no: "03", title: "Custom manufacturing", body: "Reliable small- to mid-scale manufacturing, shaped around your requirements, timelines and standards." },
              ].map((item, index) => (
                <Reveal key={item.no} delay={index * 70}>
                  <div className="capability-row">
                    <span className="capability-no">{item.no}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    <ArrowUpRight className="capability-arrow" size={19} strokeWidth={1.5} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="approach-section section-pad">
          <div className="page-width approach-grid">
            <div className="approach-visual">
              <Reveal><div className="image-frame"><img src={teamImage} alt="Synecos team collaborating in a bright work environment" /><span className="image-caption">The value of good work is often in the details.</span></div></Reveal>
            </div>
            <div className="approach-content">
              <Reveal><SectionLabel>Our approach</SectionLabel></Reveal>
              <Reveal delay={70}><h2>Clear thinking.<br /><em>Quiet confidence.</em></h2></Reveal>
              <Reveal delay={140}><p className="lead-copy">We believe the best partnerships feel straightforward. The right questions are asked early, expectations are clear and every stage is handled with care.</p></Reveal>
              <Reveal delay={200}>
                <ul className="principles-list">
                  <li><span><Check size={15} /></span><div><strong>Listen first</strong><small>Understand the brief, the context and what success really means.</small></div></li>
                  <li><span><Check size={15} /></span><div><strong>Work with intent</strong><small>Make decisions that are thoughtful, practical and built to last.</small></div></li>
                  <li><span><Check size={15} /></span><div><strong>Stay accountable</strong><small>Communicate openly, keep promises and take ownership of the outcome.</small></div></li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="facility-section">
          <div className="page-width facility-intro">
            <Reveal><SectionLabel>Inside Synecos</SectionLabel></Reveal>
            <Reveal delay={70}><p>Purposeful spaces, considered systems and a team that takes pride in doing things properly.</p></Reveal>
          </div>
          <Reveal delay={120}><div className="facility-image-wrap"><img src={facilityImage} alt="Synecos facility interior with a calm, clean production environment" /><span className="facility-tag">Pune · India</span></div></Reveal>
        </section>

        <section className="industries-section section-pad">
          <div className="page-width industries-grid">
            <Reveal><SectionLabel>Across industries</SectionLabel></Reveal>
            <div>
              <Reveal delay={60}><h2>Built to support <em>what comes next.</em></h2></Reveal>
              <Reveal delay={120}><p className="industries-copy">Our experience travels well across sectors, particularly where quality, responsiveness and a thoughtful partner matter most.</p></Reveal>
              <Reveal delay={180}>
                <div className="industry-tags">
                  {['Specialty chemicals', 'Pharmaceuticals', 'Nutraceuticals', 'Personal care', 'Materials & more'].map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section dark-section">
          <div className="page-width contact-grid">
            <div>
              <Reveal><SectionLabel>Start a conversation</SectionLabel></Reveal>
              <Reveal delay={70}><h2>Have a thoughtful<br /><em>project in mind?</em></h2></Reveal>
            </div>
            <div className="contact-side">
              <Reveal delay={120}><p>Tell us a little about what you are working on. We would be glad to understand the brief and explore where we can help.</p></Reveal>
              <Reveal delay={170}><a className="contact-button" href="mailto:connect@synecos.com">Discuss a project <ArrowUpRight size={17} /></a></Reveal>
              <Reveal delay={220}><div className="contact-details"><a href="mailto:connect@synecos.com"><Mail size={15} /> info@synecos.com</a><a href="tel:+917798400011"><Phone size={15} /> +91 7798400011</a><span><MapPin size={15} /> Pune, Maharashtra · India</span></div></Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-top">
          <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span className="brand-copy"><strong>Synecos</strong><small>Organics Pvt. Ltd.</small></span></a>
          <p>Research with purpose.<br />Manufacturing with care.</p>
          <a className="back-top" href="#top">Back to top <ArrowUpRight size={15} /></a>
        </div>
        <div className="page-width footer-bottom"><span>© 2026 Synecos Organics Pvt. Ltd.</span><span>Made in Pune, India <Leaf size={13} /></span></div>
      </footer>
    </div>
  );
}

export default Home;
