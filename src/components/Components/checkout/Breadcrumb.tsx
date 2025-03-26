"use client";

import { useRouter } from "next/navigation";

interface BreadcrumbProps {
  steps: string[];
  currentStep: number;
}

const Breadcrumb = ({ steps, currentStep }: BreadcrumbProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold 
              ${
                index + 1 === currentStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && <span className="text-gray-400">—</span>}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
