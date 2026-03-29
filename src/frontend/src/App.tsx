import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import ChatbotPanel from "./components/ChatbotPanel";
import { MainContent } from "./components/MainContent";
import { PDFToolsPanel } from "./components/PDFToolsPanel";
import { ScannerPanel } from "./components/ScannerPanel";
import { Sidebar } from "./components/Sidebar";
import { useDocuments } from "./hooks/useDocuments";
import type { ScannedDocument } from "./types/document";

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  const { documents, addDocument, deleteDocument } = useDocuments();

  const sidebarWidth = sidebarCollapsed ? 64 : 240;
  const rightPanelWidth = 320;

  function handleNewScan() {
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

  function handleExportPDF() {
    const el = document.querySelector(
      '[data-ocid="scanner.export.primary_button"]',
    ) as HTMLButtonElement;
    el?.click();
  }

  function handleDocumentSaved(doc: ScannedDocument) {
    addDocument(doc);
  }

  const isChatbot = activeNav === "chatbot";
  const isPDFTools = activeNav === "pdftools";
  const hideRightPanel = isChatbot || isPDFTools;

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

      <div
        className="flex-1 flex flex-col"
        style={{
          marginLeft: `${sidebarWidth}px`,
          marginRight: hideRightPanel ? 0 : `${rightPanelWidth}px`,
          transition: "margin-left 0.3s, margin-right 0.3s",
        }}
      >
        {isChatbot ? (
          <ChatbotPanel currentImage={currentImageSrc} documents={documents} />
        ) : isPDFTools ? (
          <PDFToolsPanel />
        ) : (
          <MainContent
            activeNav={activeNav}
            documents={documents}
            onDelete={deleteDocument}
            onScanDocument={handleNewScan}
            onImportEdit={handleImport}
            onExportPDF={handleExportPDF}
            onOpenChatbot={() => setActiveNav("chatbot")}
            onOpenPDFTools={() => setActiveNav("pdftools")}
          />
        )}
      </div>

      {!hideRightPanel && (
        <ScannerPanel
          onDocumentSaved={handleDocumentSaved}
          onImageChange={setCurrentImageSrc}
        />
      )}

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
