"use client";

import { useState, useRef } from "react";
import { Download, RefreshCw } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { UserData } from "@/types";
import IDCard from "./IDCard";

interface IDCardPreviewProps {
  userData: UserData;
}

export default function IDCardPreview({ userData }: IDCardPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const getCanvasFromCapture = async () => {
    if (!captureRef.current) return null;
    return await html2canvas(captureRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const canvas = await getCanvasFromCapture();
      if (!canvas) {
        alert("Card preview not available. Please try again.");
        return;
      }
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [54, 86],
      });
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `${userData.name?.replace(/\s+/g, "_") || "ID_Card"}_ID_Card.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = await getCanvasFromCapture();
      if (!canvas) {
        alert("Card preview not available. Please try again.");
        return;
      }
      const link = document.createElement("a");
      link.download = `${
        userData.name?.replace(/\s+/g, "_") || "ID_Card"
      }_ID_Card.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error generating image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visible scaled preview */}
      <div className="flex justify-center">
        <div className="transform scale-75 origin-center">
          <IDCard userData={userData} />
        </div>
      </div>

      {/* Hidden 1:1 capture node (kept offscreen) */}
      <div style={{ position: "absolute", left: -99999, top: -99999 }}>
        <div ref={captureRef}>
          <IDCard userData={userData} />
        </div>
      </div>

      {/* Download Buttons */}
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Your ID card is ready! Download in your preferred format.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Card Specifications */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Card Specifications
        </h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• Standard ID card size: 54mm × 86mm (portrait)</div>
          <div>• High resolution: 300 DPI</div>
          <div>• Print-ready format</div>
          <div>• Professional quality</div>
        </div>
      </div>
    </div>
  );
}
