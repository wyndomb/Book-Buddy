"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { TextAnalysis } from "../components/TextAnalysis";
import toast from "react-hot-toast";
import { CameraIcon } from "@heroicons/react/24/outline";

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
        <div
          className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
          style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
        ></div>
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [buttonText, setButtonText] = useState("Select Image");
  const [isMounted, setIsMounted] = useState(false);

  // Check if the device is mobile
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Check specifically for iOS devices
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Use useEffect to update the button text after component mounts
  useEffect(() => {
    setIsMounted(true);
    if (isMobile) {
      setButtonText("Take Photo");
    } else {
      setButtonText("Select Image");
    }
  }, [isMobile]);

  const handleTextExtracted = (text: string) => {
    console.log("Text extracted:", text.substring(0, 50) + "...");
    setExtractedText(text);
    setShowCamera(false);
  };

  const handleCameraClick = () => {
    console.log("Camera button clicked");

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    if (isMobile) {
      // On mobile, use the capture attribute
      if (!isIOS) {
        input.setAttribute("capture", "environment");
      }
    }

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log("File selected:", file.name);
        setSelectedFile(file);
        setShowCamera(true);
      }
    };

    input.click();
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-white to-neutral-50"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        paddingTop: "10vh",
        paddingBottom: "10vh",
      }}
    >
      {!showCamera && !extractedText ? (
        <div
          className="w-full max-w-md flex flex-col items-center text-center"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "28rem",
            width: "100%",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <div className="mb-6 animate-bounce-in">
            <span
              className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-500 text-sm font-medium"
              style={{
                backgroundColor: "#e0e7ff",
                color: "#6366f1",
                borderRadius: "9999px",
                padding: "0.375rem 1rem",
              }}
            >
              AI-Powered OCR
            </span>
          </div>

          <h1
            className="font-bold text-4xl mb-4 animate-slide-up"
            style={{
              fontWeight: "700",
              fontSize: "2.25rem",
              marginBottom: "1rem",
            }}
          >
            Turn Text Into <br />
            <span
              className="gradient-text font-extrabold"
              style={{
                fontWeight: "800",
                backgroundImage: "linear-gradient(to right, #6366f1, #8b5cf6)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Understanding
            </span>
          </h1>

          <p
            className="text-neutral-600 mb-8 max-w-xs mx-auto animate-fade-in"
            style={{
              color: "#4b5563",
              marginBottom: "2rem",
              maxWidth: "20rem",
            }}
          >
            Capture any textbook page and instantly get a clear explanation of
            complex concepts
          </p>

          <div
            className="flex flex-col items-center mb-4 animate-scale"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={handleCameraClick}
              className="gradient-btn p-5 rounded-full flex items-center justify-center mb-4 shadow-button hover:shadow-button-hover transform hover:scale-105 active:scale-95 transition-all duration-300 camera-btn"
              style={{
                backgroundImage: "linear-gradient(to right, #6366f1, #8b5cf6)",
                color: "white",
                padding: "1.25rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease",
              }}
              aria-label="Take picture"
            >
              <div
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "9999px",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CameraIcon
                  className="h-8 w-8 text-primary-500"
                  style={{ height: "2rem", width: "2rem", color: "#6366f1" }}
                />
              </div>
            </button>
            <p
              className="text-neutral-700 font-medium mt-1"
              style={{
                color: "#374151",
                fontWeight: "500",
                marginTop: "0.25rem",
              }}
            >
              {buttonText}
            </p>
          </div>
        </div>
      ) : null}

      {showCamera && selectedFile && (
        <div
          className="camera-container w-full max-w-md flex flex-col items-center animate-fade-in"
          style={{
            width: "100%",
            maxWidth: "28rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <DynamicCamera
            onTextExtracted={handleTextExtracted}
            selectedFile={selectedFile}
          />
          <button
            onClick={() => {
              setShowCamera(false);
              setSelectedFile(null);
            }}
            className="mt-4 px-6 py-2.5 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors shadow-sm hover:shadow-md"
            style={{
              marginTop: "1rem",
              padding: "0.625rem 1.5rem",
              borderRadius: "9999px",
              borderWidth: "1px",
              borderColor: "#e5e7eb",
              color: "#374151",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {extractedText && (
        <div
          className="w-full max-w-md"
          style={{ width: "100%", maxWidth: "28rem" }}
        >
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
        </div>
      )}
    </main>
  );
}
