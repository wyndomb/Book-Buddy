"use client";

import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import toast from "react-hot-toast";
import { CameraIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface CameraProps {
  onTextExtracted: (text: string) => void;
}

export function Camera({ onTextExtracted }: CameraProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No image captured");
      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        try {
          console.log("Processing captured image with OCR...");
          const worker = await createWorker("eng");
          const {
            data: { text },
          } = await worker.recognize(base64String);
          await worker.terminate();

          if (!text.trim()) {
            console.log("No text detected in image");
            toast.error("No text detected in the image");
            return;
          }

          console.log("Text extracted successfully");
          onTextExtracted(text.trim());
        } catch (error) {
          console.error("OCR Error:", error);
          toast.error("Failed to process image");
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image processing error:", error);
      toast.error("Failed to process image");
      setIsProcessing(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={() => document.getElementById("camera-input")?.click()}
        disabled={isProcessing}
        className="btn btn-primary btn-lg gap-2"
      >
        {isProcessing ? (
          <ArrowPathIcon className="h-6 w-6 animate-spin" />
        ) : (
          <>
            <CameraIcon className="h-6 w-6" />
            Take Picture
          </>
        )}
      </button>

      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageCapture}
        disabled={isProcessing}
      />

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Processing image...</p>
          </div>
        </div>
      )}
    </div>
  );
}
