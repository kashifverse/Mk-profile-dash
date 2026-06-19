import { Project } from "../types";
import { 
  X, 
  MapPin, 
  CheckCircle, 
  Terminal, 
  AlertTriangle, 
  LineChart, 
  BookOpen,
  Compass
} from "lucide-react";

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Background overlay click-off */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-2xl h-full bg-surface-container border-l border-outline-variant/40 shadow-2xl overflow-y-auto flex flex-col z-10 animate-slide-left p-6 md:p-8">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center mb-6 border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-primary/20 text-primary font-mono-data text-[10px] uppercase rounded border border-primary/20">
              {project.category}
            </span>
            <span className="text-outline text-xs font-mono-data">•</span>
            <span className="text-xs text-outline font-mono-data flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {project.coordinates.split("(")[0]}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Title & Hero */}
        <div className="mb-6">
          <h2 className="font-headline-xl text-headline-lg text-on-surface mb-2 font-bold tracking-tight">
            {project.title}
          </h2>
          <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
            {project.coordinates}
          </p>
        </div>

        {/* Project featured image banner */}
        <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-8 border border-outline-variant/30 bg-surface">
          {project.image === "explore" ? (
            <div className="w-full h-full bg-surface-container-highest flex flex-col items-center justify-center p-8 text-center text-outline">
              <Compass className="w-16 h-16 text-primary/30 mb-3 animate-spin"/>
              <p className="font-mono-data text-sm font-bold">HISTORICAL CHART SYSTEM</p>
            </div>
          ) : (
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Methodology Content Bento */}
        <div className="space-y-6 flex-1 pr-1">
          
          {/* Background and Motivation */}
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-[#cabff9]" />
              <h4 className="font-mono-data text-xs uppercase tracking-widest text-on-surface font-semibold">
                Project Background
              </h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {project.caseStudy.background}
            </p>
          </div>

          {/* Core Analytical Challenge */}
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="font-mono-data text-xs uppercase tracking-widest text-[#ffb4ab] font-semibold">
                The GIS Challenge
              </h4>
            </div>
            <p className="text-xs text-[#ffb4ab]/90 leading-relaxed">
              {project.caseStudy.challenge}
            </p>
          </div>

          {/* Methodology / Pipeline */}
          <div className="bg-surface-container-low p-5 rounded-xl border border-[#7c87f3]/25">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-[#7c87f3]" />
              <h4 className="font-mono-data text-xs uppercase tracking-widest text-primary font-semibold">
                Applied Methodology
              </h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              {project.caseStudy.methodology}
            </p>
            {/* Tech chips used for the project */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.tools.map((sh, idx) => (
                <span 
                  key={idx} 
                  className="bg-primary/10 text-[#bdc2ff] text-[10px] font-mono-data px-2.5 py-1 rounded border border-[#7c87f3]/20"
                >
                  {sh}
                </span>
              ))}
            </div>
          </div>

          {/* Results and Impact */}
          <div className="bg-surface-container-low p-5 rounded-xl border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <LineChart className="w-4 h-4 text-emerald-400" />
              <h4 className="font-mono-data text-xs uppercase tracking-widest text-emerald-300 font-semibold">
                Sensing Results & Impact
              </h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed font-body-md">
              {project.caseStudy.results}
            </p>
          </div>

        </div>

        {/* Slide-over Footer callback */}
        <div className="mt-8 pt-4 border-t border-outline-variant/10 flex justify-between items-center text-outline text-[11px] font-mono-data">
          <span>COORDINATE MASK VALIDATED</span>
          <button 
            onClick={onClose}
            className="text-primary hover:underline font-bold"
          >
            Close case study
          </button>
        </div>

      </div>
    </div>
  );
}
