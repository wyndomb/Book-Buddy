"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CameraIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { TextAnalysis } from "../components/TextAnalysis";
import toast from "react-hot-toast";

const DynamicCamera = dynamic(
  () => {
    console.log("Loading camera component...");
    return import("../components/Camera")
      .then((mod) => {
        console.log("Camera component loaded successfully");
        return mod.Camera;
      })
      .catch((error) => {
        console.error("Failed to load camera:", error);
        toast.error("Failed to initialize camera");
        throw error;
      });
  },
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading camera...</p>
      </div>
    ),
  }
);

export default function Home() {
  const [showCamera, setShowCamera] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTextExtracted = (text: string) => {
    console.log("Text extracted:", text.substring(0, 50) + "...");
    setExtractedText(text);
    setShowCamera(false);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-12">
        <BookOpenIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Buddy</h1>
        <p className="text-gray-600">Your AI Reading Companion</p>
      </div>

      {!showCamera && !extractedText && (
        <div className="text-center">
          <DynamicCamera onTextExtracted={handleTextExtracted} />
        </div>
      )}

      {showCamera && (
        <div className="camera-container mb-6">
          <DynamicCamera onTextExtracted={handleTextExtracted} />
          <button
            onClick={() => setShowCamera(false)}
            className="btn btn-outline mt-4"
          >
            Cancel
          </button>
        </div>
      )}

      {extractedText && (
        <TextAnalysis
          text={extractedText}
          analysis={analysis}
          setAnalysis={setAnalysis}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onReset={() => {
            setExtractedText("");
            setAnalysis("");
            setShowCamera(false);
          }}
        />
      )}
    </main>
  );
}
