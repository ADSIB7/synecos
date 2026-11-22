import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import heroImage from "../../../assets/synecos-hero.webp";
import facilityImage from "../../../assets/synecos-facility-web.jpg";
import teamImage from "../../../assets/synecos-team.webp";
import logoText from "../../../assets/logo-text.webp";
import logoEmblem from "../../../assets/logo-emblem.webp";
import aboutLogo from "../../../assets/newlogo.webp";
const sectionIds = {
  home: "top",
  about: "about",
  capabilities: "capabilities",
  approach: "approach",
  facility: "facility",
  industries: "industries",
  contact: "contact",
} as const;

const navItems = [
  { id: sectionIds.home, label: "Home" },
  { id: sectionIds.about, label: "About" },
  { id: sectionIds.capabilities, label: "Capabilities" },
  { id: sectionIds.approach, label: "Approach" },
  { id: sectionIds.facility, label: "Facility" },
  { id: sectionIds.industries, label: "Industries" },
  { id: sectionIds.contact, label: "Contact" },
];

const molecularNodes = navItems.map((item, index) => ({
  ...item,
  x: index % 2 === 0 ? 12 : 36,
  y: 18 + (index / (navItems.length - 1)) * 364,
}));
const molecularPath = molecularNodes.map(({ x, y }) => `${x},${y}`).join(" ");

const capabilities = [
  {
    number: "01",
    title: "Research & development",
    description:
      "Turning questions into clear, workable directions through focused research and considered experimentation.",
  },
  {
    number: "02",
    title: "Process development",
    description:
      "Building robust, repeatable processes that hold up beyond the bench and into everyday production.",
  },
  {
    number: "03",
    title: "Custom manufacturing",
    description:
      "Reliable small- to mid-scale manufacturing, shaped around your requirements, timelines and standards.",
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="section-label">
      <span className="section-label-dot" />
      {children}
    </p>
  );
}

function MolecularScrollBar() {
  const pathRef = useRef<SVGPolylineElement>(null);
  const nodeRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    let animationFrame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const sectionTops = navItems.map(item => {
          const section = document.getElementById(item.id);
          return section
            ? section.getBoundingClientRect().top + window.scrollY
            : 0;
        });
        const headerHeight =
          document.querySelector(".site-header")?.getBoundingClientRect()
            .height ?? 0;
        const scrollPosition = window.scrollY + headerHeight + 1;
        let activeIndex = 0;

        for (let index = 1; index < sectionTops.length; index += 1) {
          if (scrollPosition < sectionTops[index]) break;
          activeIndex = index;
        }

        navItems.forEach((_, index) => {
          const element = nodeRefs.current[index];

          if (element) {
            element.style.setProperty(
              "--node-progress",
              index <= activeIndex ? "1" : "0"
            );
            element.classList.toggle("is-active", index === activeIndex);
            if (index === activeIndex) {
              element.setAttribute("aria-current", "location");
            } else {
              element.removeAttribute("aria-current");
            }
          }
        });

        if (pathRef.current) {
          const totalProgress = activeIndex / (navItems.length - 1);
          pathRef.current.style.strokeDashoffset = `${100 - totalProgress * 100}`;
        }
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <nav className="molecular-scrollbar" aria-label="Section navigation">
      <div className="molecular-scrollbar__track">
        <svg
          className="molecular-scrollbar__bonds"
          viewBox="0 0 48 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline points={molecularPath} />
          <polyline
            ref={pathRef}
            className="molecular-scrollbar__progress"
            points={molecularPath}
            pathLength="100"
          />
        </svg>
        <ol className="molecular-scrollbar__nodes">
          {molecularNodes.map((node, index) => (
            <li
              key={node.id}
              className="molecular-scrollbar__item"
              style={
                {
                  "--node-x": `${(node.x / 48) * 100}%`,
                  "--node-y": `${(node.y / 400) * 100}%`,
                } as CSSProperties
              }
            >
              <a
                ref={element => {
                  nodeRefs.current[index] = element;
                }}
                className="molecular-scrollbar__node"
                href={`#${node.id}`}
                aria-label={`Go to ${node.label}`}
                title={node.label}
              >
                <span
                  className="molecular-scrollbar__atom"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleEnquirySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const subject = `Website enquiry from ${formData.get("name")}`;
    const body = [
      `Name: ${formData.get("name")}`,
      `Phone: ${formData.get("phone")}`,
      `Work email: ${formData.get("email")}`,
      "",
      "Project description:",
      formData.get("description"),
    ].join("\n");

    window.location.href = `mailto:connect@synecos.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setEnquiryOpen(false);
    toast.info("Your email app will open with the enquiry ready to send.");
    event.currentTarget.reset();
  };

  return (
    <div className="site-shell">
      <MolecularScrollBar />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a
          className="brand"
          href="#top"
          onClick={closeMenu}
          aria-label="Synecos Organics home"
        >
          <span className="brand-mark" aria-hidden="true">
            <img src={logoEmblem} alt="" />
          </span>
          <span className="brand-mark-text" aria-hidden="true">
            <img src={logoText} alt="" />
          </span>
        </a>
        <nav
          className={`desktop-nav ${menuOpen ? "mobile-open" : ""}`}
          aria-label="Main navigation"
        >
          {navItems.map(item => (
            <a
              className={item.id}
              key={item.id}
              href={`#${item.id}`}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <a className="nav-cta" href="#contact" onClick={closeMenu}>
            Discuss a project <ArrowUpRight size={15} strokeWidth={1.7} />
          </a>
        </nav>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id={sectionIds.home}>
        <section className="hero-section">
          <div
            className="hero-image"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="hero-wash" />
          <div className="hero-content page-width">
            <Reveal>
              <p className="eyebrow light">
                <span>01</span> Research · Development · Manufacturing
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h1>
                Thoughtful work.
                <br />
                <em>Made well.</em>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="hero-intro">
                Synecos is a Pune-based partner for ambitious ideas — from early
                research to dependable custom manufacturing.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <a className="text-link light-link" href="#about">
                Discover Synecos <ArrowDown size={16} />
              </a>
            </Reveal>
          </div>
          <div className="hero-foot page-width">
            <span>Established 2011 · Pune, India</span>
            <span className="scroll-note">
              <span className="scroll-line" /> Scroll to explore
            </span>
          </div>
        </section>

        <section id={sectionIds.about} className="about-section section-pad">
          <div className="page-width split-grid">
            <Reveal>
              <SectionLabel>About Synecos</SectionLabel>
              <span className="about-logo">
                <img src={aboutLogo} alt="" />
              </span>
            </Reveal>
            <div className="about-copy">
              <Reveal delay={60}>
                <h2>
                  A steady hand for <em>complex work.</em>
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="lead-copy">
                  For more than a decade, we have helped organisations move from
                  a promising brief to something real, reliable and ready for
                  the world.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <p>
                  Our work sits at the intersection of curiosity and rigour. We
                  bring thoughtful research, practical development and
                  disciplined execution together under one roof — with the
                  clarity and care that meaningful partnerships require.
                </p>
              </Reveal>
              <Reveal delay={230}>
                <a className="text-link dark-link" href="#capabilities">
                  How we can help <ArrowUpRight size={16} />
                </a>
              </Reveal>
            </div>
          </div>
          <div className="page-width about-note">
            <span className="year-mark">2011</span>
            <p>
              Founded in Pune with a simple belief: good work is built through
              attention, patience and trust.
            </p>
          </div>
        </section>

        <section
          id={sectionIds.capabilities}
          className="capabilities-section section-pad dark-section"
        >
          <div className="page-width">
            <div className="section-heading-row">
              <Reveal>
                <SectionLabel>What we do</SectionLabel>
              </Reveal>
              <Reveal delay={80}>
                <p className="section-aside">
                  One connected team, supporting the journey from first question
                  to finished outcome.
                </p>
              </Reveal>
            </div>
            <div className="capability-list">
              {capabilities.map((capability, index) => (
                <Reveal key={capability.number} delay={index * 70}>
                  <div className="capability-row">
                    <span className="capability-no">{capability.number}</span>
                    <h3>{capability.title}</h3>
                    <p>{capability.description}</p>
                    <ArrowUpRight
                      className="capability-arrow"
                      size={19}
                      strokeWidth={1.5}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id={sectionIds.approach}
          className="approach-section section-pad"
        >
          <div className="page-width approach-grid">
            <div className="approach-visual">
              <Reveal>
                <div className="image-frame">
                  <img
                    src={teamImage}
                    alt="Synecos team collaborating in a bright work environment"
                  />
                  <span className="image-caption">
                    The value of good work is often in the details.
                  </span>
                </div>
              </Reveal>
            </div>
            <div className="approach-content">
              <Reveal>
                <SectionLabel>Our approach</SectionLabel>
              </Reveal>
              <Reveal delay={70}>
                <h2>
                  Clear thinking.
                  <br />
                  <em>Quiet confidence.</em>
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="lead-copy">
                  We believe the best partnerships feel straightforward. The
                  right questions are asked early, expectations are clear and
                  every stage is handled with care.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <ul className="principles-list">
                  <li>
                    <span>
                      <Check size={15} />
                    </span>
                    <div>
                      <strong>Listen first</strong>
                      <small>
                        Understand the brief, the context and what success
                        really means.
                      </small>
                    </div>
                  </li>
                  <li>
                    <span>
                      <Check size={15} />
                    </span>
                    <div>
                      <strong>Work with intent</strong>
                      <small>
                        Make decisions that are thoughtful, practical and built
                        to last.
                      </small>
                    </div>
                  </li>
                  <li>
                    <span>
                      <Check size={15} />
                    </span>
                    <div>
                      <strong>Stay accountable</strong>
                      <small>
                        Communicate openly, keep promises and take ownership of
                        the outcome.
                      </small>
                    </div>
                  </li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section
          className="facility-section"
          id={sectionIds.facility}
          style={{ backgroundImage: `url("${facilityImage}")` }}
        >
          <div className="page-width facility-intro">
            <Reveal>
              <SectionLabel>Inside Synecos</SectionLabel>
            </Reveal>
            <Reveal delay={70}>
              <div className="facility-intro__content">
                <h2>
                  Purposeful spaces.
                  <br />
                  <em>Considered systems.</em>
                </h2>
                <p className="facility-intro__copy">
                  A team that takes pride in doing things properly.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id={sectionIds.industries}
          className="industries-section section-pad"
        >
          <div className="page-width industries-grid">
            <Reveal>
              <SectionLabel>Across industries</SectionLabel>
            </Reveal>
            <div>
              <Reveal delay={60}>
                <h2>
                  Built to support <em>what comes next.</em>
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="industries-copy">
                  Our experience travels well across sectors, particularly where
                  quality, responsiveness and a thoughtful partner matter most.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="industry-tags">
                  {[
                    "Specialty chemicals",
                    "Pharmaceuticals",
                    "Nutraceuticals",
                    "Personal care",
                    "Materials & more",
                  ].map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section
          id={sectionIds.contact}
          className="contact-section dark-section"
        >
          <div className="page-width contact-grid">
            <div>
              <Reveal>
                <SectionLabel>Start a conversation</SectionLabel>
              </Reveal>
              <Reveal delay={70}>
                <h2>
                  Have a thoughtful
                  <br />
                  <em>project in mind?</em>
                </h2>
              </Reveal>
            </div>
            <div className="contact-side">
              <Reveal delay={120}>
                <p>
                  Tell us a little about what you are working on. We would be
                  glad to understand the brief and explore where we can help.
                </p>
              </Reveal>
              <Reveal delay={170}>
                <button
                  className="contact-button"
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
                >
                  Send An Enquiry
                  <ArrowUpRight size={17} />
                </button>
              </Reveal>
              <Reveal delay={220}>
                <div className="contact-details">
                  <a href="mailto:deepak.s@synecos.in">
                    <Mail size={15} /> deepak.s@synecos.in
                  </a>
                  <a href="tel:+917798400011">
                    <Phone size={15} /> +91 7798400011
                  </a>
                  <span>
                    <MapPin size={15} /> Pune, Maharashtra · India
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-top">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              <img src={aboutLogo} alt="" />
            </span>
            <span className="brand-copy">
              <strong>Synecos</strong>
              <small>Organics Pvt. Ltd.</small>
            </span>
          </a>
          <p>
            Research with purpose.
            <br />
            Manufacturing with care.
          </p>
          <a className="back-top" href="#top">
            Back to top <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="page-width footer-bottom">
          <span>© 2026 Synecos Organics Pvt. Ltd.</span>
          <span>
            Made in Pune, India <Leaf size={13} />
          </span>
        </div>
      </footer>

      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent
          className="enquiry-dialog"
          aria-describedby="enquiry-description"
        >
          <DialogHeader className="enquiry-dialog__header">
            <p className="enquiry-dialog__eyebrow">Start a conversation</p>
            <DialogTitle>Tell us about your project.</DialogTitle>
            <DialogDescription id="enquiry-description">
              Share a few details and our team will get back to you.
            </DialogDescription>
          </DialogHeader>

          <form className="enquiry-form" onSubmit={handleEnquirySubmit}>
            <div className="enquiry-form__grid">
              <label>
                Full name <span aria-hidden="true">*</span>
                <input name="name" type="text" autoComplete="off" required />
              </label>
              <label>
                Phone number <span aria-hidden="true">*</span>
                <input name="phone" type="tel" autoComplete="off" required />
              </label>
              <label>
                Work email <span aria-hidden="true">*</span>
                <input name="email" type="email" autoComplete="off" required />
              </label>
            </div>
            <label className="enquiry-form__message">
              Project description <span aria-hidden="true">*</span>
              <textarea
                name="description"
                rows={5}
                required
                placeholder="What would you like to create, develop or manufacture?"
              />
            </label>
            <div className="enquiry-form__footer">
              <p>
                <span aria-hidden="true">*</span> Required fields
              </p>
              <button className="enquiry-form__submit" type="submit">
                Send enquiry <ArrowUpRight size={17} />
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Home;
