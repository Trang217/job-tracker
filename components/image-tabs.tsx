"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
type ActiveButton = "organize" | "hired" | "boards";

export default function ImageTabs() {
  const [activeTab, setActiveTab] = useState<ActiveButton>("organize");

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8">
          <Button
            onClick={() => setActiveTab("organize")}
            className={`rounded-lg px-6 py-3 text-sm font-bold transition-colors ${activeTab === "organize" ? "bg-rose-400 text-amber-50" : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}
          >
            Organize Applications
          </Button>
          <Button
            onClick={() => setActiveTab("hired")}
            className={`rounded-lg px-6 py-3 text-sm font-bold transition-colors ${activeTab === "hired" ? "bg-rose-400 text-amber-50" : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}
          >
            Get Hired
          </Button>
          <Button
            onClick={() => setActiveTab("boards")}
            className={`rounded-lg px-6 py-3 text-sm font-bold transition-colors ${activeTab === "boards" ? "bg-rose-400 text-amber-50" : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}
          >
            Manage Boards
          </Button>
        </div>

        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
          {activeTab === "organize" && (
            <Image
              width={1200}
              height={800}
              src="/hero-images/hero1.png"
              alt="organize applications"
            />
          )}
          {activeTab === "hired" && (
            <Image
              width={1200}
              height={800}
              src="/hero-images/hero2.png"
              alt="get hired"
            />
          )}
          {activeTab === "boards" && (
            <Image
              width={1200}
              height={800}
              src="/hero-images/hero3.png"
              alt="manage boards"
            />
          )}
        </div>
      </div>
    </div>
  );
}
