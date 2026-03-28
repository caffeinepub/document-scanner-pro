import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { MainContent } from "./components/MainContent";
import { ScannerPanel } from "./components/ScannerPanel";
import { Sidebar } from "./components/Sidebar";
import { useDocuments } from "./hooks/useDocuments";
import type { ScannedDocument } from "./types/document";

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { documents, addDocument, deleteDocument } = useDocuments();

  const sidebarWidth = sidebarCollapsed ? 64 : 240;
  const rightPanelWidth = 320;

  function handleNewScan() {
    // Focus scanner panel - just show a toast hint
    const el = document.querySelector(
      '[data-ocid="scanner.camera_view.button"]',
    ) as HTMLButtonElement;
    el?.click();
  }

  function handleImport() {
    const el = document.querySelector(
      '[data-ocid="scanner.upload_button"]',
    ) as HTMLButtonElement;
    el?.click();
  }

  function handleDocumentSaved(doc: ScannedDocument) {
    addDocument(doc);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onNewScan={handleNewScan}
        onImport={handleImport}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Center content with margin for fixed sidebars */}
      <div
        className="flex-1 flex flex-col"
        style={{
          marginLeft: `${sidebarWidth}px`,
          marginRight: `${rightPanelWidth}px`,
          transition: "margin-left 0.3s",
        }}
      >
        <MainContent documents={documents} onDelete={deleteDocument} />
      </div>

      <ScannerPanel onDocumentSaved={handleDocumentSaved} />

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
