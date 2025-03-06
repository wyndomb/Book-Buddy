"use client";

import React, { useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import toast from "react-hot-toast";
import {
  DocumentTextIcon,
  SparklesIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

interface CameraProps {
  onTextExtracted: (text: string) => void;
  selectedFile: File;
}

export function Camera({ onTextExtracted, selectedFile }: CameraProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<
    "capturing" | "extracting" | "analyzing" | null
  >(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Process the selected file when component mounts
  useEffect(() => {
    if (selectedFile) {
      console.log("Processing selected file:", selectedFile.name);
      processFile(selectedFile);
    }
  }, [selectedFile]);

  const processFile = async (file: File) => {
    console.log("Processing file:", file.name);
    setIsProcessing(true);
    setProcessingStep("capturing");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setCapturedImage(base64String);
        await processImageData(base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image processing error:", error);
      toast.error("Failed to process image");
      setIsProcessing(false);
      setProcessingStep(null);
      setCapturedImage(null);
    }
  };

  const processImageData = async (base64String: string) => {
    try {
      // Simulate a slight delay to show the capturing step
      await new Promise((resolve) => setTimeout(resolve, 800));

      setProcessingStep("extracting");
      console.log("Processing captured image with OCR...");

      const worker = await createWorker("eng");
      const {
        data: { text },
      } = await worker.recognize(base64String);
      await worker.terminate();

      if (!text.trim()) {
        console.log("No text detected in image");
        toast.error("No text detected in the image");
        setIsProcessing(false);
        setProcessingStep(null);
        setCapturedImage(null);
        return;
      }

      // Simulate a slight delay before analysis step
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessingStep("analyzing");

      // Simulate AI analysis time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Text extracted successfully");
      onTextExtracted(text.trim());
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("Failed to process image");
      setIsProcessing(false);
      setProcessingStep(null);
      setCapturedImage(null);
    }
  };

  return (
    <div className="text-center">
      {capturedImage && !isProcessing && (
        <div className="mt-4 animate-bounce-in">
          <div className="relative rounded-2xl overflow-hidden shadow-card">
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full h-auto mx-auto"
              style={{ maxHeight: "300px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-[320px] w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center">
              {processingStep === "capturing" && (
                <>
                  <div
                    className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center animate-pulse mb-3"
                    style={{ backgroundColor: "#e0e7ff" }}
                  >
                    <CameraIcon
                      className="h-7 w-7 text-primary-500"
                      style={{ color: "#6366f1" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                    Capturing Image
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Processing your photo...
                  </p>
                </>
              )}

              {processingStep === "extracting" && (
                <>
                  <div
                    className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center animate-pulse mb-3"
                    style={{ backgroundColor: "#ede9fe" }}
                  >
                    <DocumentTextIcon
                      className="h-7 w-7 text-secondary-500"
                      style={{ color: "#8b5cf6" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                    Extracting Text
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Reading the content from your image...
                  </p>
                </>
              )}

              {processingStep === "analyzing" && (
                <>
                  <div
                    className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center animate-pulse mb-3"
                    style={{ backgroundColor: "#fce7f3" }}
                  >
                    <SparklesIcon
                      className="h-7 w-7 text-accent-500"
                      style={{ color: "#ec4899" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                    AI Analysis
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Generating insights from the text...
                  </p>
                </>
              )}

              <div className="w-full">
                <div
                  className="w-full bg-neutral-200 rounded-full h-1 mb-2"
                  style={{ backgroundColor: "#e5e7eb" }}
                >
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width:
                        processingStep === "capturing"
                          ? "33%"
                          : processingStep === "extracting"
                          ? "66%"
                          : processingStep === "analyzing"
                          ? "90%"
                          : "0%",
                      backgroundImage:
                        "linear-gradient(to right, #6366f1, #8b5cf6)",
                    }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-500 font-medium text-center">
                  {processingStep === "capturing"
                    ? "Step 1/3"
                    : processingStep === "extracting"
                    ? "Step 2/3"
                    : processingStep === "analyzing"
                    ? "Step 3/3"
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
