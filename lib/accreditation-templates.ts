import type { HistoryEntry } from "./executive-store";

export type AccreditationBody = "NAAC" | "NBA" | "AACSB" | "ABET";

export interface AccreditationSection {
  number: string;
  title: string;
  content: string;
}

export const ACCREDITATION_INFO: Record<AccreditationBody, { name: string; description: string }> = {
  NAAC: { name: "NAAC", description: "National Assessment and Accreditation Council — quality assurance for Indian higher education" },
  NBA: { name: "NBA", description: "National Board of Accreditation — program-level accreditation (outcomes-based)" },
  AACSB: { name: "AACSB", description: "Association to Advance Collegiate Schools of Business — global B-School accreditation" },
  ABET: { name: "ABET", description: "Accreditation Board for Engineering and Technology — engineering/computing programs" },
};

export function generateAccreditationReport(
  body: AccreditationBody,
  history: HistoryEntry[]
): AccreditationSection[] {
  const curriculum = history.filter((h) => h.type === "curriculum");
  const students = history.filter((h) => h.type === "student");
  const faculty = history.filter((h) => h.type === "faculty");
  const avgHealth = history.length ? Math.round(history.reduce((s, h) => s + h.healthScore, 0) / history.length) : 0;
  const avgCurriculum = curriculum.length ? Math.round(curriculum.reduce((s, h) => s + h.healthScore, 0) / curriculum.length) : 0;
  const avgStudent = students.length ? Math.round(students.reduce((s, h) => s + h.healthScore, 0) / students.length) : 0;
  const avgFaculty = faculty.length ? Math.round(faculty.reduce((s, h) => s + h.healthScore, 0) / faculty.length) : 0;

  const commonStrengths = getTopItems(history, "topStrength");
  const commonWeaknesses = getTopItems(history, "topWeakness");

  switch (body) {
    case "NAAC":
      return [
        { number: "1", title: "Curricular Aspects", content: `${curriculum.length} curriculum analyses conducted. Average Curriculum Health Score: ${avgCurriculum}/100. Programs analyzed: ${curriculum.map((c) => c.title).join(", ") || "None yet"}. Top strengths across curricula: ${commonStrengths}. Key areas for improvement: ${commonWeaknesses}.` },
        { number: "2", title: "Teaching-Learning and Evaluation", content: `${faculty.length} faculty teaching portfolios analyzed. Average Teaching Effectiveness Score: ${avgFaculty}/100. The AI analysis evaluated pedagogy quality, assessment design, technology integration, and innovative teaching methods across all submitted portfolios.` },
        { number: "3", title: "Research, Innovations and Extension", content: `Faculty research profiles analyzed: ${faculty.length}. Research impact assessments include peer benchmarking against top NIRF-ranked institutions, H-index estimation, and identification of collaboration opportunities.` },
        { number: "5", title: "Student Support and Progression", content: `${students.length} student profiles analyzed. Average Career Readiness Score: ${avgStudent}/100. The platform provides personalized skill-gap analysis, career roadmaps, and industry readiness assessments for each student.` },
        { number: "6", title: "Governance, Leadership and Management", content: `Overall platform health score across ${history.length} analyses: ${avgHealth}/100. The AI-powered analysis engine provides data-driven insights for institutional decision-making, enabling evidence-based curriculum development and faculty development planning.` },
        { number: "7", title: "Institutional Values and Best Practices", content: `The institution leverages AI-powered curriculum analysis for continuous quality improvement. The platform evaluates future-readiness across AI literacy, data fluency, automation, and sustainability dimensions, ensuring curricula stay aligned with emerging industry demands.` },
      ];
    case "NBA":
      return [
        { number: "1", title: "Program Educational Objectives (PEOs)", content: `Programs analyzed: ${curriculum.map((c) => c.title).join(", ") || "None yet"}. Average industry alignment: ${avgCurriculum}/100. The AI analysis maps each program's educational objectives against current industry requirements and identifies alignment gaps.` },
        { number: "2", title: "Program Outcomes (POs)", content: `Skill gap analysis conducted across ${curriculum.length} programs. Top strengths: ${commonStrengths}. The platform evaluates 8 dimensions including curriculum relevance, employability, future readiness, and industry alignment for each program.` },
        { number: "3", title: "Course Outcomes (COs)", content: `${curriculum.length} curricula analyzed at the course level. The AI Curriculum Doctor™ provides diagnostic assessments identifying outdated topics, redundant content, missing technologies, and areas needing industry project integration.` },
        { number: "4", title: "Students' Performance", content: `${students.length} student profiles analyzed. Average Career Readiness: ${avgStudent}/100. Individual assessments include skill-gap radar, career trajectory projections, and employability simulation across multiple industry verticals.` },
        { number: "5", title: "Faculty Information and Contributions", content: `${faculty.length} faculty portfolios analyzed. Teaching effectiveness, research impact, and peer benchmarking data available. The platform assesses pedagogy quality, technology integration, and innovative teaching practices.` },
        { number: "6", title: "Continuous Improvement", content: `The platform generates actionable improvement roadmaps for curricula (average ${curriculum.length > 0 ? "5-8" : "N/A"} prioritized actions per analysis), faculty development plans, and student career roadmaps. The Employability Simulator™ enables what-if analysis for proposed improvements.` },
      ];
    case "AACSB":
      return [
        { number: "1", title: "Engagement, Innovation, and Impact", content: `The institution deploys AI-powered analytics across ${history.length} assessments covering curriculum (${curriculum.length}), student (${students.length}), and faculty (${faculty.length}) dimensions. This data-driven approach demonstrates commitment to innovation in quality assurance and continuous improvement.` },
        { number: "2", title: "Assurance of Learning", content: `${curriculum.length} program curricula analyzed for learning outcome alignment. Average Health Score: ${avgCurriculum}/100. Each analysis produces evidence-grounded findings with specific citations from curriculum documents, mapped against industry expectations and emerging skill demands.` },
        { number: "3", title: "Faculty Qualifications and Engagement", content: `${faculty.length} faculty portfolios assessed. Research benchmarking against top NIRF-ranked institutions conducted. Teaching effectiveness evaluated across 8 dimensions with specific improvement recommendations.` },
        { number: "4", title: "Curricula Management and Assurance of Learning", content: `The platform's NIRF Benchmarking feature compares each curriculum against top-ranked Indian institutions in the same field. Missing skills analysis identifies critical gaps in AI literacy, data fluency, cloud computing, and sustainability — the four pillars of future-readiness tracked across 2025-2030 projections.` },
      ];
    case "ABET":
      return [
        { number: "1", title: "Students", content: `${students.length} student outcomes assessed via AI-powered career readiness analysis. Average readiness: ${avgStudent}/100. Individual assessments cover technical skills, soft skills, academic performance, industry readiness, experience depth, certification strength, career clarity, and market alignment.` },
        { number: "2", title: "Program Educational Objectives", content: `${curriculum.length} programs analyzed for industry alignment. Average curriculum health: ${avgCurriculum}/100. The AI analysis evaluates curriculum relevance, employability, future readiness, and practical exposure against current industry benchmarks.` },
        { number: "3", title: "Student Outcomes", content: `Key outcome areas assessed: ${commonStrengths}. Areas requiring attention: ${commonWeaknesses}. The platform's skill-gap radar provides granular comparison between curriculum coverage and industry expectations across 6-8 skill families per program.` },
        { number: "4", title: "Continuous Improvement", content: `The AI engine produces prioritized action plans for each program assessment (average 5-8 actions per curriculum analysis). The Employability Simulator™ quantifies the projected impact of each proposed improvement, enabling data-driven decisions about curriculum modifications.` },
        { number: "5", title: "Faculty", content: `${faculty.length} faculty evaluations completed. Teaching effectiveness assessed across pedagogy quality, assessment design, technology integration, and innovative teaching. Research impact benchmarked against faculty at top NIRF-ranked institutions.` },
      ];
  }
}

function getTopItems(history: HistoryEntry[], field: "topStrength" | "topWeakness"): string {
  const counts: Record<string, number> = {};
  history.forEach((h) => { counts[h[field]] = (counts[h[field]] || 0) + 1; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k)
    .join(", ") || "N/A";
}
