import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell, FileText, ScanLine, Search, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ScannedDocument } from "../types/document";
import { DocumentCard } from "./DocumentCard";

const QUICK_ACTIONS = [
  {
    icon: <ScanLine size={20} className="text-blue-500" />,
    title: "Scan Document",
    desc: "Use camera to scan",
    step: "01",
  },
  {
    icon: <Upload size={20} className="text-emerald-500" />,
    title: "Import & Edit",
    desc: "Upload from device",
    step: "02",
  },
  {
    icon: <FileText size={20} className="text-violet-500" />,
    title: "Export PDF",
    desc: "Save as PDF file",
    step: "03",
  },
];

interface MainContentProps {
  documents: ScannedDocument[];
  onDelete: (id: string) => void;
}

export function MainContent({ documents, onDelete }: MainContentProps) {
  const [search, setSearch] = useState("");

  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="flex-1 flex flex-col min-h-screen" data-ocid="main.page">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 bg-card border-b border-border sticky top-0 z-10">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-64 text-sm bg-background"
            data-ocid="main.search_input"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            data-ocid="main.bell.button"
          >
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className="text-xs font-semibold"
                style={{ backgroundColor: "#1E88E5", color: "white" }}
              >
                JD
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              John Doe
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8">
        {/* Welcome heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-7"
        >
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            You have {documents.length} documents in your library.
          </p>
        </motion.div>

        {/* Quick action cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.div
              key={action.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-4 shadow-card hover:shadow-md transition-shadow cursor-pointer"
              data-ocid={`main.quick_action.card.${i + 1}`}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {action.desc}
                </p>
              </div>
              <span className="ml-auto text-2xl font-bold text-border">
                {action.step}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Documents section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Scanned Documents
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {filtered.length} files
            </span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-muted-foreground"
            data-ocid="documents.empty_state"
          >
            <FileText size={40} className="opacity-20 mb-3" />
            <p className="text-sm">
              {search
                ? "No documents match your search."
                : "No documents yet. Scan or import to get started."}
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            data-ocid="documents.list"
          >
            {filtered.map((doc, i) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                index={i + 1}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with{" "}
          <span className="text-red-400">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </main>
  );
}
