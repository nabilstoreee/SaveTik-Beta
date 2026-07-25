"use client";
import { Sparkles } from 'lucide-react';

export default function SkeletonLoader() {
  return (
    <div className="py-8 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="bg-white neo-border shadow-neo p-5 md:p-8 space-y-6 animate-pulse">
        
        {/* Pulsing indicator header */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-6 bg-[#ECEADF] neo-border-thin"></div>
          <div className="w-40 h-4 bg-[#ECEADF] neo-border-thin"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          
          {/* Left Column Thumbnail slot */}
          <div className="md:col-span-5 space-y-4">
            <div className="aspect-video bg-[#ECEADF] neo-border-thin flex items-center justify-center">
              <Sparkles size={24} className="text-gray-400 animate-spin" />
            </div>
            <div className="bg-[#ECEADF] neo-border-thin p-3 h-16"></div>
          </div>

          {/* Right Column details list slot */}
          <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-6 bg-[#ECEADF] neo-border-thin w-3/4"></div>
              <div className="h-4 bg-[#ECEADF] neo-border-thin w-1/4"></div>
              <div className="h-3 bg-[#ECEADF] neo-border-thin w-full"></div>
              <div className="h-3 bg-[#ECEADF] neo-border-thin w-5/6"></div>
            </div>

            {/* Pulsing Buttons list */}
            <div className="space-y-3.5 mt-6">
              <div className="h-12 bg-[#ECEADF] neo-border-thin w-full"></div>
              <div className="h-12 bg-[#ECEADF] neo-border-thin w-full"></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
