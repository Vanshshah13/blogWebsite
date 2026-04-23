"use client";
import SideBar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

interface BlogsProps {
  children: ReactNode;
}

const HomeLayout: React.FC<BlogsProps> = ({ children }) => {
  return (
    <div className="bg-black min-h-screen text-gray-300">
      <SidebarProvider>
        
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="w-full">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>

      </SidebarProvider>
    </div>
  );
};

export default HomeLayout;