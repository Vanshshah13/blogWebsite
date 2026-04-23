"use client";

import React, { useEffect } from "react";
import { useAppData } from "@/context/AppContext";

const MyBlogsPage = () => {
  const { myBlogs, myBlogsLoading, fetchMyBlogs } = useAppData();

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  if (myBlogsLoading) return <p>Loading your blogs...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Blogs</h1>

      {myBlogs?.length === 0 && <p>No blogs created yet.</p>}

      <div className="grid gap-4">
        {myBlogs?.map((blog) => (
          <div
            key={blog.id}
            className="border p-4 rounded-lg shadow"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">
              {blog.title}
            </h2>
            <p className="text-gray-600">
              {blog.description}
            </p>
            <p className="text-sm mt-2">
              Category: {blog.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBlogsPage;