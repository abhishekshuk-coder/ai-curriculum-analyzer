export const studentScoreCards = [
  { key: "technicalSkills", label: "Technical Skills", value: 68, icon: "Target" },
  { key: "softSkills", label: "Soft Skills", value: 74, icon: "Lightbulb" },
  { key: "academicPerformance", label: "Academic Performance", value: 79, icon: "Layers" },
  { key: "industryReadiness", label: "Industry Readiness", value: 61, icon: "Briefcase" },
  { key: "experienceDepth", label: "Experience Depth", value: 52, icon: "FlaskConical" },
  { key: "certificationStrength", label: "Certification Strength", value: 47, icon: "Building2" },
  { key: "careerClarity", label: "Career Clarity", value: 70, icon: "Rocket" },
  { key: "marketAlignment", label: "Market Alignment", value: 64, icon: "Sparkles" },
];

export const studentHealthMeter = {
  score: 66,
  label: "Good",
  bands: [
    { name: "Excellent", min: 85, color: "#10B981" },
    { name: "Good", min: 70, color: "#3B5BB5" },
    { name: "Average", min: 50, color: "#D4AF37" },
    { name: "Needs Improvement", min: 0, color: "#DC6B5A" },
  ],
};

export const studentSkillGapRadar = [
  { skill: "Programming", current: 72, expected: 85 },
  { skill: "Data Analysis", current: 58, expected: 88 },
  { skill: "Cloud Platforms", current: 35, expected: 78 },
  { skill: "Communication", current: 76, expected: 80 },
  { skill: "Project Management", current: 50, expected: 72 },
  { skill: "AI / ML Tools", current: 30, expected: 82 },
];

export const careerTrajectory = [
  { milestone: "Now", withRoadmap: 61, withoutRoadmap: 61 },
  { milestone: "3 Months", withRoadmap: 68, withoutRoadmap: 62 },
  { milestone: "6 Months", withRoadmap: 76, withoutRoadmap: 64 },
  { milestone: "1 Year", withRoadmap: 85, withoutRoadmap: 67 },
  { milestone: "2 Years", withRoadmap: 93, withoutRoadmap: 70 },
];

export const studentIndustryHeatmap = [
  { industry: "Technology", alignment: 78 },
  { industry: "Banking & Finance", alignment: 64 },
  { industry: "Consulting", alignment: 69 },
  { industry: "E-Commerce", alignment: 73 },
  { industry: "Healthcare", alignment: 51 },
  { industry: "EdTech", alignment: 66 },
  { industry: "Manufacturing", alignment: 47 },
  { industry: "Government & PSU", alignment: 42 },
];

export const studentMissingSkills = {
  critical: ["Cloud Platform Experience (AWS/Azure)", "Applied Machine Learning Projects", "SQL & Data Querying"],
  high: ["Version Control (Git)", "Agile / Scrum Exposure", "API Integration Basics"],
  recommended: ["Prompt Engineering", "Data Visualization (Power BI/Tableau)", "Public Speaking & Storytelling"],
};

export const studentProfileDiagnostics = [
  {
    type: "Outdated Tech Stack",
    items: ["Resume highlights tools with declining job-posting demand (legacy frameworks, older language versions)"],
    tone: "warning",
  },
  {
    type: "Missing Portfolio Evidence",
    items: ["No links to GitHub, deployed projects, or a portfolio site found"],
    tone: "critical",
  },
  {
    type: "Thin Project Depth",
    items: ["Listed projects read as coursework rather than independently scoped, end-to-end builds"],
    tone: "warning",
  },
  {
    type: "Strong Foundations",
    items: ["Consistent academic performance and clearly listed core coursework"],
    tone: "neutral",
  },
];

export const demoStudentName = "Aarav Mehta";

export const demoStudentSummary =
  "A final-year student with a solid academic foundation and clear communication skills, but a resume that " +
  "currently undersells real-world readiness. Strong on fundamentals — analytics, programming basics, and " +
  "coursework — but light on the cloud, AI/ML, and project-portfolio evidence that recruiters now screen for first.";

export const demoDetectedSkills = [
  "Python", "Java", "SQL", "Data Structures & Algorithms", "Statistics",
  "Excel", "Communication", "Team Projects", "Spreadsheet Modelling", "Public Speaking",
];

export const demoStudentFindings = [
  {
    title: "No portfolio or project links anywhere on the resume",
    narrative:
      "Recruiters in technical and analytical roles increasingly skip straight to a candidate's GitHub or portfolio link before " +
      "reading further — and this resume has none. Even strong listed projects lose credibility without a place to verify them. " +
      "This is the single fastest fix available: publishing 1-2 polished, documented projects would change how every other line reads.",
    evidence: ["No GitHub, portfolio, or deployed-project URLs found anywhere in the document"],
    severity: "critical",
  },
  {
    title: "Cloud and AI/ML tooling are completely absent",
    narrative:
      "Across current entry-level postings in software, analytics, and consulting roles, cloud platform familiarity (AWS/Azure/GCP) " +
      "and applied AI/ML exposure now appear in the majority of job descriptions — and neither shows up here, in coursework or " +
      "self-study. This is the largest single gap between this profile and what the market is actively screening for.",
    evidence: ["No mentions of AWS, Azure, GCP, or any ML framework", "No certifications listed in either category"],
    severity: "critical",
  },
  {
    title: "Listed projects read as coursework, not independent builds",
    narrative:
      "The three projects listed are framed as class assignments ('Submitted for Database Systems coursework') rather than " +
      "end-to-end, independently scoped work. Reframing even the same projects around the problem solved, the stack used, and " +
      "the measurable outcome would significantly raise their perceived weight.",
    evidence: ["'Database Management System — submitted for coursework'", "No mention of scale, users, or measurable outcomes for any listed project"],
    severity: "high",
  },
  {
    title: "Strong, consistent academic record and communication signals",
    narrative:
      "Academic performance is consistently solid across semesters, and the resume's writing itself demonstrates clear, " +
      "structured communication — a real differentiator in roles that mix technical and client-facing work. This is a genuine " +
      "asset worth foregrounding rather than burying beneath a generic 'Education' header.",
    evidence: ["Consistent CGPA trend across listed semesters", "Clearly structured, error-free resume writing throughout"],
    severity: "positive",
  },
];

export const studentSimulatorBaseline = {
  employability: 61,
  relevance: 64,
  future: 58,
};

export const studentSimulatorAdditions = [
  { id: "portfolio", label: "Two Published Portfolio Projects", impact: { employability: 8, relevance: 6, future: 5 } },
  { id: "cloud-cert", label: "AWS Cloud Practitioner Certification", impact: { employability: 6, relevance: 7, future: 8 } },
  { id: "ml-project", label: "Applied Machine Learning Mini-Project", impact: { employability: 5, relevance: 6, future: 9 } },
  { id: "internship", label: "3-Month Industry Internship", impact: { employability: 9, relevance: 5, future: 4 } },
  { id: "communication", label: "Public Speaking / Storytelling Workshop", impact: { employability: 3, relevance: 4, future: 3 } },
];

export const demoCareerRoadmap = [
  {
    priority: 1,
    action: "Build and publish two end-to-end projects with a public GitHub/portfolio link",
    rationale: "Closes the single biggest credibility gap — recruiters can verify claimed skills instead of taking them on faith.",
    expectedImpact: "Industry Readiness: +8-12 pts · Experience Depth: +6-9 pts",
  },
  {
    priority: 2,
    action: "Complete a recognised cloud foundations certification (AWS Cloud Practitioner or Azure Fundamentals)",
    rationale: "Directly closes the largest detected skill gap and is one of the highest-frequency keywords in entry-level screening.",
    expectedImpact: "Certification Strength: +9-13 pts · Market Alignment: +6-8 pts",
  },
  {
    priority: 3,
    action: "Take a hands-on applied machine learning short course and ship one ML-powered mini project",
    rationale: "Converts a 'completely absent' category into a demonstrable, talk-about-able strength in interviews.",
    expectedImpact: "Technical Skills: +6-9 pts · Career Clarity: +4-6 pts",
  },
  {
    priority: 4,
    action: "Rewrite each project bullet around problem → approach → measurable outcome",
    rationale: "Same underlying work, presented in the format hiring managers actually scan for — a near-zero-cost high-leverage edit.",
    expectedImpact: "Industry Readiness: +3-5 pts · Career Clarity: +3-4 pts",
  },
];
