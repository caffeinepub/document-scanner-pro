import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Brain,
  Columns2,
  Combine,
  Crop,
  FileCheck,
  FileImage,
  FileOutput,
  FileSearch,
  FileSignature,
  FileText,
  FileType,
  FileType2,
  FileX,
  Globe,
  Hash,
  Languages,
  Layers,
  List,
  Lock,
  LockOpen,
  Minimize2,
  Minus,
  PenLine,
  RefreshCw,
  RotateCw,
  ScanLine,
  Scissors,
  Settings2,
  ShieldCheck,
  Sparkles,
  Stamp,
  Wrench,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type Tool = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  badge?: string;
};

type ToolCategory = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  tools: Tool[];
};

const CATEGORIES: ToolCategory[] = [
  {
    id: "organize",
    title: "Organize PDF",
    icon: <Layers size={18} />,
    color: "text-blue-400",
    tools: [
      {
        id: "merge",
        label: "Merge PDF",
        icon: <Combine size={16} />,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      },
      {
        id: "split",
        label: "Split PDF",
        icon: <Scissors size={16} />,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      },
      {
        id: "remove-pages",
        label: "Remove Pages",
        icon: <Minus size={16} />,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      },
      {
        id: "extract-pages",
        label: "Extract Pages",
        icon: <FileOutput size={16} />,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      },
      {
        id: "organize-pdf",
        label: "Organize PDF",
        icon: <List size={16} />,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      },
    ],
  },
  {
    id: "scan",
    title: "Scan to PDF",
    icon: <ScanLine size={18} />,
    color: "text-emerald-400",
    tools: [
      {
        id: "scan-to-pdf",
        label: "Scan to PDF",
        icon: <ScanLine size={16} />,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        id: "optimize",
        label: "Optimize PDF",
        icon: <Zap size={16} />,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        id: "compress",
        label: "Compress PDF",
        icon: <Minimize2 size={16} />,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        id: "repair",
        label: "Repair PDF",
        icon: <Wrench size={16} />,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        id: "ocr",
        label: "OCR PDF",
        icon: <FileSearch size={16} />,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        badge: "AI",
      },
    ],
  },
  {
    id: "convert-to",
    title: "Convert to PDF",
    icon: <FileText size={18} />,
    color: "text-violet-400",
    tools: [
      {
        id: "jpg-to-pdf",
        label: "JPG to PDF",
        icon: <FileImage size={16} />,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
      },
      {
        id: "word-to-pdf",
        label: "WORD to PDF",
        icon: <FileType size={16} />,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
      },
      {
        id: "pptx-to-pdf",
        label: "POWERPOINT to PDF",
        icon: <Columns2 size={16} />,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
      },
      {
        id: "excel-to-pdf",
        label: "EXCEL to PDF",
        icon: <FileCheck size={16} />,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
      },
      {
        id: "html-to-pdf",
        label: "HTML to PDF",
        icon: <Globe size={16} />,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
      },
    ],
  },
  {
    id: "convert-from",
    title: "Convert from PDF",
    icon: <FileOutput size={18} />,
    color: "text-amber-400",
    tools: [
      {
        id: "pdf-to-jpg",
        label: "PDF to JPG",
        icon: <FileImage size={16} />,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
      },
      {
        id: "pdf-to-word",
        label: "PDF to WORD",
        icon: <FileType size={16} />,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
      },
      {
        id: "pdf-to-pptx",
        label: "PDF to POWERPOINT",
        icon: <Columns2 size={16} />,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
      },
      {
        id: "pdf-to-excel",
        label: "PDF to EXCEL",
        icon: <FileCheck size={16} />,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
      },
      {
        id: "pdf-to-pdfa",
        label: "PDF to PDF/A",
        icon: <FileType2 size={16} />,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
      },
    ],
  },
  {
    id: "edit",
    title: "Edit PDF",
    icon: <PenLine size={18} />,
    color: "text-pink-400",
    tools: [
      {
        id: "rotate",
        label: "Rotate PDF",
        icon: <RotateCw size={16} />,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
      },
      {
        id: "page-numbers",
        label: "Add Page Numbers",
        icon: <Hash size={16} />,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
      },
      {
        id: "watermark",
        label: "Add Watermark",
        icon: <Stamp size={16} />,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
      },
      {
        id: "crop",
        label: "Crop PDF",
        icon: <Crop size={16} />,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
      },
      {
        id: "edit-pdf",
        label: "Edit PDF",
        icon: <PenLine size={16} />,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
      },
    ],
  },
  {
    id: "security",
    title: "PDF Security",
    icon: <ShieldCheck size={18} />,
    color: "text-rose-400",
    tools: [
      {
        id: "unlock",
        label: "Unlock PDF",
        icon: <LockOpen size={16} />,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
      },
      {
        id: "protect",
        label: "Protect PDF",
        icon: <Lock size={16} />,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
      },
      {
        id: "sign",
        label: "Sign PDF",
        icon: <FileSignature size={16} />,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
      },
      {
        id: "redact",
        label: "Redact PDF",
        icon: <FileX size={16} />,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
      },
      {
        id: "compare",
        label: "Compare PDF",
        icon: <Columns2 size={16} />,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
      },
    ],
  },
  {
    id: "intelligence",
    title: "PDF Intelligence",
    icon: <Brain size={18} />,
    color: "text-fuchsia-400",
    tools: [
      {
        id: "ai-summarizer",
        label: "AI Summarizer",
        icon: <Sparkles size={16} />,
        color: "text-fuchsia-400",
        bg: "bg-fuchsia-500/10",
        badge: "AI",
      },
      {
        id: "translate-pdf",
        label: "Translate PDF",
        icon: <Languages size={16} />,
        color: "text-fuchsia-400",
        bg: "bg-fuchsia-500/10",
        badge: "AI",
      },
    ],
  },
];

type ToolModalState = { tool: Tool; category: ToolCategory } | null;

export function PDFToolsPanel() {
  const [activeCategory, setActiveCategory] = useState<string>("organize");
  const [activeTool, setActiveTool] = useState<ToolModalState>(null);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory)!;

  function closeModal() {
    setActiveTool(null);
    setDone(false);
  }

  function handleToolClick(tool: Tool, category: ToolCategory) {
    setActiveTool({ tool, category });
    setFile(null);
    setDone(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function handleProcess() {
    if (!file) {
      toast.error("Please upload a PDF file first.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      toast.success(`${activeTool?.tool.label} completed successfully!`);
    }, 2000);
  }

  function handleDownload() {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `processed_${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  }

  return (
    <div className="flex-1 p-8" data-ocid="pdftools.page">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-7"
      >
        <h1 className="text-3xl font-bold text-foreground">PDF Tools</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          A complete toolkit — organize, convert, edit, secure, and analyze your
          PDFs.
        </p>
      </motion.div>

      <div className="flex gap-6">
        {/* Category sidebar */}
        <div
          className="flex-shrink-0 w-52 space-y-1"
          data-ocid="pdftools.categories"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              type="button"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left",
                activeCategory === cat.id
                  ? "bg-primary/15 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              style={{
                boxShadow:
                  activeCategory === cat.id
                    ? "inset 3px 0 0 #1E88E5"
                    : undefined,
              }}
              data-ocid={`pdftools.category.${cat.id}`}
            >
              <span className={cn("flex-shrink-0", cat.color)}>{cat.icon}</span>
              <span className="truncate">{cat.title}</span>
              <span className="ml-auto text-xs text-muted-foreground font-normal">
                {cat.tools.length}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Tools grid */}
        <div className="flex-1">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={currentCategory.color}>
                {currentCategory.icon}
              </span>
              <h2 className="text-base font-semibold text-foreground">
                {currentCategory.title}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {currentCategory.tools.length} tools
              </Badge>
            </div>
            <div
              className="grid grid-cols-3 gap-3"
              data-ocid={`pdftools.tools.${activeCategory}`}
            >
              {currentCategory.tools.map((tool, i) => (
                <motion.button
                  key={tool.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  onClick={() => handleToolClick(tool, currentCategory)}
                  className="bg-card border border-border rounded-2xl p-4 flex flex-col items-start gap-3 hover:shadow-md hover:border-primary/40 hover:bg-muted/40 active:scale-[0.97] transition-all cursor-pointer text-left group"
                  data-ocid={`pdftools.tool.${tool.id}`}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center",
                      tool.bg,
                    )}
                  >
                    <span className={tool.color}>{tool.icon}</span>
                  </div>
                  <div className="flex items-center gap-1.5 w-full">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                      {tool.label}
                    </span>
                    {tool.badge && (
                      <Badge
                        className="text-[9px] py-0 px-1 h-3.5 font-semibold flex-shrink-0"
                        style={{
                          backgroundColor: "#7c3aed",
                          color: "white",
                          border: "none",
                        }}
                      >
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tool Modal */}
      {activeTool && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full border-0 p-0 bg-transparent"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={closeModal}
          data-ocid="pdftools.modal.overlay"
          aria-label="Close modal"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-ocid="pdftools.modal.content"
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  activeTool.tool.bg,
                )}
              >
                <span className={activeTool.tool.color}>
                  {activeTool.tool.icon}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {activeTool.tool.label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeTool.category.title}
                </p>
              </div>
            </div>

            {!done ? (
              <>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center mb-4 hover:border-primary/40 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    id="pdf-tool-file"
                    onChange={handleFileChange}
                    data-ocid="pdftools.modal.file_input"
                  />
                  <label
                    htmlFor="pdf-tool-file"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <FileText size={20} className="text-muted-foreground" />
                    </div>
                    {file ? (
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB — ready to process
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Click to upload file
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG, DOCX supported
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={closeModal}
                    data-ocid="pdftools.modal.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleProcess}
                    disabled={processing || !file}
                    data-ocid="pdftools.modal.process_button"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw size={14} className="animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Settings2 size={14} />
                        Process
                      </span>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <FileCheck size={28} className="text-emerald-400" />
                </div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Done!
                </h4>
                <p className="text-sm text-muted-foreground mb-5">
                  {activeTool.tool.label} completed successfully.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={closeModal}
                    data-ocid="pdftools.modal.close_button"
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleDownload}
                    data-ocid="pdftools.modal.download_button"
                  >
                    <FileOutput size={14} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </button>
      )}
    </div>
  );
}
