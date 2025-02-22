"use client";

import React, { useEffect } from "react";
import { ArrowPathIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

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
  useEffect(() => {
    const analyzeText = async () => {
      if (!text || analysis) return;

      setIsLoading(true);
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
        setAnalysis(data.analysis);
      } catch (error) {
        console.error("Analysis Error:", error);
        setAnalysis("Failed to analyze the text. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    analyzeText();
  }, [text, analysis, setAnalysis, setIsLoading]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Extracted Text
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Analysis</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="prose max-w-none">
            {analysis.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button onClick={onReset} className="btn btn-outline gap-2">
          <ArrowUturnLeftIcon className="h-5 w-5" />
          Take Another Picture
        </button>
      </div>
    </div>
  );
}
