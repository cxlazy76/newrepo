"use client";

import { useRouter } from "next/navigation";

export default function StepIndicator({ step }: { step: 1 | 2 }) {
  const router = useRouter();

  return (
    <div className="flex justify-center w-full py-8 px-4 sm:px-6 max-w-7xl">
      {/* Container keeps the wider width so text fits on one line */}
      <div className="flex w-full max-w-2xl bg-gray-50 rounded-full p-1.5 border border-gray-100 shadow-sm">
        
        {/* Step 1 */}
        <button
          onClick={() => router.push("/characters")}
          className={`flex-1 px-4 py-3 rounded-full text-xs md:text-sm text-center transition-colors cursor-pointer whitespace-nowrap
            ${
              step === 1
                // UPDATED: Changed from yellow back to white active state
                ? "font-bold bg-white shadow-sm text-black border border-gray-200"
                : "font-medium text-gray-500 hover:text-gray-900"
            }
          `}
        >
          Step 1 : Pick a Character
        </button>

        {/* Step 2 */}
        <button
          className={`flex-1 px-4 py-3 rounded-full text-xs md:text-sm text-center transition-colors whitespace-nowrap
            ${
              step === 2
                 // UPDATED: Changed from yellow back to white active state
                ? "font-bold bg-white shadow-sm text-black border border-gray-200"
                : "font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
            }
          `}
        >
          Step 2 : Generate a video
        </button>
      </div>
    </div>
  );
}