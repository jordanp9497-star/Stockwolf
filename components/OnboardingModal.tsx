"use client";

import { useState, useEffect, useRef } from "react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Stockwolf, c'est quoi ?",
    description: "Une idée simple : être toujours en avance sur l'information pour prendre de meilleures décisions d'investissement.",
  },
  {
    title: "Branché en temps réel",
    description: "Connecté à plusieurs sources boursières : actualités, signaux, et mises à jour utiles.",
  },
  {
    title: "IPO & nouveautés",
    description: "Suivi des IPO et des annonces importantes, avec des alertes et un résumé clair.",
  },
  {
    title: "Ton secteur, ton focus",
    description: "Choisis tes secteurs pour filtrer le bruit et gagner du temps.",
  },
];

const CONCLUSION = "Stockwolf te fait gagner du temps et de l'énergie : ne prends plus tes décisions à l'aveugle.";

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    // Focus trap: focus sur le bouton fermer ou le premier bouton
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      nextButtonRef.current?.focus();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      previousButtonRef.current?.focus();
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec bouton fermer */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="onboarding-title" className="text-lg font-semibold text-gray-900">
            {currentStepData.title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed mb-6">
            {currentStepData.description}
          </p>

          {isLastStep && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 italic leading-relaxed">
                {CONCLUSION}
              </p>
            </div>
          )}

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-8 mb-6">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-gray-900"
                    : index < currentStep
                    ? "bg-gray-400"
                    : "bg-gray-200"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Footer avec navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            ref={previousButtonRef}
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          <span className="text-sm text-gray-500">
            {currentStep + 1} / {STEPS.length}
          </span>

          {isLastStep ? (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Commencer
            </button>
          ) : (
            <button
              ref={nextButtonRef}
              onClick={handleNext}
              className="px-6 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
