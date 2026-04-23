"use client";
import BlogCard from "@/components/BlogCard";
import Loading from "@/components/loading";
import { useAppData } from "@/context/AppContext";
import React from "react";

const SavedBlogs = () => {
  const { blogs, savedBlogs } = useAppData();

  if (!blogs || !savedBlogs) {
    return <Loading />;
  }

  const filteredBlogs = blogs.filter((blog) =>
    savedBlogs.some((saved) => saved.blogid === blog.id.toString())
  );

  return (
    <div className="bg-black min-h-screen text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 tracking-wide">
          Saved Blogs
        </h1>

        {/* Content */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredBlogs.map((e, i) => (
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
        ) : (
          <p className="text-center text-gray-500 mt-20 text-lg">
            No saved blogs yet 📭
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedBlogs