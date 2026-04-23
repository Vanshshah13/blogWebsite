"use client";
import BlogCard from "@/components/BlogCard";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useAppData } from "@/context/AppContext";
import { Filter } from "lucide-react";
import React from "react";

const Blogs = () => {
  const { toggleSidebar } = useSidebar();
  const { loading, blogLoading, blogs } = useAppData();

  return (
    <div className="bg-black min-h-screen text-gray-300">
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-6">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            
            <h1 className="text-3xl font-bold text-yellow-400 tracking-wide">
              Latest Blogs
            </h1>

            <Button
              onClick={toggleSidebar}
              className="flex items-center gap-2 px-4 
                         bg-yellow-400 text-black 
                         hover:bg-yellow-300 
                         shadow-[0_0_10px_rgba(250,204,21,0.6)] 
                         transition"
            >
              <Filter size={18} />
              <span>Filter</span>
            </Button>
          </div>

          {/* Content */}
          {blogLoading ? (
            <Loading />
          ) : (
            <>
              {blogs?.length === 0 ? (
                <p className="text-center text-white-500 mt-20 text-xl">
                  No blogs found 
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {blogs?.map((e, i) => (
                    <BlogCard
                      key={i}
                      image={e.image}
                      title={e.title}
                      desc={e.description}
                      id={e.id}
                      time={e.created_at}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Blogs;