import type { QualityType } from "../types/document";

const QUALITY_MAP: Record<QualityType, number> = {
  High: 0.92,
  Medium: 0.75,
  Low: 0.5,
};

export async function exportAsPDF(
  imgBase64: string,
  filename: string,
  quality: QualityType,
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");

  const img = new Image();
  img.src = imgBase64;

  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });

  const imgW = img.naturalWidth || 800;
  const imgH = img.naturalHeight || 1100;

  // A4 dimensions in mm: 210 x 297
  const pageW = 210;
  const pageH = 297;

  const scale = Math.min(pageW / imgW, pageH / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  const offsetX = (pageW - drawW) / 2;
  const offsetY = (pageH - drawH) / 2;

  const doc = new jsPDF({
    orientation: imgW > imgH ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  // Re-export with quality
  const canvas = document.createElement("canvas");
  canvas.width = imgW;
  canvas.height = imgH;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(img, 0, 0);
  }
  const q = QUALITY_MAP[quality];
  const compressedBase64 = canvas.toDataURL("image/jpeg", q);
  const base64Data = compressedBase64.split(",")[1];

  doc.addImage(base64Data, "JPEG", offsetX, offsetY, drawW, drawH);
  doc.save(`${filename}.pdf`);
}
