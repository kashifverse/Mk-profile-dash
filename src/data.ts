import { Project, MapPreset } from "./types";

export const PROJECTS_DATA: Project[] = [
  {
    id: "digital-media-mgmt",
    title: "Digital Media Management",
    description: "Exploration of spatial storytelling through digital media, making complex geographic concepts engaging and accessible for diverse stakeholders.",
    category: "Digital Media",
    tags: ["Digital Media", "GIS"],
    tools: ["QGIS", "Mapbox", "Adobe CC", "D3.js"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_CIJiU5F-1brZtCzSQIDLmWA1AYaFmo0V2L5EOn2BLSyU7nvC4FoN7W1Vh3Y4gUPkyNrB952Tm3i3ZiDOiiZF0fuo69NuCeMPDDmFUUI3AG9G2eWlMj6h-DXhVoah6PQ7kMeORW5-81vWzKp9360kUL_MT4kDjjvy_10IMvIoTd08DaBtIdTj96y9a0g05A9TWtYJXHZ_aznt6UrybXgzl1zdrIOZUnuLtMvn93ragDCx41wGVWyvqvRwhkCl1rKEIczJ2TBDchw",
    date: "2024",
    featured: true,
    coordinates: "34.0522° N, 118.2437° W (Los Angeles Basin)",
    caseStudy: {
      background: "Modern geographic analysis produces massive datasets that are often opaque to city planners, investors, and public citizens. This project focused on turning Los Angeles demographic heatmaps into engaging, interactive narratives.",
      challenge: "Parsing 2.4 million spatial records and displaying them without lagging the WebGL frame while keeping the storytelling interface clean and accessible for non-technical users.",
      methodology: "Leveraging Mapbox Vector Tiles combined with customized WebGL shaders. Vector features were rendered on absolute coordinates with responsive zoom-scaling, allowing stories to unfold through smooth spatial guided transitions.",
      results: "Successfully condensed 12 distinct multi-layered spatial domains into 3 accessible micro-stories. Reduced render compute latency by 64% and increased user engagement metrics during public city development meetings."
    }
  },
  {
    id: "coastal-erosion",
    title: "Coastal Erosion Modeling",
    description: "Advanced predictive modeling of shoreline shifts using multi-temporal remote sensing data.",
    category: "Analysis",
    tags: ["Analysis", "Remote Sensing"],
    tools: ["ArcGIS Pro", "Python", "Sentinel-2", "ENVI"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ5RcB3kZhJfLGM2bYQGsfaBrYs5hrA1F-vunNEPGH8cErqhFev62Hw-6PaQ5eiupxIbyzCW-335rvMdbJQEJqdD1-oIWQmSCOBES5ck3xxAAf_vy5Yop_aA6GqwIQVi-OFWizT1mVcZRXTadNTSMknpbC8N9hHvdyDf0tR4YP4Ay7kr_UBHdfB52wkS3cZgrPVmWnEwfDzLvdinfPA8YJ2vCBTKy4kHviNWVbxVqAFVinU-S7ExSfqum--4zFu9UiP4osvGAfwZs",
    date: "2023",
    coordinates: "54.1205° N, 3.4211° W (Irish Coastal Fringe)",
    caseStudy: {
      background: "Climate-change accelerated sea rise is shifting fragile shorelines faster than seasonal surveyors can chart. Accurate shoreline modeling is critical to protect sensitive infrastructure.",
      challenge: "Distinguishing intertidal changes from actual permanent erosion trends while handling spectral reflection differences in high-cloud regions.",
      methodology: "Analyzed a 10-year historic pipeline of Sentinel-2 satellite images. Developed an automated Python processing harness in ArcGIS Pro that applied custom Normalized Difference Water Index (NDWI) thresholding dynamically relative to local high-tide charts.",
      results: "Identified 4 previously undocumented high-risk accretion-reversal hotspots along the coastal margins, with prediction modeling aligning within 92% of subsequent physical drone survey ground-truth datasets."
    }
  },
  {
    id: "urban-heat-island",
    title: "Urban Heat Island Mitigation",
    description: "Developing spatial strategies for urban cooling through green infrastructure optimization.",
    category: "Planning",
    tags: ["Planning", "Python"],
    tools: ["Python", "QGIS", "Landsat 8 Thermal", "InVEST"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApE67AALXzx3vnoLOaAJpHC3cJ5ZCk8bHk1qfkURtehoUedCQ0Tja8CP6rM7FgjoDVH-ny4LeM01x8XDKafQwkA5AsGKavW5NsOShsT976AoRF7v0g6l4j78WoP2HNWCdjiEmSxqGLmWJp9msHHqeknkUE3u8pNXPhHgoaa1KnqMIssgt0_CMKNvV4FSzqctRkD9k6YdpLF4xE7dSXkwrpAV8kdNQtDSv8eEn0amgdCdsBVM42Y3Pe3AnPtaX2vf5ZCMEMcNtueYk",
    date: "2023",
    coordinates: "41.8781° N, 87.6298° W (Chicago Metro Grid)",
    caseStudy: {
      background: "Highly built asphalt areas retain severe solar warmth, making concrete suburbs up to 6°C hotter than surrounding rural basins, creating severe summer cooling strains and health risks.",
      challenge: "Identifying the precise minimum surface area of multi-type green infrastructure (e.g. bio-swales, green roofs, canopy trees) required to cool concrete heat zones.",
      methodology: "Extracted LST (Land Surface Temperature) from Landsat 8 band 10 data. Integrated variables into the InVEST cooling tool using high-resolution LiDAR physical contours to simulate the spatial micro-climate cooling effects.",
      results: "Drafted a targeted urban vegetation blueprint proposing 14 strategically distributed micro-parks, demonstrating a projected localized reduction of peak summer temperatures by up to 2.4°C."
    }
  },
  {
    id: "global-logistics",
    title: "Global Logistics Optimizer",
    description: "Mapping real-time supply chain vulnerabilities across international trade corridors.",
    category: "Logistics",
    tags: ["Logistics", "Big Data"],
    tools: ["PostGIS", "React", "D3.js", "Geopandas"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfCIVTIlqw31L8SbJItBWDk9x8tsvJ9yE9TS_828SwvcUNfmhf_h1humYcyrZrFVeyzTf-kCk1XtadwaX0EPxhYuL-oVoZkvjdDIT0OP0ta3Nreb3Ex7PJa3Q2XnPsuOMlJ20zmaJXx6AWSDvqCLvflPscx_0q8u9lW8CJcqvDXScU82W6oGFn9z8ZpeKkr1TbguWrrW60K0q1K5-Fu76DJsYir5kGJ5AV7HeI0LwGKbm2R2RiMcSMTEddugoidnWVX2KMG3YX4Ns",
    date: "2024",
    coordinates: "1.3521° N, 103.8198° E (Strait of Malacca)",
    caseStudy: {
      background: "Geopolitical blockages and seasonal oceanic weather shifts demand rapid, proactive route-diversion calculations to ensure heavy maritime shipments dodge narrow global chokepoints safely.",
      challenge: "Processing global live shipping transponder telemetry packet arrays (AIS broadcast frames) consisting of hundreds of thousands of concurrent data streams.",
      methodology: "Engineered high-performance regional query buckets in a dedicated PostGIS database. Plotted global maritime routes using Dijkstra pathing adjusted dynamically via real-time satellite storms overlay grids.",
      results: "Built a fully multi-threaded simulation deck displaying maritime latency risks. Reduced average recalculation response times from 18 seconds to 1.1s under simulated transit blockage scenarios."
    }
  },
  {
    id: "spatial-dashboard-v2",
    title: "Spatial Dashboard v2.0",
    description: "Redesigning the interface for high-performance spatial analytics platforms.",
    category: "Product Design",
    tags: ["Product Design", "UI/UX"],
    tools: ["React", "Framer Motion", "Tailwind CSS", "Recharts"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP7_ChBDVpv24-t7pbEGQAkQDwQ4jxmi3aqA19r-ECRyW72yF4F6n97KveaTU2FIdGJo_L4B0H-qpVvEDH85fQrm9i_PZ9Bo7TAJqLfoi0iitJCyYz7xrEmgspj0yTWyIYIgiLym5eAhzu1pr8omhaIviVlDNjUzMha3lBLxzJVLPz-5pfP-5qnwTYUwcPyyIj-3dIhEG2KRlsWtQo6aVEuSae-sbfUO_pRa2ysuDC5SqUaMnaV_an_Fiogl8l-BCiFKlFr6UC2bE",
    date: "2024",
    coordinates: "40.7128° N, 74.0060° W (Manhattan Hub)",
    caseStudy: {
      background: "Enterprise GIS applications often suffer from cluttered, legacy interfaces built with heavy frameworks that slow down field engineers trying to make critical split-second route decisions.",
      challenge: "Consolidating 14 separate spatial analytical panels into a seamless, high-contrast, responsive dashboard optimized for tablet hardware in active trucks.",
      methodology: "Designed a clean, glassmorphic layout structured via a rigid, dark-navy coordinate bento grid. Incorporated tactile interaction feedback models, dynamic color ranges, and modular responsive widget units.",
      results: "Successfully boosted UI task-completion velocity among remote operations field teams by 42%. Users rated visual clarity at a comprehensive 9.4/10."
    }
  },
  {
    id: "historical-map-digitization",
    title: "Historical Map Digitization",
    description: "Restoring and georeferencing archival cartography for modern research.",
    category: "Archive",
    tags: ["Archive", "Cartography"],
    tools: ["ArcMap", "QGIS Georeferencer", "Photoshop"],
    image: "explore", // Symbolized by explore icon as Mockup #1
    date: "Archive",
    coordinates: "25.1972° N, 55.2744° E (Dubai Historical Creek)",
    caseStudy: {
      background: "Archival paper cartography contains invaluable centuries-old ecological information that must be translated into modern coordinated metrics to chart physical shoreline changes.",
      challenge: "Correcting severe warp deviations and physical dimension shrinkage on physical map canvases created in the late 19th century.",
      methodology: "Utilized thin-plate splines (TPS) tied to 38 precise ground control reference vectors (e.g., historical stone watchtowers, permanent bedrock structures). Applied spatial edge smoothing to match historic survey coordinates.",
      results: "Digitized 12 historic creek maps with sub-meter spatial variance alignment, creating a beautiful spatial timeline visualizing Dubai's rapid maritime shoreline shift over 110 years."
    }
  }
];

export const MAP_PRESETS: MapPreset[] = [
  {
    id: "dubai",
    name: "Dubai Downtown Hub",
    lat: 25.1972,
    lng: 55.2744,
    coordinatesLabel: "25.1972° N, 55.2744° E",
    description: "Centering high-tech urban structures, canal alignments, and dense coastal heat islands.",
    elevationRanges: [80, 110, 150, 190, 240, 310, 380, 290, 180, 90],
    baseShapeSeed: 1.2
  },
  {
    id: "la-basin",
    name: "Los Angeles Basin",
    lat: 34.0522,
    lng: -118.2437,
    coordinatesLabel: "34.0522° N, 118.2437° W",
    description: "Broad sediment basins bounded by severe tectonic ridges, visualizing coastal maritime currents.",
    elevationRanges: [120, 180, 290, 420, 580, 610, 410, 220, 140, 80],
    baseShapeSeed: 2.5
  },
  {
    id: "chicago-grid",
    name: "Chicago Grid & Shoreline",
    lat: 41.8781,
    lng: -87.6298,
    coordinatesLabel: "41.8781° N, 87.6298° W",
    description: "Flat urban plains meeting high-contrast lake water boundaries, demonstrating heat mitigation.",
    elevationRanges: [50, 60, 75, 90, 110, 120, 95, 70, 55, 45],
    baseShapeSeed: 0.8
  },
  {
    id: "malacca-strait",
    name: "Strait of Malacca",
    lat: 1.3521,
    lng: 103.8198,
    coordinatesLabel: "1.3521° N, 103.8198° E",
    description: "High-density global logistics routing corridors linking deep ocean waterways.",
    elevationRanges: [10, 25, 40, 65, 80, 95, 110, 70, 35, 15],
    baseShapeSeed: 3.1
  },
  {
    id: "irish-coastal",
    name: "Irish Coastal Fringe",
    lat: 54.1205,
    lng: -3.4211,
    coordinatesLabel: "54.1205° N, 3.4211° W",
    description: "Severe, jagged cliff shorelines subject to extreme multi-temporal tidal erosion.",
    elevationRanges: [150, 220, 310, 480, 610, 780, 590, 340, 190, 95],
    baseShapeSeed: 4.6
  }
];
