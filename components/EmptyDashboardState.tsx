"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface EmptyDashboardStateProps {
  title: string;
  description: string;
  uploadHref: string;
  uploadLabel: string;
  demoHref?: string;
  icon: React.ReactNode;
}

export default function EmptyDashboardState({
  title,
  description,
  uploadHref,
  uploadLabel,
  demoHref,
  icon,
}: EmptyDashboardStateProps) {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-lg text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-deepblue/10 text-deepblue">
            {icon}
          </div>

          <h1 className="mt-6 font-display text-2xl font-bold text-navy sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {description}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={uploadHref}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <Upload size={16} />
              {uploadLabel}
            </Link>

            {demoHref && (
              <Link
                href={demoHref}
                className="inline-flex items-center gap-2 rounded-full border border-silver bg-white px-6 py-3 text-sm font-medium text-muted transition-all duration-200 hover:border-deepblue/30 hover:text-navy hover:shadow-soft"
              >
                <Eye size={16} />
                View Demo
              </Link>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
