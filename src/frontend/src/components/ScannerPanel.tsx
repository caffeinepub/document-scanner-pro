import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Camera,
  FileDown,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getFullResBase64, imageToBase64 } from "../lib/imageFilters";
import { exportAsPDF } from "../lib/pdfExport";
import type {
  FilterType,
  FormatType,
  QualityType,
  ScannedDocument,
} from "../types/document";
import { CameraModal } from "./CameraModal";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "original", label: "Original" },
  { id: "grayscale", label: "Grayscale" },
  { id: "bw", label: "B&W" },
  { id: "enhance", label: "Enhance" },
];

interface ScannerPanelProps {
  onDocumentSaved: (doc: ScannedDocument) => void;
}

export function ScannerPanel({ onDocumentSaved }: ScannerPanelProps) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("original");
  const [rotation, setRotation] = useState(0);
  const [docName, setDocName] = useState("Scanned Document");
  const [format, setFormat] = useState<FormatType>("PDF");
  const [quality, setQuality] = useState<QualityType>("High");
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const regeneratePreview = useCallback(() => {
    if (!imgRef.current || !imageSrc) return;
    const img = imgRef.current;
    if (!img.complete || img.naturalWidth === 0) return;
    const thumb = imageToBase64(img, filter, rotation, 400, 520);
    setPreviewUrl(thumb);
  }, [imageSrc, filter, rotation]);

  useEffect(() => {
    regeneratePreview();
  }, [regeneratePreview]);

  function handleFileSelect(file: File) {
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setPreviewUrl(null);
    setRotation(0);
    const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
    setDocName(nameWithoutExt || "Scanned Document");
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }

  function handleCameraCapture(file: File) {
    handleFileSelect(file);
  }

  function rotateLeft() {
    setRotation((r) => (r - 90 + 360) % 360);
  }

  function rotateRight() {
    setRotation((r) => (r + 90) % 360);
  }

  async function handleExport() {
    if (!imgRef.current || !imageSrc) {
      toast.error("Please load an image first.");
      return;
    }

    setIsExporting(true);
    try {
      const fullBase64 = getFullResBase64(imgRef.current, filter, rotation);
      const thumb = imageToBase64(imgRef.current, filter, rotation, 200, 260);

      if (format === "PDF") {
        await exportAsPDF(fullBase64, docName, quality);
      } else {
        const link = document.createElement("a");
        link.href = fullBase64;
        link.download = `${docName}.${format.toLowerCase()}`;
        link.click();
      }

      const doc: ScannedDocument = {
        id: Date.now().toString(),
        name: docName,
        format,
        quality,
        filter,
        createdAt: new Date().toISOString(),
        thumbnail: thumb,
        fullImage: fullBase64,
      };

      onDocumentSaved(doc);
      toast.success(`Exported "${docName}.pdf" successfully!`);
    } catch (_err) {
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <aside
      className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border flex flex-col z-20"
      data-ocid="scanner.panel"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground">
          Active Scanner
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Capture &amp; Edit
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Preview */}
        <div className="p-4">
          <div
            className="relative rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center"
            style={{ height: "220px" }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon size={32} className="opacity-30" />
                <span className="text-xs">No image loaded</span>
              </div>
            )}
          </div>

          {/* Hidden img for processing */}
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="source"
              className="hidden"
              onLoad={regeneratePreview}
            />
          )}
        </div>

        {/* Camera + Upload */}
        <div className="px-4 pb-3 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setCameraOpen(true)}
            data-ocid="scanner.camera_view.button"
          >
            <Camera size={13} className="mr-1.5" />
            Camera View
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleUploadClick}
            data-ocid="scanner.upload_button"
          >
            <Upload size={13} className="mr-1.5" />
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            data-ocid="scanner.file.input"
          />
        </div>

        {/* Rotation */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex-1">Rotation</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={rotateLeft}
            data-ocid="scanner.rotate_left.button"
          >
            <RotateCcw size={13} />
          </Button>
          <span className="text-xs text-muted-foreground w-8 text-center">
            {rotation}°
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={rotateRight}
            data-ocid="scanner.rotate_right.button"
          >
            <RotateCw size={13} />
          </Button>
        </div>

        {/* Filter segmented control */}
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2">Filter</p>
          <div className="grid grid-cols-4 gap-1 bg-muted rounded-lg p-1">
            {FILTERS.map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => setFilter(f.id)}
                data-ocid={`scanner.filter_${f.id}.toggle`}
                className={cn(
                  "py-1.5 rounded-md text-xs font-medium transition-all",
                  filter === f.id
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Document settings */}
        <div className="px-4 pb-3 space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Document Name
            </Label>
            <Input
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="h-8 text-sm"
              data-ocid="scanner.name.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Format
              </Label>
              <Select
                value={format}
                onValueChange={(v) => setFormat(v as FormatType)}
              >
                <SelectTrigger
                  className="h-8 text-xs"
                  data-ocid="scanner.format.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="PNG">PNG</SelectItem>
                  <SelectItem value="JPEG">JPEG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Quality
              </Label>
              <Select
                value={quality}
                onValueChange={(v) => setQuality(v as QualityType)}
              >
                <SelectTrigger
                  className="h-8 text-xs"
                  data-ocid="scanner.quality.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Export CTA */}
      <div className="p-4 border-t border-border">
        <Button
          type="button"
          onClick={handleExport}
          disabled={isExporting || !imageSrc}
          className="w-full font-semibold"
          style={{ backgroundColor: "#1E88E5", color: "white" }}
          data-ocid="scanner.export.primary_button"
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Exporting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FileDown size={15} />
              Export as PDF
            </span>
          )}
        </Button>
      </div>

      <CameraModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </aside>
  );
}
