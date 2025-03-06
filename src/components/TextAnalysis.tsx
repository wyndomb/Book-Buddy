"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  SparklesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";

interface TextAnalysisProps {
  text: string;
  analysis: string;
  setAnalysis: (analysis: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onReset: () => void;
}

export function TextAnalysis({
  text,
  analysis,
  setAnalysis,
  isLoading,
  setIsLoading,
  onReset,
}: TextAnalysisProps) {
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
    }>
  >([]);

  useEffect(() => {
    const analyzeText = async () => {
      if (!text || analysis) return;

      setIsLoading(true);
      setAnimationStep(1);

      // Create initial particles
      const initialParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        color: getRandomColor(),
        speed: 0.5 + Math.random() * 1.5,
      }));
      setParticles(initialParticles);

      // Animation sequence
      setTimeout(() => setAnimationStep(2), 2000);
      setTimeout(() => setAnimationStep(3), 4000);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze text");
        }

        const data = await response.json();

        // Final animation step before showing results
        setAnimationStep(4);
        setTimeout(() => {
          setAnalysis(data.analysis);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Analysis Error:", error);
        setAnalysis("Failed to analyze the text. Please try again.");
        setIsLoading(false);
      }
    };

    analyzeText();

    // Particle animation
    const animateParticles = () => {
      if (isLoading && particles.length > 0) {
        setParticles((prevParticles) =>
          prevParticles.map((p) => ({
            ...p,
            y: p.y - p.speed,
            x: p.x + Math.sin(p.y / 10) * 0.5,
            // Reset particles that go off screen
            ...(p.y < -10 ? { y: 110, x: Math.random() * 100 } : {}),
          }))
        );
      }
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [text, analysis, setAnalysis, setIsLoading, isLoading, particles.length]);

  const getRandomColor = () => {
    const colors = [
      "#8b5cf6", // Purple
      "#6366f1", // Indigo
      "#ec4899", // Pink
      "#3b82f6", // Blue
      "#10b981", // Emerald
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <style jsx global>{`
        .markdown-content {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 768px) {
          .animate-fadeIn {
            padding-top: 1.5rem;
          }
        }
      `}</style>
      <div
        className="space-y-8 w-full animate-fadeIn"
        style={{
          width: "100%",
          marginTop: "2.5rem",
          marginBottom: "2.5rem",
          paddingTop: "1rem",
          overflowX: "hidden",
        }}
      >
        <div
          className="modern-card p-6 bg-white"
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            padding: "1.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            marginTop: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            className="flex items-center mb-4"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1.5rem",
              paddingTop: "0.5rem",
            }}
          >
            <div
              className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mr-3"
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "#ede9fe",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "0.75rem",
              }}
            >
              <SparklesIcon
                className="h-6 w-6 text-secondary-500"
                style={{ height: "1.5rem", width: "1.5rem", color: "#8b5cf6" }}
              />
            </div>
            <h2
              className="text-xl font-semibold text-neutral-800"
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              AI Explanation
            </h2>
          </div>

          {isLoading ? (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
              style={{
                position: "fixed",
                inset: "0",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "50",
              }}
            >
              <div
                className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl modern-card"
                style={{
                  margin: "2rem 1rem",
                  maxWidth: "90%",
                  width: "360px",
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  padding: "2rem",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Particle effects */}
                {particles.map((particle) => (
                  <div
                    key={particle.id}
                    style={{
                      position: "absolute",
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      backgroundColor: particle.color,
                      borderRadius: "50%",
                      opacity: 0.7,
                      filter: "blur(1px)",
                      boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                    }}
                  />
                ))}

                <div
                  className="relative z-10 flex flex-col items-center px-4"
                  style={{
                    position: "relative",
                    zIndex: "10",
                    padding: "1.5rem",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  {/* Animation step 1: Initial processing */}
                  {animationStep === 1 && (
                    <>
                      <div
                        className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center"
                        style={{
                          width: "5rem",
                          height: "5rem",
                          margin: "0 auto 1.5rem auto",
                          backgroundColor: "#ddd6fe",
                          borderRadius: "9999px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "4px solid transparent",
                          borderTopColor: "#8b5cf6",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                        Processing Text
                      </h3>
                      <p className="text-neutral-600 text-center mb-6">
                        Preparing your content for analysis...
                      </p>
                    </>
                  )}

                  {/* Animation step 2: OCR processing */}
                  {animationStep === 2 && (
                    <>
                      <div
                        className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center"
                        style={{
                          width: "6rem",
                          height: "6rem",
                          margin: "0 auto 1.5rem auto",
                          backgroundColor: "#e0e7ff",
                          borderRadius: "9999px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            inset: "0",
                            borderRadius: "9999px",
                            border: "4px solid transparent",
                            borderTopColor: "#6366f1",
                            animation: "spin 0.8s linear infinite",
                          }}
                        ></div>
                        <DocumentTextIcon
                          className="h-10 w-10 text-primary-500 animate-pulse"
                          style={{
                            height: "2.5rem",
                            width: "2.5rem",
                            color: "#6366f1",
                            animation: "pulse 2s infinite",
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                        Extracting Knowledge
                      </h3>
                      <p className="text-neutral-600 text-center mb-6">
                        Reading the content from your image...
                      </p>
                    </>
                  )}

                  {/* Animation step 3: AI analysis */}
                  {animationStep === 3 && (
                    <>
                      <div
                        className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center"
                        style={{
                          width: "7rem",
                          height: "7rem",
                          margin: "0 auto 1.5rem auto",
                          backgroundColor: "#ede9fe",
                          borderRadius: "9999px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            inset: "0",
                            borderRadius: "9999px",
                            border: "4px solid transparent",
                            borderRightColor: "#8b5cf6",
                            borderLeftColor: "#ec4899",
                            animation: "spin 0.6s linear infinite",
                          }}
                        ></div>
                        <SparklesIcon
                          className="h-12 w-12 text-accent-500 animate-bounce"
                          style={{
                            height: "3rem",
                            width: "3rem",
                            color: "#ec4899",
                            animation: "bounce 1s infinite",
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                        AI Analysis
                      </h3>
                      <p className="text-neutral-600 text-center mb-6">
                        Generating insights from the text...
                      </p>
                    </>
                  )}

                  {/* Animation step 4: Final flourish */}
                  {animationStep === 4 && (
                    <>
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{
                          width: "8rem",
                          height: "8rem",
                          margin: "0 auto 1.5rem auto",
                          borderRadius: "9999px",
                          backgroundImage:
                            "linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)",
                          animation: "pulse 1.5s infinite",
                          filter: "blur(8px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      ></div>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          marginTop: "-1rem",
                        }}
                      >
                        <SparklesIcon
                          className="h-16 w-16 text-white animate-ping"
                          style={{
                            height: "4rem",
                            width: "4rem",
                            color: "white",
                            animation:
                              "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                        Almost Ready
                      </h3>
                      <p className="text-neutral-600 text-center mb-6">
                        Preparing your insights...
                      </p>
                    </>
                  )}

                  {/* Progress bar */}
                  <div
                    className="w-full bg-neutral-200 rounded-full h-2.5 mb-3 progress-bar"
                    style={{
                      backgroundColor: "#e5e7eb",
                      width: "100%",
                      height: "0.625rem",
                      borderRadius: "9999px",
                      marginBottom: "0.75rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width:
                          animationStep === 1
                            ? "25%"
                            : animationStep === 2
                            ? "50%"
                            : animationStep === 3
                            ? "75%"
                            : animationStep === 4
                            ? "90%"
                            : "0%",
                        backgroundImage:
                          "linear-gradient(to right, #6366f1, #8b5cf6)",
                        height: "0.625rem",
                        borderRadius: "9999px",
                        transition: "width 0.5s ease-in-out",
                      }}
                    ></div>
                  </div>

                  <p className="text-xs text-neutral-500 font-medium">
                    {animationStep === 1
                      ? "Step 1/4"
                      : animationStep === 2
                      ? "Step 2/4"
                      : animationStep === 3
                      ? "Step 3/4"
                      : animationStep === 4
                      ? "Step 4/4"
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="prose max-w-none bg-gradient-to-br from-secondary-50 to-primary-50 p-6 rounded-xl markdown-content"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom right, #f5f3ff, #eef2ff)",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                overflowX: "hidden",
                overflowY: "auto",
                maxHeight: "80vh",
                paddingTop: "2rem",
              }}
            >
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          )}
        </div>

        <div
          className="flex justify-center pb-8 pt-4"
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "2rem",
            paddingTop: "1rem",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={onReset}
            className="flex items-center px-6 py-3 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm hover:shadow-md"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              backgroundColor: "white",
              borderWidth: "1px",
              borderColor: "#e5e7eb",
              color: "#374151",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
            }}
          >
            <ArrowUturnLeftIcon
              className="h-5 w-5 mr-2"
              style={{
                height: "1.25rem",
                width: "1.25rem",
                marginRight: "0.5rem",
              }}
            />
            Start Over
          </button>
        </div>
      </div>
    </>
  );
}
