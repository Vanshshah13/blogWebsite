"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import axios from "axios";
import {
  author_service,
  blog_service,
  blogCategories,
  useAppData,
} from "@/context/AppContext";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditBlogPage = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const { fetchBlogs } = useAppData();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${blog_service}/api/v1/blog/${id}`);
        const blog = data.blog;

        setFormData({
          title: blog.title,
          description: blog.description,
          category: blog.category,
          image: null,
          blogcontent: blog.blogcontent,
        });

        setContent(blog.blogcontent);
        setExistingImage(blog.image);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("blogcontent", formData.blogcontent);
    formDataToSend.append("category", formData.category);

    if (formData.image) {
      formDataToSend.append("file", formData.image);
    }

    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${author_service}/api/v1/blog/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      fetchBlogs();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center p-6 text-gray-300">
      <Card className="w-full max-w-4xl bg-black border border-yellow-500/20 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
        
        <CardHeader>
          <h2 className="text-2xl font-bold text-yellow-400 tracking-wide">
            Edit Blog
          </h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <Label className="text-gray-400">Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
                className="bg-black border border-yellow-500/20 text-gray-200 
                focus:border-yellow-400 focus:outline-none focus:ring-0 
                focus:shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-gray-400">Description</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter blog description"
                className="bg-black border border-yellow-500/20 text-gray-200 
                focus:border-yellow-400 focus:outline-none focus:ring-0 
                focus:shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-gray-400">Category</Label>
              <Select
                onValueChange={(value: any) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-black border border-yellow-500/20 text-gray-200 focus:border-yellow-400">
                  <SelectValue placeholder={formData.category || "Select category"} />
                </SelectTrigger>
                <SelectContent className="bg-black text-gray-300 border border-yellow-500/20">
                  {blogCategories?.map((e, i) => (
                    <SelectItem
                      key={i}
                      value={e}
                      className="hover:bg-yellow-400 hover:text-black"
                    >
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image */}
            <div>
              <Label className="text-gray-400">Image Upload</Label>

              {existingImage && !formData.image && (
                <img
                  src={existingImage}
                  className="w-40 h-40 object-cover rounded mb-2 border border-yellow-500/20"
                  alt=""
                />
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-black border border-yellow-500/20 text-gray-300 file:text-yellow-400"
              />
            </div>

            {/* Editor */}
            <div>
              <Label className="text-gray-400">Blog Content</Label>

              <div className="border border-yellow-500/20 rounded-md overflow-hidden mt-2">
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => {
                    setContent(newContent);
                    setFormData({ ...formData, blogcontent: newContent });
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-yellow-400 text-black hover:bg-yellow-300 
              shadow-[0_0_10px_rgba(250,204,21,0.6)]"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Blog"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlogPage;