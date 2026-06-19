import React, { useState, useEffect } from "react";
import SpatialShader from "./components/SpatialShader";
import MapSandbox from "./components/MapSandbox";
import GeospatialCopilot from "./components/GeospatialCopilot";
import CaseStudyModal from "./components/CaseStudyModal";
import { PROJECTS_DATA } from "./data";
import { Project, SavedContactMessage } from "./types";
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  Navigation, 
  Terminal, 
  Layers, 
  Send, 
  ArrowUpRight, 
  Check, 
  ExternalLink,
  MessageSquare,
  Activity,
  Award,
  Globe,
  Menu,
  X
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  
  // Contact state
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactSubject, setContactSubject] = useState<string>("");
  const [contactMessage, setContactMessage] = useState<string>("");
  const [savedMessages, setSavedMessages] = useState<SavedContactMessage[]>([]);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>(false);
  
  // Mobile navbar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Load submissions log on start
  useEffect(() => {
    const list = localStorage.getItem("mk_inquiries");
    if (list) {
      try {
        setSavedMessages(JSON.parse(list));
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    const newInquiry: SavedContactMessage = {
      id: `msg-${Date.now()}`,
      name: contactName,
      email: contactEmail,
      subject: contactSubject || "General Spatial Inquiry",
      message: contactMessage,
      timestamp: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      replyText: "Thank you for the message! I have dispatched this vector telemetry directly to my inbox. I will review and reply within 48 spatial coordinates clock units!"
    };

    const updated = [newInquiry, ...savedMessages];
    setSavedMessages(updated);
    localStorage.setItem("mk_inquiries", JSON.stringify(updated));

    // Clear form
    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactMessage("");

    setIsSubmitSuccess(true);
    setTimeout(() => {
      setIsSubmitSuccess(false);
    }, 4000);
  };

  const handleAboutScroll = () => {
    setActiveTab("home");
    setTimeout(() => {
      const el = document.getElementById("storyteller-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen text-on-surface bg-surface relative flex flex-col justify-between selection:bg-primary/30 font-sans overflow-all">
      
      {/* GLSL shader interactive space canvas in background */}
      <SpatialShader />

      {/* TOP HEADER NAVIGATION BAR */}
      <header className="fixed top-0 w-full z-40 bg-surface/65 backdrop-blur-md border-b border-outline-variant/30">
        <nav className="flex justify-between items-center h-16 px-6 md:px-16 max-w-7xl mx-auto">
          <div 
            onClick={() => setActiveTab("home")}
            className="font-display text-lg font-bold text-on-surface tracking-tighter cursor-pointer flex items-center gap-2 select-none"
          >
            <Compass className="w-5 h-5 text-primary rotate-45" />
            MK Spatial
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center font-mono text-xs uppercase tracking-widest font-semibold select-none">
            <button
              onClick={() => setActiveTab("home")}
              className={`pb-1 border-b-2 hover:text-primary transition-all cursor-pointer ${
                activeTab === "home" ? "border-primary text-primary" : "border-transparent text-on-surface-variant font-medium"
              }`}
            >
              Home
            </button>
            <button
              onClick={handleAboutScroll}
              className="text-on-surface-variant hover:text-primary pb-1 border-b-2 border-transparent transition-all cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`pb-1 border-b-2 hover:text-primary transition-all cursor-pointer ${
                activeTab === "projects" ? "border-primary text-primary" : "border-transparent text-on-surface-variant font-medium"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("sandbox")}
              className={`pb-1 border-b-2 hover:text-primary transition-all cursor-pointer ${
                activeTab === "sandbox" ? "border-primary text-primary" : "border-transparent text-on-surface-variant font-medium"
              }`}
            >
              Sandbox Toolkit
            </button>
            <button
              onClick={() => setActiveTab("copilot")}
              className={`pb-1 border-b-2 hover:text-primary transition-all cursor-pointer ${
                activeTab === "copilot" ? "border-primary text-primary" : "border-transparent text-on-surface-variant font-medium"
              }`}
            >
              AI Copilot
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`pb-1 border-b-2 hover:text-primary transition-all cursor-pointer ${
                activeTab === "contact" ? "border-primary text-primary" : "border-transparent text-on-surface-variant font-medium relative"
              }`}
            >
              Contact
              {savedMessages.length > 0 && (
                <span className="absolute -top-1.5 -right-3 h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* Mobile drawer toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-on-surface rounded hover:bg-surface-container-high cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-surface-container border-b border-outline-variant/30 flex flex-col p-4 space-y-3 font-mono text-[11px] uppercase tracking-widest">
            <button 
              onClick={() => { setActiveTab("home"); setIsMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-outline-variant/10 text-on-surface"
            >
              Home
            </button>
            <button 
              onClick={() => { handleAboutScroll(); setIsMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-outline-variant/10 text-on-surface-variant"
            >
              About
            </button>
            <button 
              onClick={() => { setActiveTab("projects"); setIsMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-outline-variant/10 text-on-surface-variant"
            >
              Projects
            </button>
            <button 
              onClick={() => { setActiveTab("sandbox"); setIsMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-outline-variant/10 text-on-surface-variant"
            >
              Sandbox Toolkit
            </button>
            <button 
              onClick={() => { setActiveTab("copilot"); setIsMobileMenuOpen(false); }}
              className="text-left py-2 border-b border-outline-variant/10 text-on-surface-variant"
            >
              AI Copilot
            </button>
            <button 
              onClick={() => { setActiveTab("contact"); setIsMobileMenuOpen(false); }}
              className="text-left py-2 text-on-surface-variant"
            >
              Contact {savedMessages.length > 0 && `(${savedMessages.length})`}
            </button>
          </div>
        )}
      </header>

      {/* CORE SCREENS MAIN WRAPPER */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-16 pt-24 pb-20 flex-1">
        
        {/* TAB 1: HOME PANEL */}
        {activeTab === "home" && (
          <div className="space-y-24">
            
            {/* HERO SECTION */}
            <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center select-none">
              
              {/* Vibe subtitle chip */}
              <div className="inline-block px-4 py-1.5 mb-6 glass-card rounded-full border border-[#7c87f3]/25 shadow-sm">
                <span className="font-mono text-[10px] text-primary uppercase tracking-[0.25em] font-semibold">
                  Designing the Future of Data
                </span>
              </div>

              {/* Big Display Name */}
              <h1 className="font-display text-5xl md:text-8xl text-on-surface font-semibold tracking-tight leading-tight mb-4 drop-shadow-sm select-text">
                Mohammad Kashif
              </h1>

              {/* Role identifiers */}
              <p className="font-sans text-md md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 select-text font-normal leading-relaxed">
                Geography Student <span className="text-primary/75 px-1 font-mono">•</span> GIS Analyst <span className="text-primary/75 px-1 font-mono">•</span> Spatial Data Enthusiast
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => setActiveTab("projects")}
                  className="bg-primary hover:bg-[#7c87f3] text-on-primary font-mono text-xs uppercase tracking-wider font-bold py-4 px-10 rounded-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  View Projects
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTab("sandbox")}
                  className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/35 text-on-surface font-mono text-xs uppercase tracking-wider font-bold py-4 px-10 rounded-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  Live Sandbox
                  <Layers className="w-4 h-4 text-primary" />
                </button>
              </div>

              {/* Coordinate marker decoration in margins */}
              <div className="absolute bottom-4 left-0 hidden md:block">
                <p className="font-mono text-[11px] text-outline tracking-widest uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  COORD: 25.1972° N, 55.2744° E
                </p>
              </div>
            </section>

            {/* ABOUT ME SECTION (The Spatial Storyteller) */}
            <section id="storyteller-section" className="py-12 border-t border-outline-variant/10 scroll-mt-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 relative">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden glass-card p-2.5 border border-outline-variant/30">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-surface-container relative">
                      <img 
                        className="w-full h-full object-cover" 
                        alt="Mohammad Kashif portrait" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-Nyp-xDFyqsibGQjGGjvVoFxYlB9EqwSxJ2CU58gvsbv-YSkXzM0UpZgj9WVlqERslkWsX0QZpukyKTQcBSH29GA6v2TpKKGO-VrhtIO-PMKjBaRIzvuVsZhEuTzyVM3CrdnNCJ8hA1rLjeSWuBcswM0_WRaCxv_cpuB1hXYsAYzPTAW7w8FMdwdJq__HLxjb3XU6X-7lug_ZCRNKtEKr-xSCFgvndQ5AeiGrohR5nld9HzaZSBO_J6JMNAYo-XEN3z2PUJulC4M"
                      />
                      <div className="absolute inset-0 bg-[#0e0e15]/20 mix-blend-color" />
                    </div>
                  </div>
                  {/* Grid decoration */}
                  <div 
                    className="absolute -bottom-6 -right-6 w-32 h-32 opacity-25 z-[-1]"
                    style={{
                      backgroundImage: "linear-gradient(to right, #C5A059 1px, transparent 1px), linear-gradient(to bottom, #C5A059 1px, transparent 1px)",
                      backgroundSize: "16px 16px"
                    }}
                  />
                </div>

                {/* About Content */}
                <div className="lg:col-span-7 space-y-6">
                  <h2 className="font-display text-3xl md:text-4xl font-light text-on-surface border-l-4 border-primary pl-6 tracking-wide">
                    The Spatial <span className="italic font-normal text-primary">Storyteller</span>
                  </h2>
                  <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
                    <p>
                      I am a geography student and GIS analyst dedicated to the art of <span className="text-primary font-medium">Turning maps, data, and geography into meaningful stories.</span> My work bridges the gap between raw spatial information and human-centric narratives.
                    </p>
                    <p>
                      With a focus on precision and clarity, I leverage advanced geospatial technologies to solve complex urban heat stresses, coast dynamics, and logistical chain bottlenecks. Every pixel of telemetry represents real-world physical changes, and I strive to make those impacts visible and actionable.
                    </p>
                  </div>

                  {/* High quality stat card blocks */}
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className="glass-card p-5 rounded-2xl text-center border border-outline-variant/20 bg-surface-container-lowest/40">
                      <span className="block text-primary font-display text-3xl font-extrabold mb-1">3+</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-outline">Years Experience</span>
                    </div>
                    <div className="glass-card p-5 rounded-2xl text-center border border-outline-variant/20 bg-surface-container-lowest/40">
                      <span className="block text-primary font-display text-3xl font-extrabold mb-1">50+</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-outline">Maps Rendered</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* MASTERY & TOOLKIT (Bento Style Grid) */}
            <section className="py-12 border-t border-outline-variant/15">
              <div className="text-center mb-12">
                <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] font-semibold mb-2 block">
                  Skill index
                </span>
                <h3 className="font-display text-3xl font-bold tracking-tight text-on-surface mb-3">
                  Mastery & Toolkit
                </h3>
                <p className="text-on-surface-variant text-xs max-w-lg mx-auto">
                  The technical intersection of geographic precision and cartographic storytelling.
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 md:rows-2 gap-6 select-all">
                
                {/* Bento 1: GIS */}
                <div className="md:col-span-2 glass-card p-8 rounded-2xl border border-outline-variant/30 bg-surface-container-low flex flex-col justify-between group hover:border-[#7c87f3]/50 transition-all duration-300">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h4 className="font-display text-lg text-on-surface font-semibold mb-3">
                      GIS & Spatial Analysis
                    </h4>
                    <p className="text-on-surface-variant text-xs leading-relaxed">
                      Advanced geoprocessing, topological modeling, and data overlays to uncover regional trends.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 w-full pt-8">
                    <span className="bg-secondary-container/20 text-secondary font-mono text-[9px] px-2.5 py-1 rounded border border-secondary/35">ArcGIS Pro</span>
                    <span className="bg-secondary-container/20 text-secondary font-mono text-[9px] px-2.5 py-1 rounded border border-secondary/35">QGIS</span>
                    <span className="bg-secondary-container/20 text-secondary font-mono text-[9px] px-2.5 py-1 rounded border border-secondary/35">PostGIS</span>
                  </div>
                </div>

                {/* Bento 2: Remote Sensing */}
                <div className="md:col-span-1 glass-card p-8 rounded-2xl border border-outline-variant/30 bg-surface-container-low flex flex-col justify-between hover:border-[#7c87f3]/50 transition-all duration-300">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-[#cabff9]/10 text-[#cabff9] flex items-center justify-center mb-6">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h4 className="font-display text-md text-on-surface font-semibold mb-3">
                      Remote Sensing
                    </h4>
                    <p className="text-on-surface-variant text-xs leading-relaxed">
                      Extracting raster metrics from multispectral imagery and LiDAR cloud arrays.
                    </p>
                  </div>
                  <span className="font-mono text-[9px] text-tertiary uppercase tracking-widest pt-8">
                    ENVI / ERDAS IMAGINE
                  </span>
                </div>

                {/* Bento 3: Programming Stack */}
                <div className="md:col-span-1 glass-card p-8 rounded-2xl border border-outline-variant/30 bg-surface-container-low flex flex-col justify-between hover:border-[#7c87f3]/50 transition-all duration-300">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <h4 className="font-display text-md text-on-surface font-semibold mb-3">
                      DevStack
                    </h4>
                    <p className="text-on-surface-variant text-xs leading-relaxed">
                      Automating geoprocessing engines with custom vector calculations.
                    </p>
                  </div>
                  <span className="font-mono text-[9px] text-primary uppercase tracking-widest pt-8">
                    PYTHON / JS / SQL
                  </span>
                </div>

                {/* Bento 4: Digital Cartography full-width */}
                <div className="md:col-span-4 glass-card p-8 rounded-2xl border border-outline-variant/30 bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-8 hover:border-[#7c87f3]/50 transition-all duration-300 overflow-hidden relative">
                  <div className="md:w-1/2 z-10">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h4 className="font-display text-lg text-on-surface font-semibold mb-3">
                      Digital Cartography
                    </h4>
                    <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                      High-end static and dynamic map design balancing mathematical rigour and color harmonies. Using Mapbox templates for spatial vector structures.
                    </p>
                    <button 
                      onClick={() => setActiveTab("sandbox")}
                      className="text-primary hover:text-[#7c87f3] hover:underline font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      EXPLORE DIGITAL TOOLKIT <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Decorative background grid tilt */}
                  <div className="absolute right-0 top-0 bottom-0 w-2/5 opacity-15 pointer-events-none hidden md:block">
                    <div 
                      className="w-full h-full rotate-12 scale-150"
                      style={{
                        backgroundImage: "linear-gradient(to right, #bdc2ff 1px, transparent 1px), linear-gradient(to bottom, #bdc2ff 1px, transparent 1px)",
                        backgroundSize: "24px 24px"
                      }}
                    />
                  </div>

                  <div className="md:w-5/12 h-44 rounded-xl border border-outline-variant/40 bg-surface-container-lowest flex items-center justify-center">
                    <span className="text-outline/45 font-mono text-xs tracking-wider animate-pulse uppercase">
                      TOPOGRAPHIC_LAYER_01.SHP
                    </span>
                  </div>
                </div>

              </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-surface-container-low border border-outline-variant/20 p-8 md:p-12 rounded-2xl text-center relative overflow-hidden select-none">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <h3 className="font-display text-2xl md:text-3xl text-on-surface font-semibold mb-4">
                Ready to map the next big idea?
              </h3>
              <p className="text-on-surface-variant text-sm max-w-lg mx-auto mb-8 font-medium">
                I am always looking for collaborative research opportunities at the alignment of geography information and vector styling.
              </p>
              <button 
                onClick={() => setActiveTab("contact")}
                className="bg-primary hover:bg-[#7c87f3] text-on-primary font-mono text-xs uppercase tracking-wider font-bold py-4.5 px-12 rounded-full cursor-pointer shadow-md transition-all active:scale-95"
              >
                Start a Conversation
              </button>
            </section>

          </div>
        )}

        {/* TAB 2: PROJECTS VIEW */}
        {activeTab === "projects" && (
          <div className="space-y-16">
            
            {/* Header section identical to Mockup #1 */}
            <header className="mb-12 border-b border-outline-variant/20 pb-8 select-none">
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2 block">
                Portfolio
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-on-surface font-extrabold tracking-tight">
                Selected Projects
              </h1>
              <div className="w-20 h-1 bg-primary mt-6 rounded" />
            </header>

            {/* Projects list containing Featured + grids */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* FEATURED: DIGITAL MEDIA MANAGEMENT (Full 12 columns) */}
              {PROJECTS_DATA.filter(p => p.featured).map((project) => (
                <article 
                  key={project.id}
                  className="md:col-span-12 glass-card rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col lg:flex-row group"
                >
                  {/* Aspect image banner */}
                  <div className="lg:w-2/3 h-[380px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#553b70]/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {/* Project description box */}
                  <div className="lg:w-1/3 p-8 flex flex-col justify-center bg-secondary-container/5 relative z-10 border-t lg:border-t-0 lg:border-l border-outline-variant/30">
                    <div className="flex gap-2 mb-4">
                      {project.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 bg-tertiary/20 text-tertiary font-mono text-[9px] uppercase rounded border border-tertiary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-on-surface mb-3">
                      {project.title}
                    </h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed mb-8">
                      {project.description}
                    </p>
                    <button 
                      onClick={() => setSelectedCaseStudy(project)}
                      className="w-fit px-6 py-3 bg-primary text-on-primary hover:bg-[#7c87f3] transition-colors rounded font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      View Case Study <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}

              {/* SECONDARY PROJECTS GRID */}
              {PROJECTS_DATA.filter(p => !p.featured).map((project) => (
                <article 
                  key={project.id}
                  onClick={() => setSelectedCaseStudy(project)}
                  className={`md:col-span-6 lg:col-span-4 glass-card rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col group cursor-pointer hover:border-primary/55 hover:shadow-[0_0_24px_rgba(124,133,241,0.1)] transition-all`}
                >
                  <div className="h-56 relative overflow-hidden bg-surface-container-highest/25 flex items-center justify-center">
                    {project.image === "explore" ? (
                      <div className="text-center p-8">
                        <Compass className="w-12 h-12 text-primary/40 mb-3 mx-auto animate-spin-slow" />
                        <p className="font-mono text-[10px] text-outline uppercase tracking-widest">
                          Project Archive
                        </p>
                      </div>
                    ) : (
                      <img 
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between bg-secondary-container/5">
                    <div>
                      <div className="flex gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-primary/20 text-primary font-mono text-[9px] uppercase rounded">
                          {project.category}
                        </span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-on-surface tracking-tight mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-outline-variant/10 flex justify-between items-center text-[10px] font-mono tracking-wider text-outline uppercase">
                      <span>{project.date} • {project.tags[1] || "GIS"}</span>
                      <ArrowUpRight className="w-4 h-4 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}

            </div>

            {/* INTERACTIVE CTA SECTION */}
            <div className="mt-20 p-8 md:p-12 glass-card rounded-2xl border border-outline-variant/30 text-center relative overflow-hidden select-none">
              <h3 className="font-display text-2xl font-bold text-on-surface mb-3">
                Have a project in mind?
              </h3>
              <p className="text-on-surface-variant text-sm max-w-lg mx-auto mb-8 font-medium">
                Let's discuss how spatial metrics, satellite data, and creative storytelling can transform your next big idea.
              </p>
              <button 
                onClick={() => setActiveTab("contact")}
                className="bg-primary hover:bg-[#7c87f3] text-on-primary font-mono text-xs uppercase tracking-wider font-bold py-4 px-10 rounded shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Get In Touch
              </button>
            </div>

          </div>
        )}

        {/* TAB 3: DYNAMIC MAP SANDBOX TOOLKIT */}
        {activeTab === "sandbox" && (
          <div className="space-y-12">
            <header className="border-b border-outline-variant/20 pb-6 select-none">
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2 block">
                Workspace
              </span>
              <h1 className="font-display text-4xl font-extrabold tracking-tight">
                Digital Cartography Toolkit
              </h1>
            </header>
            
            <MapSandbox />
          </div>
        )}

        {/* TAB 4: GEOSPATIAL COPILOT CHAT DRAWER */}
        {activeTab === "copilot" && (
          <div className="space-y-12">
            <header className="border-b border-outline-variant/20 pb-6 select-none">
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2 block">
                Research Lab
              </span>
              <h1 className="font-display text-4xl font-extrabold tracking-tight">
                Geospatial AI Assistant
              </h1>
            </header>

            <GeospatialCopilot />
          </div>
        )}

        {/* TAB 5: CONTACT INQUIRIES REGISTER */}
        {activeTab === "contact" && (
          <div className="space-y-12">
            <header className="border-b border-outline-variant/20 pb-6 select-none">
              <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2 block">
                Registry
              </span>
              <h1 className="font-display text-4xl font-extrabold tracking-tight">
                Geospatial Pipeline Contact
              </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Submit */}
              <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="font-display text-lg font-bold text-on-surface mb-1">
                    Dispatch Spatial Telemetry Message
                  </h3>
                  <p className="text-on-surface-variant text-xs">
                    File your inquiries or requests directly. Submissions generate interactive local vector state responses.
                  </p>
                </div>

                {isSubmitSuccess && (
                  <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20 font-bold flex items-center gap-2 animate-bounce">
                    <Check className="w-4 h-4 shrink-0" /> Inquiry dispatched successfully! Simulated AI response populated in index drawer.
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-[11px] uppercase tracking-wider text-on-surface">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10.5px] text-outline mb-1.5 font-bold">Inquirer Name *</label>
                      <input 
                        type="text" 
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Dr. Helen Miller"
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-xs text-on-surface uppercase focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] text-outline mb-1.5 font-bold">Email Coordinate *</label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. helen@spatialresearch.org"
                        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-xs text-on-surface focus:outline-none focus:border-primary font-mono lowercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] text-outline mb-1.5 font-bold">Subject Corridor</label>
                    <input 
                      type="text" 
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="e.g. Coastal Modeling Collaboration"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-xs text-on-surface uppercase focus:outline-none focus:border-primary font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] text-outline mb-1.5 font-bold">Inquiry Message Block *</label>
                    <textarea 
                      required
                      rows={5}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="e.g. Hello Mohammad, I am planning a spatial survey of shore accretion profiles..."
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-4 py-3 text-xs text-on-surface font-sans uppercase focus:outline-none focus:border-primary placeholder:font-mono"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-[#7c87f3] text-on-primary text-xs font-bold font-mono uppercase tracking-widest py-4 px-6 rounded transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    Dispatch Message Stream
                  </button>
                </form>
              </div>

              {/* Right Column: Local inquiries log */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6">
                  <h3 className="font-display text-sm font-bold text-on-surface mb-1 flex items-center justify-between">
                    <span>Local Transmission Inquiries Logs</span>
                    <span className="bg-[#7c87f3]/20 text-primary text-[10px] font-mono-data font-semibold uppercase px-2 py-0.5 rounded border border-[#7c87f3]/40">
                      {savedMessages.length} logs
                    </span>
                  </h3>
                  <p className="text-on-surface-variant text-[11px] mb-6">
                    Inquiries logged in local storage sandbox:
                  </p>

                  <div className="space-y-4 max-h-[340px] overflow-y-auto scrollbar-thin pr-1 select-all">
                    {savedMessages.length === 0 ? (
                      <div className="p-8 text-center text-outline/50 border border-dashed border-outline-variant/20 rounded-xl bg-surface-container-lowest/30">
                        <MessageSquare className="w-8 h-8 text-outline/30 mx-auto mb-2" />
                        <p className="font-mono text-[10px] uppercase tracking-wide">No active inquiries</p>
                      </div>
                    ) : (
                      savedMessages.map((msg) => (
                        <div key={msg.id} className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 space-y-3 font-mono text-[11px] animate-fade-in">
                          <div className="flex justify-between items-start text-outline">
                            <div className="font-bold text-primary max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                              {msg.name} ({msg.email})
                            </div>
                            <span className="text-[9px] text-right font-medium">{msg.timestamp}</span>
                          </div>
                          
                          <div className="text-[10px] text-on-surface font-semibold uppercase">
                            SUBJ: {msg.subject}
                          </div>
                          
                          <p className="text-[10px] text-on-surface-variant lowercase italic select-text">
                            "{msg.message}"
                          </p>

                          {msg.replyText && (
                            <div className="mt-2 pt-2 border-t border-outline-variant/10 bg-primary/5 p-2 rounded text-[9.5px] text-primary tracking-normal select-text leading-relaxed">
                              <span className="font-bold text-[#bdc2ff] uppercase block mb-1">AUTOMATED CARTOGRAPHY AI REPLY:</span>
                              {msg.replyText}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* CaseStudy modal component */}
      <CaseStudyModal 
        project={selectedCaseStudy} 
        onClose={() => setSelectedCaseStudy(null)} 
      />

      {/* GLOBAL FOOTER */}
      <footer className="w-full bg-surface-container border-t border-outline-variant/30 select-none">
        <div className="flex flex-col md:flex-row justify-between items-center py-6 px-6 md:px-16 max-w-7xl mx-auto gap-4">
          <div>
            <p className="font-mono text-[10px] text-on-surface-variant opacity-85">
              © 2024 Mohammad Kashif. Turning maps into stories.
            </p>
          </div>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-widest text-[#cabff9] hover:text-primary">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              GitHub
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:opacity-100 opacity-75 transition-opacity"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
