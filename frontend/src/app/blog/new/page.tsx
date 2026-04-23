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
import { RefreshCw } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import axios from "axios";
import {
  author_service,
  blogCategories,
  useAppData,
} from "@/context/AppContext";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddBlog = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const { fetchBlogs } = useAppData();

  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const fromDataToSend = new FormData();

    fromDataToSend.append("title", formData.title);
    fromDataToSend.append("description", formData.description);
    fromDataToSend.append("blogcontent", formData.blogcontent);
    fromDataToSend.append("category", formData.category);

    if (formData.image) {
      fromDataToSend.append("file", formData.image);
    }

    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${author_service}/api/v1/blog/new`,
        fromDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: "",
      });
      setContent("");
      setTimeout(() => {
        fetchBlogs();
      }, 2000);
    } catch (error) {
      toast.error("Error while adding blog");
    } finally {
      setLoading(false);
    }
  };

  const [aiTitle, setAiTitle] = useState(false);
  const [aiDescripiton, setAiDescription] = useState(false);
  const [aiBlogLoading, setAiBlogLoading] = useState(false);

  const aiTitleResponse = async () => {
    try {
      setAiTitle(true);
      const { data } = await axios.post(`${author_service}/api/v1/ai/title`, {
        text: formData.title,
      });
      setFormData({ ...formData, title: data });
    } catch {
      toast.error("AI error");
    } finally {
      setAiTitle(false);
    }
  };

  const aiDescriptionResponse = async () => {
    try {
      setAiDescription(true);
      const { data } = await axios.post(
        `${author_service}/api/v1/ai/descripiton`,
        {
          title: formData.title,
          description: formData.description,
        }
      );
      setFormData({ ...formData, description: data });
    } catch {
      toast.error("AI error");
    } finally {
      setAiDescription(false);
    }
  };

  const aiBlogResponse = async () => {
    try {
      setAiBlogLoading(true);
      const { data } = await axios.post(`${author_service}/api/v1/ai/blog`, {
        blog: formData.blogcontent,
      });
      setContent(data.html);
      setFormData({ ...formData, blogcontent: data.html });
    } catch {
      toast.error("AI error");
    } finally {
      setAiBlogLoading(false);
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  );

  return (
    <div className="bg-black min-h-screen text-gray-300 flex justify-center items-center p-6">
      <Card className="w-full max-w-4xl bg-black border border-yellow-500/20 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
        
        <CardHeader>
          <h2 className="text-2xl font-bold text-yellow-400 tracking-wide">
            Add New Blog
          </h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <Label className="text-gray-400">Title</Label>
              <div className="flex gap-2 mt-1">
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
                {formData.title && (
                  <Button
                    type="button"
                    onClick={aiTitleResponse}
                    disabled={aiTitle}
                    className="bg-yellow-400 text-black hover:bg-yellow-300"
                  >
                    <RefreshCw className={aiTitle ? "animate-spin" : ""} />
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-gray-400">Description</Label>
              <div className="flex gap-2 mt-1">
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
                {formData.title && (
                  <Button
                    type="button"
                    onClick={aiDescriptionResponse}
                    disabled={aiDescripiton}
                    className="bg-yellow-400 text-black hover:bg-yellow-300"
                  >
                    <RefreshCw className={aiDescripiton ? "animate-spin" : ""} />
                  </Button>
                )}
              </div>
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
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-black text-gray-300 border border-yellow-500/20">
                  {blogCategories?.map((e, i) => (
                    <SelectItem key={i} value={e} className="hover:bg-yellow-400 hover:text-black">
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image */}
            <div>
              <Label className="text-gray-400">Image Upload</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-black border border-yellow-500/20 text-gray-300 file:text-yellow-400"
              />
            </div>

            {/* Editor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-gray-400">Blog Content</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={aiBlogResponse}
                  disabled={aiBlogLoading}
                  className="bg-yellow-400 text-black hover:bg-yellow-300"
                >
                  <RefreshCw
                    size={16}
                    className={aiBlogLoading ? "animate-spin" : ""}
                  />
                  <span className="ml-2">Fix Grammar</span>
                </Button>
              </div>

              <div className="border border-yellow-500/20 rounded-md overflow-hidden">
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
              {loading ? "Submitting..." : "Submit Blog"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;