export const facultyHealthMeter = { score: 68, label: "Good" as const };

export const demoFacultyName = "Dr. Priya Sharma";
export const demoDepartment = "Computer Science & Engineering";
export const demoFacultySummary =
  "Dr. Sharma demonstrates strong foundational teaching in data structures and algorithms with well-structured assessments. However, the teaching portfolio reveals limited integration of modern tools (cloud platforms, AI/ML frameworks), minimal use of project-based learning, and an over-reliance on traditional lecture-based delivery. Incorporating industry-relevant technologies and experiential learning methods would significantly elevate student outcomes.";

export const demoDetectedTopics = [
  "Data Structures", "Algorithms", "Database Management Systems",
  "Operating Systems", "Computer Networks", "Object-Oriented Programming",
  "Software Engineering", "Discrete Mathematics",
];

export const facultyScoreCards = [
  { key: "pedagogyQuality", label: "Pedagogy Quality", value: 72, icon: "GraduationCap" },
  { key: "curriculumCoverage", label: "Curriculum Coverage", value: 75, icon: "Layers" },
  { key: "studentEngagement", label: "Student Engagement", value: 58, icon: "Users" },
  { key: "assessmentDesign", label: "Assessment Design", value: 70, icon: "ClipboardCheck" },
  { key: "technologyIntegration", label: "Technology Integration", value: 45, icon: "Laptop" },
  { key: "industryRelevance", label: "Industry Relevance", value: 55, icon: "Building2" },
  { key: "learningOutcomes", label: "Learning Outcomes", value: 68, icon: "Target" },
  { key: "innovativeTeaching", label: "Innovative Teaching", value: 42, icon: "Lightbulb" },
];

export const facultySkillGapRadar = [
  { skill: "Modern Frameworks", current: 35, benchmark: 80 },
  { skill: "Project-Based Learning", current: 40, benchmark: 85 },
  { skill: "Cloud & DevOps", current: 25, benchmark: 75 },
  { skill: "AI/ML Integration", current: 20, benchmark: 70 },
  { skill: "Assessment Innovation", current: 55, benchmark: 80 },
  { skill: "Industry Collaboration", current: 30, benchmark: 75 },
  { skill: "Research Integration", current: 50, benchmark: 70 },
];

export const facultyIndustryHeatmap = [
  { industry: "Software Development", alignment: 65 },
  { industry: "Data Science & AI", alignment: 35 },
  { industry: "Cloud Computing", alignment: 28 },
  { industry: "Cybersecurity", alignment: 42 },
  { industry: "FinTech", alignment: 38 },
  { industry: "EdTech", alignment: 55 },
  { industry: "IT Consulting", alignment: 50 },
];

export const facultyMissingSkills = {
  critical: ["Cloud Platforms (AWS/Azure/GCP)", "AI/ML Frameworks", "Containerization (Docker/K8s)"],
  high: ["CI/CD Pipelines", "Agile/Scrum Teaching", "Live Industry Projects"],
  recommended: ["Open-Source Contribution", "Hackathon Mentoring", "Research Mentorship Programs"],
};

export const facultyTeachingDiagnostics = [
  { type: "Outdated Content", items: ["C language-only labs (no Python/JS)", "Manual testing only — no automated testing tools"], tone: "critical" as const },
  { type: "Missing Pedagogy", items: ["No flipped classroom or blended learning", "No peer-assessment or self-assessment rubrics"], tone: "warning" as const },
  { type: "Assessment Gaps", items: ["Exams test recall, not application", "No capstone or portfolio-based evaluation"], tone: "warning" as const },
  { type: "Strengths", items: ["Clear, well-structured syllabus", "Strong DSA coverage", "Regular assignments with feedback"], tone: "neutral" as const },
];

export const demoFacultyFindings = [
  {
    title: "Strong Algorithmic Foundation, Weak Modern Application",
    narrative: "The teaching portfolio demonstrates deep coverage of classical algorithms and data structures, with well-designed problem sets and progressive difficulty. However, these concepts are taught exclusively through C/C++ implementations with no exposure to modern languages (Python, JavaScript) or frameworks that students will encounter in industry. This creates a gap between theoretical understanding and practical employability.",
    evidence: ["DSA course outline covers 15+ classical algorithms", "All lab exercises use C language exclusively", "No mention of Python, JavaScript, or modern frameworks"],
    severity: "high" as const,
  },
  {
    title: "Limited Technology Integration in Classroom",
    narrative: "The portfolio shows reliance on traditional lecture-based delivery with chalk-and-board methods. While effective for foundational concepts, this approach misses opportunities to leverage tools like Jupyter notebooks, GitHub Classroom, or online coding platforms that can enhance engagement and provide real-time feedback. Top-performing faculty in CS departments nationwide have adopted blended learning models.",
    evidence: ["No mention of digital tools or platforms", "Assessment is exam-only with no online components", "No recorded lectures or digital resources referenced"],
    severity: "medium" as const,
  },
  {
    title: "Assessment Design Favors Memorization Over Application",
    narrative: "Examination papers in the portfolio heavily weight recall-based questions (definitions, short answers) over application-based problems. Modern pedagogical best practices — and accreditation bodies like NBA — emphasize outcome-based assessment that measures what students can do, not just what they remember.",
    evidence: ["70% of exam marks allocated to 'define' and 'explain' questions", "No project-based or portfolio assessment", "No rubrics for higher-order thinking skills"],
    severity: "high" as const,
  },
  {
    title: "Well-Organized Syllabus Structure",
    narrative: "The syllabus demonstrates excellent organizational structure with clear learning objectives per module, progressive prerequisite chains, and a logical topic flow. This foundational strength provides a solid base upon which modern pedagogical improvements can be built.",
    evidence: ["Each module has explicit learning objectives", "Prerequisites clearly mapped across courses", "Topics follow a logical progression from basic to advanced"],
    severity: "positive" as const,
  },
];

export const demoImprovementRoadmap = [
  { priority: 1, action: "Introduce Python alongside C in lab exercises for DSA and DBMS courses", rationale: "Industry uses Python extensively; dual-language exposure bridges the employability gap identified in findings.", expectedImpact: "Industry Relevance: +12-15 pts" },
  { priority: 2, action: "Adopt GitHub Classroom for assignment submission and peer code review", rationale: "Builds version control skills and enables collaborative learning — both critical for modern software teams.", expectedImpact: "Technology Integration: +10-12 pts" },
  { priority: 3, action: "Replace 30% of recall-based exam questions with application-based mini-projects", rationale: "NBA accreditation requires outcome-based assessment; this shift improves both pedagogy and compliance.", expectedImpact: "Assessment Design: +8-10 pts" },
  { priority: 4, action: "Add a capstone project module with industry mentor involvement", rationale: "Bridges theory-practice gap; top CS departments include mandatory industry-mentored projects.", expectedImpact: "Student Engagement: +10-14 pts" },
  { priority: 5, action: "Integrate cloud computing labs (AWS Academy or Google Cloud Skills Boost)", rationale: "Cloud skills are in top-3 hiring requirements; free academic programs make this zero-cost to adopt.", expectedImpact: "Technology Integration: +15-18 pts" },
];

export const facultySimulatorAdditions = [
  { id: "python-labs", label: "Add Python-based Lab Exercises", impact: { employability: 12, relevance: 10, future: 8 } },
  { id: "github-classroom", label: "Adopt GitHub Classroom", impact: { employability: 8, relevance: 9, future: 7 } },
  { id: "cloud-labs", label: "Integrate AWS/GCP Cloud Labs", impact: { employability: 14, relevance: 12, future: 13 } },
  { id: "capstone-project", label: "Add Industry-Mentored Capstone", impact: { employability: 11, relevance: 10, future: 9 } },
  { id: "outcome-assessment", label: "Shift to Outcome-Based Assessment", impact: { employability: 6, relevance: 8, future: 5 } },
];

export const facultySimulatorBaseline = {
  employability: 55,
  relevance: 55,
  future: 42,
};

export const demoResearch = {
  researchSummary: "Dr. Sharma has a moderate research profile with publications in algorithms and data structures. Most publications are in national-level conferences with limited international journal presence. Research output shows depth in combinatorial optimization but lacks breadth in emerging areas like AI/ML or cloud computing.",
  publicationCount: 18,
  estimatedHIndex: 6,
  citationPotential: "Moderate" as const,
  researchStrengths: ["Combinatorial Optimization", "Graph Algorithms", "Algorithmic Complexity Analysis"],
  researchGaps: ["No AI/ML publications", "Limited international journal presence", "No industry-collaborative research", "No funded research projects in last 3 years"],
  peerBenchmark: {
    benchmarkNarrative: "Compared to faculty at top NIRF-ranked CS departments (IIT Madras, IIT Delhi, IIT Bombay), Dr. Sharma's publication count is below average (top faculty average 40+ papers with H-index 15+). However, the depth in combinatorial optimization is a distinguishing strength that could be leveraged for collaborative research with stronger groups.",
    topResearchersComparison: "Top CS faculty at IIT Madras and IIT Bombay maintain active research labs with 5-8 PhD students, secure 2-3 funded projects simultaneously, and publish 4-6 international journal papers annually. Dr. Sharma's profile would benefit from establishing a focused research lab, pursuing funded projects, and targeting top-tier venues.",
    collaborationOpportunities: "Potential collaborations exist with optimization groups at IISc Bangalore, combinatorics researchers at IMSc Chennai, and applied algorithms labs at IIIT Hyderabad. Industry collaboration with companies like Google Research India or Microsoft Research India on graph optimization problems could significantly boost both impact and funding.",
  },
  researchDirections: [
    { direction: "Apply combinatorial optimization to AI/ML pipeline optimization", rationale: "Leverages existing strengths while entering a high-impact emerging area.", impactPotential: "High" as const },
    { direction: "Pursue collaborative research with IISc or IIIT-H optimization groups", rationale: "Increases publication venue quality and citation potential through established networks.", impactPotential: "High" as const },
    { direction: "Develop an industry-funded research project on graph-based recommendation systems", rationale: "Bridges research-industry gap, provides student training opportunities, and secures funding.", impactPotential: "Medium" as const },
  ],
};
