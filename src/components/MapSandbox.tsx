import { useState, useMemo } from "react";
import { MAP_PRESETS } from "../data";
import { MapPreset } from "../types";
import { 
  Globe, 
  Layers, 
  MapPin, 
  Sliders, 
  RefreshCw, 
  TrendingUp, 
  Thermometer, 
  Ship, 
  Compass, 
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function MapSandbox() {
  const [selectedPreset, setSelectedPreset] = useState<MapPreset>(MAP_PRESETS[0]);
  const [customLat, setCustomLat] = useState<string>("25.1972");
  const [customLng, setCustomLng] = useState<string>("55.2744");
  const [customName, setCustomName] = useState<string>("Custom Query Coordinate");
  const [isRenderLoaded, setIsRenderLoaded] = useState<boolean>(true);
  
  // Layer states
  const [showContours, setShowContours] = useState<boolean>(true);
  const [showErosion, setShowErosion] = useState<boolean>(false);
  const [showHeatMap, setShowHeatMap] = useState<boolean>(false);
  const [showLogistics, setShowLogistics] = useState<boolean>(false);
  const [showSatelliteScan, setShowSatelliteScan] = useState<boolean>(true);

  // Resolution controls
  const [contourInterval, setContourInterval] = useState<number>(10);
  const [oceanDepth, setOceanDepth] = useState<number>(40);

  // Validate and render custom coordinates
  const handleRenderCustom = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      alert("Please enter a valid Latitude between -90 and 90.");
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      alert("Please enter a valid Longitude between -180 and 180.");
      return;
    }

    setIsRenderLoaded(false);
    
    // Simulate complex contour recalculation
    setTimeout(() => {
      // Create a pseudo-random elevation set based on the coordinates input
      const seed = Math.abs(Math.sin(lat) * Math.cos(lng));
      const newRanges = Array.from({ length: 10 }, (_, i) => {
        return Math.floor(50 + seed * 300 + Math.sin(i * seed) * 120);
      });

      const newPreset: MapPreset = {
        id: "custom-coord",
        name: customName || `Coordinate Query Sandbox`,
        lat: lat,
        lng: lng,
        coordinatesLabel: `${lat.toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${lng.toFixed(4)}° ${lng >= 0 ? "E" : "W"}`,
        description: `User defined custom topology layer. Grid calculation computed natively using spatial indices.`,
        elevationRanges: newRanges,
        baseShapeSeed: seed * 5
      };

      setSelectedPreset(newPreset);
      setIsRenderLoaded(true);
    }, 600);
  };

  // Helper values for generating aesthetic SVG polygons/paths simulating GIS elevations
  const contourPaths = useMemo(() => {
    const seed = selectedPreset.baseShapeSeed;
    const ranges = selectedPreset.elevationRanges;
    
    return ranges.map((elevation, idx) => {
      const radiusX = 140 - idx * 11 + Math.sin(seed * idx) * 15;
      const radiusY = 100 - idx * 8 + Math.cos(seed * idx) * 12;
      const centerX = 240 + Math.cos(idx + seed) * 10;
      const centerY = 160 + Math.sin(idx * 0.8 + seed) * 6;
      
      // Draw a wavy blob-like path instead of a perfect ellipse
      let d = "";
      const points = 8;
      for (let i = 0; i <= points; i++) {
        const angle = (i * 2 * Math.PI) / points;
        const wave = 1 + Math.sin(angle * 3 + idx) * 0.12 * (1 - idx/14);
        const x = centerX + Math.cos(angle) * radiusX * wave;
        const y = centerY + Math.sin(angle) * radiusY * wave;
        
        if (i === 0) {
          d += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        } else {
          d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        }
      }
      d += " Z";
      
      return {
        path: d,
        elevation: elevation + Math.floor(idx * contourInterval),
        index: idx
      };
    });
  }, [selectedPreset, contourInterval]);

  // Coastal Shoreline shift simulating multi-temporal predictive remote sensing
  const erosionPaths = useMemo(() => {
    const seed = selectedPreset.baseShapeSeed;
    
    // Original shoreline
    let baseD = "M 40 280 C 140 280, 200 120, 310 180 C 370 216, 420 100, 480 120";
    
    // Future eroded Shoreline projection overlay
    let futureD = "M 40 295 C 130 290, 180 145, 298 200 C 355 235, 400 115, 480 135";
    
    return { baseD, futureD };
  }, [selectedPreset]);

  // Heat hotspot points representing concrete vs thermal mitigations
  const heatPoints = useMemo(() => {
    const seed = selectedPreset.baseShapeSeed;
    return [
      { x: 140, y: 130, radius: 45, val: "38.2°C", name: "Asphalt Hub A" },
      { x: 380, y: 190, radius: 60, val: "41.6°C", name: "Industrial Center" },
      { x: 260, y: 90, radius: 35, val: "39.8°C", name: "High-Rise Cluster" },
      { x: 220, y: 240, radius: 55, val: "24.5°C", name: "Green Cool Park", cool: true },
      { x: 340, y: 100, radius: 40, val: "22.8°C", name: "Water Canal Corridor", cool: true }
    ].map(p => {
      // Shift coords slightly based on preset seed to make presets distinct
      const offset = (Math.sin(p.x * seed) * 15);
      return {
        ...p,
        x: p.x + offset,
        y: p.y + (Math.cos(p.y * seed) * 12)
      };
    });
  }, [selectedPreset]);

  // Shipping routes / logistics chokepoints
  const logisticRoutes = useMemo(() => {
    const seed = selectedPreset.baseShapeSeed;
    return [
      { id: 1, d: "M 60 80 Q 240 180 420 80", critical: "Strait Chokepoint Alpha", load: "High" },
      { id: 2, d: "M 80 240 Q 240 140 400 240", critical: "Vulnerability Pass Beta", load: "Moderate" },
      { id: 3, d: "M 120 40 T 360 260", critical: "Container Route Delta", load: "Low" }
    ].map(r => {
      return {
        ...r,
        vesselCount: Math.floor(12 + Math.abs(Math.sin(r.id + seed) * 45))
      };
    });
  }, [selectedPreset]);

  return (
    <div className="glass-card rounded-2xl border border-outline-variant/30 overflow-hidden" id="toolkit-module">
      {/* Module Title bar */}
      <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#bdc2ff] animate-pulse" />
            <h3 className="font-headline-lg text-[22px] text-on-surface font-semibold tracking-wide">
              Digital Cartography Sandbox
            </h3>
          </div>
          <p className="text-on-surface-variant text-xs">
            Interactive GIS workflow studio. Select preset environments or render user-defined spatial layers.
          </p>
        </div>
        
        {/* Preset Selectors */}
        <div className="flex flex-wrap gap-1.5 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/20">
          {MAP_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                setCustomLat(preset.lat.toString());
                setCustomLng(preset.lng.toString());
                setCustomName(`Query: ${preset.name}`);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium font-mono-data transition-all ${
                selectedPreset.id === preset.id
                  ? "bg-primary text-on-primary font-bold shadow-md"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {preset.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Interactive GIS Display Map Frame */}
        <div className="lg:col-span-8 p-6 bg-[#0e0e15] flex flex-col items-center justify-center relative min-h-[460px] overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-outline-variant/30">
          
          {/* Diagnostic Stats Overlay */}
          <div className="absolute top-4 left-4 z-10 p-3 rounded bg-surface/85 backdrop-blur border border-outline-variant/40 font-mono-data text-[11px] leading-relaxed max-w-[240px]">
            <div className="text-primary font-semibold flex items-center gap-1.5 mb-2 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              GIS Active System
            </div>
            <div className="text-on-surface flex justify-between gap-4">
              <span className="opacity-60">NAME:</span>
              <span className="font-semibold text-right">{selectedPreset.name}</span>
            </div>
            <div className="text-on-surface flex justify-between gap-4">
              <span className="opacity-60">COORDS:</span>
              <span className="text-right text-[#cabff9] font-medium">{selectedPreset.coordinatesLabel}</span>
            </div>
            <div className="text-on-surface flex justify-between gap-4">
              <span className="opacity-60">RADAR:</span>
              <span className="text-right text-emerald-400">● SENTINEL-2 ACTIVE</span>
            </div>
          </div>

          {/* Loader */}
          {!isRenderLoaded && (
            <div className="absolute inset-0 bg-[#0e0e15]/90 backdrop-blur z-20 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-10 h-10 text-primary animate-spin" />
              <div className="text-center">
                <p className="font-mono-data text-xs text-primary uppercase tracking-widest font-semibold">Recalculating Topology</p>
                <p className="text-[11px] text-on-surface-variant mt-1">Interpreting raster elevations & rendering vectors...</p>
              </div>
            </div>
          )}

          {/* Canvas-style Grid background mimicking a physical vector drafting board */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: "linear-gradient(to right, #454653 1px, transparent 1px), linear-gradient(to bottom, #454653 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />

          {/* Satellite Coordinate Reticle overlay */}
          <div className="absolute inset-0 border border-outline-variant/10 rounded pointer-events-none flex items-center justify-center">
            <div className="w-full absolute h-[0.5px] bg-primary/10" />
            <div className="h-full absolute w-[0.5px] bg-primary/10" />
            <div className="w-48 h-48 border border-primary/10 rounded-full absolute" />
            <div className="w-24 h-24 border border-dashed border-primary/20 rounded-full absolute" />
          </div>

          {/* Core Vector GIS Map SVG */}
          <svg 
            viewBox="0 0 480 320" 
            className="w-full max-w-[540px] aspect-[3/2] z-0 overflow-visible drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
          >
            {/* Base Coordinate grid helper */}
            <g className="opacity-20 text-[8px] font-mono font-normal fill-[#e4e1ec]">
              <text x="5" y="15">N_SW_INDEX_433</text>
              <text x="410" y="315">DATA_STREAM_OK</text>
              <line x1="10" y1="20" x2="40" y2="20" stroke="#C5A059" strokeWidth="0.5" />
              <line x1="10" y1="20" x2="10" y2="50" stroke="#C5A059" strokeWidth="0.5" />
            </g>

            {/* Satellite Grid sweeping laser effect */}
            {showSatelliteScan && (
              <g className="animate-pulse">
                <line x1="0" y1="160" x2="480" y2="160" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-30" />
                <line x1="240" y1="0" x2="240" y2="320" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-30" />
                <circle cx="240" cy="160" r="130" stroke="#C5A059" strokeWidth="0.5" className="opacity-15 animate-ping-slow" fill="none" />
              </g>
            )}

            {/* 1. Contour elevation shape layers */}
            {showContours && (
              <g>
                {contourPaths.map((item) => {
                  // Generate an elegant purple-to-blue gradient range
                  const opacity = 0.05 + (item.index * 0.045);
                  return (
                    <g key={item.index} className="group/level">
                      <path
                        d={item.path}
                        fill="rgba(197, 160, 89, 0.22)"
                        fillOpacity={opacity}
                        stroke="#C5A059"
                        strokeWidth="1"
                        strokeOpacity="0.45"
                        className="transition-all duration-500 hover:fill-primary/40 hover:stroke-primary cursor-pointer"
                      />
                      {/* Interactive metadata elevation label on hover */}
                      {item.index % 2 === 0 && (
                        <text
                          x={240 + Math.cos(item.index) * (80 - item.index * 6)}
                          y={160 + Math.sin(item.index) * (60 - item.index * 4)}
                          className="fill-on-surface-variant font-mono font-medium text-[7px] cursor-default opacity-0 group-hover/level:opacity-100 transition-opacity bg-black"
                        >
                          {item.elevation} m
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            )}

            {/* 2. Coastal Erosion shift vector layer */}
            {showErosion && (
              <g className="transition-all duration-500">
                {/* Safe Shoreline shading in green/blue */}
                <path 
                  d={`${erosionPaths.baseD} L 480 320 L 40 320 Z`} 
                  fill="#553b70" 
                  fillOpacity="0.15" 
                />
                
                {/* Original Shoreline boundary */}
                <path
                  d={erosionPaths.baseD}
                  fill="none"
                  stroke="#B59E75"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
                
                {/* Predicted Shoreline loss line */}
                <path
                  d={erosionPaths.futureD}
                  fill="none"
                  stroke="#ffb4ab"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Shading representing estimated eroded zones (high risk) */}
                <path
                  d={`${erosionPaths.baseD} L 480 120 L 480 135 L ${erosionPaths.futureD} Z`}
                  fill="rgba(255, 180, 171, 0.25)"
                />

                {/* Markers highlighting land-loss areas */}
                <g transform="translate(180, 160)">
                  <circle r="4" fill="#93000a" className="animate-ping" />
                  <circle r="2.5" fill="#ffb4ab" />
                  <text y="-8" x="-32" className="fill-[#ffb4ab] font-bold font-mono text-[7px] bg-black">HIGH EROSION RATE</text>
                </g>
                <g transform="translate(340, 205)">
                  <circle r="4" fill="#93000a" className="animate-ping" />
                  <circle r="2.5" fill="#ffb4ab" />
                  <text y="10" x="-24" className="fill-[#ffb4ab] font-bold font-mono text-[7px] bg-black">SHORELINE SHIFT</text>
                </g>
              </g>
            )}

            {/* 3. Urban Heat Island Mitigation thermal heat island map */}
            {showHeatMap && (
              <g className="transition-all duration-300">
                {heatPoints.map((point, index) => {
                  const gradientId = `heatGrad-${selectedPreset.id}-${index}`;
                  return (
                    <g key={index}>
                      <defs>
                        <radialGradient id={gradientId}>
                          <stop offset="0%" stopColor={point.cool ? "#B59E75" : "#E97474"} stopOpacity="0.85" />
                          <stop offset="50%" stopColor={point.cool ? "#C5A059" : "#93000a"} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={point.cool ? "#262117" : "#0D0D0D"} stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={point.radius}
                        fill={`url(#${gradientId})`}
                        className="mix-blend-screen opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                      />
                      {/* Overlay pins */}
                      <g transform={`translate(${point.x}, ${point.y - 12})`} className="opacity-0 hover:opacity-100 transition-opacity">
                        <rect x="-35" y="-14" width="70" height="12" rx="2" fill="rgba(19, 19, 26, 0.9)" stroke={point.cool ? "#bdc2ff" : "#ffb4ab"} strokeWidth="0.5" />
                        <text x="0" y="-6" textAnchor="middle" className="fill-on-surface font-mono text-[6px] font-bold">
                          {point.name}: {point.val}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            )}

            {/* 4. Global Logistics Corridor routes */}
            {showLogistics && (
              <g className="transition-all duration-300">
                {logisticRoutes.map((route) => {
                  return (
                    <g key={route.id} className="group/route">
                      {/* Glow route path */}
                      <path
                        d={route.d}
                        fill="none"
                        stroke={route.id === 1 ? "#E97474" : "#B59E75"}
                        strokeWidth="3"
                        strokeOpacity="0.15"
                      />
                      <path
                        d={route.d}
                        fill="none"
                        stroke={route.id === 1 ? "#E97474" : "#C5A059"}
                        strokeWidth="1"
                        strokeOpacity="0.8"
                        strokeDasharray={route.id === 1 ? "none" : "4 4"}
                      />

                      {/* Moving vector packet marker */}
                      <circle r="3.5" fill="#e4e1ec" stroke={route.id === 1 ? "#93000a" : "#131e8d"} strokeWidth="1">
                        <animateMotion path={route.d} dur={`${4 + route.id * 1.5}s`} repeatCount="indefinite" />
                      </circle>
                    </g>
                  );
                })}
                {/* Highlight active conflict or risk segment node */}
                <g transform="translate(240, 160)">
                  <path d="M 0,-6 L 6,4 L -6,4 Z" fill="#ffb4ab" className="animate-bounce" />
                  <circle r="8" stroke="#93000a" strokeWidth="1" fill="none" className="animate-ping" />
                  <text x="12" y="2" className="fill-on-surface font-mono text-[7.5px] font-bold bg-[#13131a] px-1 rounded-sm border border-outline-variant/50">CHOKEPOINT HIGH RISK</text>
                </g>
              </g>
            )}

            {/* Real scale coordinates pin indicator */}
            <g transform="translate(240, 160)" className="cursor-pointer group/pin">
              <circle r="4" fill="#e4e1ec" className="shadow" />
              <circle r="2" fill="#13131a" />
              {/* Tooltip always tracking */}
              <g className="opacity-90 transition-opacity">
                <rect x="-55" y="-28" width="110" height="15" rx="3" fill="#141414" stroke="#C5A059" strokeWidth="1" />
                <text x="0" y="-18" textAnchor="middle" className="fill-on-surface font-mono text-[7px]" fontWeight="bold">
                  Target: {selectedPreset.name.split(" ")[0]}
                </text>
              </g>
            </g>
          </svg>

          {/* Quick layer toggle legend pills */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between items-center bg-surface/85 backdrop-blur border border-outline-variant/40 p-3 rounded-lg z-10 gap-3">
            <span className="font-mono-data text-[10px] text-on-surface-variant flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              VISUAL LAYERS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setShowContours(!showContours)}
                className={`px-2 py-1 rounded text-[10px] font-mono-data font-medium flex items-center gap-1 transition-colors ${
                  showContours ? "bg-[#7c87f3]/20 text-[#bdc2ff] border border-[#7c87f3]" : "bg-surface-container-high text-outline hover:text-on-surface"
                }`}
              >
                Contours
              </button>
              <button
                onClick={() => setShowErosion(!showErosion)}
                className={`px-2 py-1 rounded text-[10px] font-mono-data font-medium flex items-center gap-1 transition-colors ${
                  showErosion ? "bg-red-400/20 text-red-300 border border-red-500" : "bg-surface-container-high text-outline hover:text-on-surface"
                }`}
              >
                <TrendingUp className="w-3 h-3 text-red-400" /> Shore Shift
              </button>
              <button
                onClick={() => setShowHeatMap(!showHeatMap)}
                className={`px-2 py-1 rounded text-[10px] font-mono-data font-medium flex items-center gap-1 transition-colors ${
                  showHeatMap ? "bg-amber-400/20 text-amber-300 border border-amber-500" : "bg-surface-container-high text-outline hover:text-on-surface"
                }`}
              >
                <Thermometer className="w-3 h-3 text-amber-400" /> Heat Index
              </button>
              <button
                onClick={() => setShowLogistics(!showLogistics)}
                className={`px-2 py-1 rounded text-[10px] font-mono-data font-medium flex items-center gap-1 transition-colors ${
                  showLogistics ? "bg-sky-400/20 text-sky-200 border border-sky-500" : "bg-surface-container-high text-outline hover:text-on-surface"
                }`}
              >
                <Ship className="w-3 h-3 text-sky-400" /> Logistics
              </button>
              <button
                onClick={() => setShowSatelliteScan(!showSatelliteScan)}
                className={`px-2 py-1 rounded text-[10px] font-mono-data font-medium flex items-center gap-1 transition-colors ${
                  showSatelliteScan ? "bg-emerald-400/20 text-emerald-300 border border-emerald-500" : "bg-surface-container-high text-outline hover:text-on-surface"
                }`}
              >
                radar scan
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Controls Workspace sidebar */}
        <div className="lg:col-span-4 p-6 bg-surface-container-low flex flex-col justify-between">
          <div>
            <h4 className="font-headline-lg text-sm text-on-surface uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-primary" />
              Cartography Parameters
            </h4>
            <p className="text-on-surface-variant text-xs mb-6">
              Recalculate mathematical curves, sea levels, and elevation resolutions across the workspace grid overlay.
            </p>

            {/* Elevation resolution inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs font-mono-data mb-2">
                  <span className="text-on-surface-variant">Contour Interlap Density</span>
                  <span className="text-primary font-bold">{contourInterval}m</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={contourInterval}
                  onChange={(e) => setContourInterval(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[9px] text-outline font-mono-data mt-1">
                  <span>Fine Resolution</span>
                  <span>Coarse Area Scan</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-data mb-2">
                  <span className="text-on-surface-variant">Datum Sea-Level Offset</span>
                  <span className="text-primary font-bold">{oceanDepth}m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={oceanDepth}
                  onChange={(e) => setOceanDepth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[9px] text-outline font-mono-data mt-1">
                  <span>Baseline</span>
                  <span>+100m Shift Range</span>
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant/20 pt-4 mb-6">
              <h5 className="font-mono-data text-xs text-on-surface-variant uppercase tracking-widest mb-3">
                Current Raster Metadata
              </h5>
              <div className="space-y-2 bg-surface-container-lowest p-3 rounded border border-outline-variant/10 font-mono-data text-[11px]">
                <div className="flex justify-between">
                  <span className="text-outline">Query Lat:</span>
                  <span className="text-on-surface font-semibold">{selectedPreset.lat.toFixed(5)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Query Lng:</span>
                  <span className="text-on-surface font-semibold">{selectedPreset.lng.toFixed(5)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Mean Elevation:</span>
                  <span className="text-on-surface font-semibold">{(selectedPreset.elevationRanges.reduce((a,b)=>a+b,0)/10).toFixed(1)}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">GIS Topology Grid:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                     <CheckCircle className="w-3 h-3" /> MATCHED SENSING
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Render Custom Coordinates form */}
          <div className="border-t border-outline-variant/30 pt-4">
            <h5 className="font-mono-data text-[11px] text-primary uppercase tracking-widest mb-3">
              Query Custom Coordinate Plane
            </h5>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-mono-data text-on-surface-variant mb-1">Location Label</label>
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e)=>setCustomName(e.target.value)}
                  placeholder="e.g. London Basin, Nile Delta"
                  className="w-full bg-surface-container-lowest border border-outline-variant-30 text-xs text-on-surface uppercase rounded px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono-data"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-mono-data text-on-surface-variant mb-1">latitude (-90 to 90)</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={customLat}
                    onChange={(e)=>setCustomLat(e.target.value)}
                    placeholder="e.g. 51.5074"
                    className="w-full bg-surface-container-lowest border border-outline-variant-30 text-xs text-on-surface rounded px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono-data"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono-data text-on-surface-variant mb-1">longitude (-180 to 180)</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={customLng}
                    onChange={(e)=>setCustomLng(e.target.value)}
                    placeholder="e.g. -0.1278"
                    className="w-full bg-surface-container-lowest border border-outline-variant-30 text-xs text-on-surface rounded px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono-data"
                  />
                </div>
              </div>

              <button 
                onClick={handleRenderCustom}
                className="w-full bg-primary hover:bg-[#7c87f3] text-on-primary font-mono-data uppercase text-xs font-bold py-3 px-4 rounded transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                <Globe className="w-4 h-4" />
                Render Topo Layer
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
