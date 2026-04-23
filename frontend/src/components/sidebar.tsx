"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "./ui/sidebar";
import { Input } from "./ui/input";
import { blogCategories, useAppData } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const { searchQuery, setSearchQuery, setCategory, category } =
    useAppData();

  return (
    <Sidebar className="bg-black text-gray-300 border-r border-yellow-500/10">

      {/* Header */}
      <SidebarHeader className="bg-black text-yellow-400 text-xl font-bold px-4 py-5 border-b border-yellow-500/10">
        The Reading Retreat
      </SidebarHeader>

      <SidebarContent className="bg-black px-4 py-6">

        <SidebarGroup>
          {/* Search */}
          <SidebarGroupLabel className="text-gray-500 tracking-wide">
            SEARCH
          </SidebarGroupLabel>

          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="mt-2 bg-black text-gray-200 placeholder:text-gray-500 
           border border-yellow-500/20 
           focus:border-yellow-400 
           focus:outline-none 
           focus:ring-0 
           focus:shadow-[0_0_8px_rgba(250,204,21,0.6)]"
          />

          {/* Categories */}
          <SidebarGroupLabel className="text-gray-500 mt-6 tracking-wide">
            CATEGORIES
          </SidebarGroupLabel>

          <div className="flex flex-wrap gap-3 mt-3">

            {/* All */}
            <button
              onClick={() => setCategory("")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm border transition-all duration-200",
                category === ""
                  ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.7)]"
                  : "border-yellow-500/20 text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
              )}
            >
              All
            </button>

            {/* Categories */}
            {blogCategories?.map((e, i) => (
              <button
                key={i}
                onClick={() => setCategory(e)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm border transition-all duration-200",
                  category === e
                    ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.7)]"
                    : "border-yellow-500/20 text-gray-300 hover:border-yellow-400 hover:text-yellow-400 hover:shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;