export const liveStats = [
  { label: "Jobs Analyzed", value: 12480, suffix: "+" },
  { label: "Skills Extracted", value: 3260, suffix: "+" },
  { label: "Industries Covered", value: 18, suffix: "" },
  { label: "Universities Evaluated", value: 240, suffix: "+" },
];

export const skillCloud = [
  { name: "Generative AI", weight: 96 },
  { name: "Data Analytics", weight: 90 },
  { name: "Cloud Computing", weight: 85 },
  { name: "Python", weight: 88 },
  { name: "Product Strategy", weight: 70 },
  { name: "UX Research", weight: 64 },
  { name: "Machine Learning", weight: 92 },
  { name: "Digital Marketing", weight: 68 },
  { name: "Financial Modelling", weight: 60 },
  { name: "Cybersecurity", weight: 78 },
  { name: "ESG & Sustainability", weight: 58 },
  { name: "Supply Chain Tech", weight: 54 },
  { name: "Prompt Engineering", weight: 82 },
  { name: "No-Code Tools", weight: 50 },
  { name: "Stakeholder Comms", weight: 66 },
  { name: "Cloud Security", weight: 72 },
];

export const scoreCards = [
  { key: "relevance", label: "Curriculum Relevance", value: 78, icon: "Target" },
  { key: "employability", label: "Employability", value: 71, icon: "Briefcase" },
  { key: "future", label: "Future Readiness", value: 64, icon: "Rocket" },
  { key: "alignment", label: "Industry Alignment", value: 73, icon: "Building2" },
  { key: "innovation", label: "Innovation", value: 58, icon: "Lightbulb" },
  { key: "practical", label: "Practical Exposure", value: 61, icon: "FlaskConical" },
  { key: "coverage", label: "Skill Coverage", value: 69, icon: "Layers" },
  { key: "emerging", label: "Emerging Skills Adoption", value: 52, icon: "Sparkles" },
];

export const healthMeter = {
  score: 72,
  label: "Good",
  bands: [
    { name: "Excellent", min: 85, color: "#10B981" },
    { name: "Good", min: 70, color: "#3B5BB5" },
    { name: "Average", min: 50, color: "#D4AF37" },
    { name: "Needs Improvement", min: 0, color: "#DC6B5A" },
  ],
};

export const skillGapRadar = [
  { skill: "AI / ML", curriculum: 62, industry: 91 },
  { skill: "Data Analysis", curriculum: 70, industry: 88 },
  { skill: "Cloud Platforms", curriculum: 48, industry: 82 },
  { skill: "Communication", curriculum: 75, industry: 78 },
  { skill: "Product Thinking", curriculum: 58, industry: 80 },
  { skill: "Automation Tools", curriculum: 40, industry: 76 },
];

export const futureSkillsForecast = [
  { year: "2025", aiLiteracy: 62, dataFluency: 58, sustainability: 40, automation: 50 },
  { year: "2026", aiLiteracy: 70, dataFluency: 64, sustainability: 46, automation: 57 },
  { year: "2027", aiLiteracy: 78, dataFluency: 70, sustainability: 53, automation: 64 },
  { year: "2028", aiLiteracy: 85, dataFluency: 76, sustainability: 60, automation: 71 },
  { year: "2029", aiLiteracy: 91, dataFluency: 82, sustainability: 67, automation: 78 },
  { year: "2030", aiLiteracy: 96, dataFluency: 88, sustainability: 74, automation: 85 },
];

export const industryHeatmap = [
  { industry: "Technology", alignment: 82 },
  { industry: "Healthcare", alignment: 58 },
  { industry: "Banking", alignment: 67 },
  { industry: "Finance", alignment: 71 },
  { industry: "Manufacturing", alignment: 49 },
  { industry: "Education", alignment: 76 },
  { industry: "Consulting", alignment: 69 },
  { industry: "Government", alignment: 44 },
];

export const missingSkills = {
  critical: ["Generative AI Tools", "Cloud Cost Optimisation", "Data Storytelling"],
  high: ["Low-Code Automation", "ESG Reporting", "API Integration Basics"],
  recommended: ["Prompt Engineering", "Agile Delivery", "Behavioural Analytics"],
};

export const curriculumDoctor = [
  {
    type: "Outdated Topics",
    items: ["Legacy ERP Systems (2012 syllabus)", "Waterfall-only Project Management"],
    tone: "warning",
  },
  {
    type: "Redundant Subjects",
    items: ["Two overlapping 'Intro to Spreadsheets' modules"],
    tone: "neutral",
  },
  {
    type: "Missing Technologies",
    items: ["Generative AI / LLM tooling", "Cloud data warehouses (Snowflake, BigQuery)"],
    tone: "critical",
  },
  {
    type: "Missing Certifications",
    items: ["Google Data Analytics", "AWS Cloud Practitioner"],
    tone: "warning",
  },
  {
    type: "Missing Industry Projects",
    items: ["Live client capstone", "Cross-functional hackathon"],
    tone: "critical",
  },
];

export const dashboardCards = [
  {
    title: "Curriculum Health Meter",
    description: "At-a-glance score that bands your program from Needs Improvement to Excellent.",
    icon: "Gauge",
  },
  {
    title: "Skill Gap Radar",
    description: "Overlay your curriculum's skill coverage against live industry demand.",
    icon: "Radar",
  },
  {
    title: "Future Skills Forecast",
    description: "Projected demand for emerging skills through 2030, mapped to your offerings.",
    icon: "TrendingUp",
  },
  {
    title: "Industry Alignment Heatmap",
    description: "See how well your program aligns across 8 major industry verticals.",
    icon: "Grid3x3",
  },
  {
    title: "Missing Skills Analysis",
    description: "Critical, high-priority, and recommended additions ranked by hiring impact.",
    icon: "ListChecks",
  },
  {
    title: "AI Curriculum Doctor™",
    description: "Automatic diagnosis of outdated topics, redundancies, and missing tech.",
    icon: "Stethoscope",
  },
  {
    title: "Employability Simulator™",
    description: "Add a course or certification and instantly see the score impact.",
    icon: "SlidersHorizontal",
  },
  {
    title: "Executive Reporting",
    description: "Export board-ready PDF, Excel, and PPT reports for NAAC, NBA, AACSB & more.",
    icon: "FileBarChart",
  },
];

export const programs = [
  "MBA", "BBA", "Engineering", "Computer Science", "Data Science", "AI & ML",
  "Commerce", "Humanities", "Law", "Healthcare", "Pharmacy", "Agriculture",
  "Design", "Hotel Management", "Custom Program",
];

export const simulatorBaseline = {
  employability: 71,
  relevance: 78,
  future: 64,
};

export const simulatorAdditions = [
  { id: "genai", label: "Generative AI Practicum", impact: { employability: 6, relevance: 5, future: 9 } },
  { id: "cloud-cert", label: "AWS Cloud Practitioner Cert", impact: { employability: 5, relevance: 4, future: 6 } },
  { id: "capstone", label: "Live Industry Capstone Project", impact: { employability: 7, relevance: 6, future: 4 } },
  { id: "data-story", label: "Data Storytelling Lab", impact: { employability: 4, relevance: 5, future: 5 } },
  { id: "esg", label: "ESG & Sustainability Module", impact: { employability: 3, relevance: 4, future: 7 } },
];

export const demoProgramName = "MBA — Strategy & Analytics";

export const demoSummary =
  "This program shows solid foundations in strategy and quantitative analysis but is lagging on emerging-technology coverage. " +
  "Graduates are well prepared for traditional consulting and analyst roles, though the curriculum would benefit from deeper " +
  "exposure to generative AI, cloud platforms, and live industry projects to keep pace with where hiring demand is heading.";

export const demoDetectedSubjects = [
  "Strategic Management", "Business Analytics", "Financial Modelling", "Marketing Management",
  "Operations Research", "Organizational Behaviour", "Spreadsheet Modelling I", "Spreadsheet Modelling II",
  "Legacy ERP Systems", "Project Management (Waterfall)",
];

export const demoFindings = [
  {
    title: "Legacy ERP modules are crowding out modern tooling",
    narrative:
      "Detected 2 dedicated modules built around a 2012-era ERP platform. Industry job postings referencing this exact platform " +
      "have dropped sharply since 2022, while postings asking for cloud ERP and data-warehouse experience have risen. Replacing " +
      "or modernizing these modules would free up credit hours for higher-demand tooling.",
    evidence: ["Legacy ERP Systems (2012 syllabus)", "Two terms allocated to the same platform version"],
    severity: "critical",
  },
  {
    title: "Two overlapping spreadsheet-modelling courses",
    narrative:
      "'Spreadsheet Modelling I' and 'Spreadsheet Modelling II' cover substantially the same introductory ground. Consolidating " +
      "them into a single course would recover a full term that could host a generative-AI or data-storytelling elective instead.",
    evidence: ["Spreadsheet Modelling I", "Spreadsheet Modelling II — overlapping learning outcomes"],
    severity: "medium",
  },
  {
    title: "No generative-AI or LLM-tooling exposure",
    narrative:
      "The syllabus contains no module, elective, or lab referencing generative AI, prompt engineering, or LLM-based tools — " +
      "currently among the fastest-growing skill requests across consulting, strategy, and analyst job postings.",
    evidence: ["No matches for 'generative AI', 'LLM', or 'prompt' across any listed module"],
    severity: "critical",
  },
  {
    title: "Strong, durable core in strategy and analytics",
    narrative:
      "Strategic Management and Business Analytics are both substantively built out with case-based assessment and applied " +
      "projects — this core travels well across consulting, product, and operations-analyst roles and should be preserved as the spine of the program.",
    evidence: ["Strategic Management — case-based capstone assessment", "Business Analytics — applied project component"],
    severity: "positive",
  },
];

export const demoActionPlan = [
  {
    priority: 1,
    action: "Replace the legacy-ERP modules with a cloud-ERP / data-platform elective",
    rationale: "Frees two terms currently spent on a platform with collapsing industry demand and redirects them to where hiring is growing.",
    expectedImpact: "Future Readiness: +7-10 pts · Industry Alignment: +5-8 pts",
  },
  {
    priority: 2,
    action: "Introduce a Generative AI & Prompt Engineering practicum",
    rationale: "Closes the single largest gap identified — no current exposure to the fastest-growing skill category in this field.",
    expectedImpact: "Emerging Skills Adoption: +9-12 pts · Employability: +5-8 pts",
  },
  {
    priority: 3,
    action: "Merge the two spreadsheet-modelling courses into one and reclaim the term",
    rationale: "Removes redundant content and creates room for a new elective without expanding total program length.",
    expectedImpact: "Skill Coverage: +3-5 pts",
  },
  {
    priority: 4,
    action: "Add a live-client capstone or cross-functional hackathon",
    rationale: "Practical, real-stakes project work is the single strongest predictor of employability outcomes in exit surveys for this program type.",
    expectedImpact: "Practical Exposure: +6-9 pts · Employability: +4-7 pts",
  },
];
