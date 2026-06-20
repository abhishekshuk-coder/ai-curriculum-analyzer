import Link from "next/link";
import { Sparkles } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Upload Curriculum", href: "/#upload-module" },
      { label: "Demo Dashboard", href: "/dashboard" },
      { label: "Skill Cloud", href: "/#platform" },
      { label: "Curriculum Doctor™", href: "/dashboard" },
    ],
  },
  {
    title: "Audiences",
    links: [
      { label: "For Students", href: "/students" },
      { label: "For Faculty", href: "/#faculty" },
      { label: "Executive Reporting", href: "/#reporting" },
    ],
  },
  {
    title: "Programs Supported",
    links: [
      { label: "MBA & BBA", href: "/#platform" },
      { label: "Engineering & CS", href: "/#platform" },
      { label: "Healthcare & Pharmacy", href: "/#platform" },
      { label: "Design & Hospitality", href: "/#platform" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-silver bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-deepblue to-emerald text-white shadow-soft">
                <Sparkles size={18} />
              </span>
              <span className="font-display font-bold text-lg text-navy">
                Curriculum<span className="text-emerald">IQ</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">
              The Universal AI Curriculum Relevance Analyzer — helping academic institutions
              align programs with real-world industry demand.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-navy">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center text-sm text-muted transition-colors duration-200 hover:text-deepblue"
                    >
                      <span className="relative">
                        {l.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-emerald transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-silver pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} CurriculumIQ. Demo experience — analysis shown uses sample data.</p>
          <p>Designed for Academic Councils, Boards of Studies & Accreditation Teams.</p>
        </div>
      </div>
    </footer>
  );
}
