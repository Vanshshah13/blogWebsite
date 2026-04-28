"use client";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppData, Blog, User, blog_service } from "@/context/AppContext";

interface Comment {
  id: string;
  userid: string;
  comment: string;
  create_at: string;
  username: string;
}

const BlogPage = () => {
  const { isAuth, user, savedBlogs, getSavedBlogs, deleteBlog } = useAppData();
  const router = useRouter();
  const { id } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSingleBlog();
    fetchComment();
  }, [id]);

  useEffect(() => {
    setSaved(savedBlogs?.some((b) => b.blogid === id));
  }, [savedBlogs, id]);

  async function fetchSingleBlog() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${blog_service}/api/v1/blog/${id}`);
      setBlog(data.blog);
      setAuthor(data.author);
    } finally {
      setLoading(false);
    }
  }

  async function fetchComment() {
    try {
      const { data } = await axios.get(`${blog_service}/api/v1/comment/${id}`);
      setComments(data);
    } catch {}
  }

  async function addComment() {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${blog_service}/api/v1/comment/${id}`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message);
      setComment("");
      fetchComment();
    } catch {
      toast.error("Error adding comment");
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment(id: string) {
    if (!confirm("Delete this comment?")) return;

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.delete(
        `${blog_service}/api/v1/comment/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message);
      fetchComment();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this blog?")) return;
    await deleteBlog(id as string);
    router.push("/blogs");
  }

  async function saveBlog() {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${blog_service}/api/v1/save/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message);
      setSaved(!saved);
      getSavedBlogs();
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  }

  if (!blog) return <Loading />;

  return (
    <div className="bg-black min-h-screen text-gray-300">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* BLOG CARD */}
        <Card className="bg-gradient-to-b from-black to-zinc-900 border border-yellow-500/20 shadow-xl rounded-2xl overflow-hidden">

          <CardHeader className="space-y-4">

            {/* Title */}
            <h1 className="text-4xl font-extrabold text-yellow-400 leading-tight">
              {blog.title}
            </h1>

            {/* Author Row */}
            <div className="flex items-center justify-between flex-wrap gap-3">

              <Link
                href={`/profile/${author?._id}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={author?.image}
                  className="w-10 h-10 rounded-full border-2 border-yellow-400 group-hover:scale-105 transition"
                />
                <span className="text-gray-300 group-hover:text-yellow-400 transition">
                  {author?.name}
                </span>
              </Link>

              <div className="flex items-center gap-2">

                {isAuth && (
                  <Button
                    variant="ghost"
                    onClick={saveBlog}
                    className="text-yellow-400 hover:bg-yellow-400/10"
                  >
                    {saved ? <BookmarkCheck /> : <Bookmark />}
                  </Button>
                )}

                {blog.author === user?._id && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/blog/edit/${id}`)}
                      className="bg-yellow-400 text-black hover:bg-yellow-300"
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>

            {/* Image */}
            <img
              src={blog.image}
              className="w-full h-72 object-cover rounded-xl mb-6 border border-yellow-500/20"
            />

            {/* Description */}
            <h2 className="text-gray-400 text-lg mb-6 leading-relaxed">
              {blog.description}
            </h2>

            {/* Blog Content */}
            <div
              className="prose prose-invert max-w-none text-white prose-headings:text-yellow-400 prose-strong:text-yellow-300"
              dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
            />
          </CardContent>
        </Card>

        {/* COMMENT INPUT */}
        {isAuth && (
          <Card className="bg-zinc-900 border border-yellow-500/20 rounded-xl">
            <CardHeader>
              <h3 className="text-xl text-yellow-400 font-semibold">
                Leave a Comment
              </h3>
            </CardHeader>

            <CardContent className="space-y-3">
              <Input
                placeholder="Write something meaningful..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-black border border-yellow-500/20 text-gray-200 focus:border-yellow-400"
              />

              <Button
                onClick={addComment}
                className="bg-yellow-400 text-black hover:bg-yellow-300 w-full"
              >
                {loading ? "Posting..." : "Post Comment"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* COMMENTS */}
        <Card className="bg-zinc-900 border border-yellow-500/20 rounded-xl">
          <CardHeader>
            <h3 className="text-lg text-yellow-400 font-semibold">
              Comments ({comments.length})
            </h3>
          </CardHeader>

          <CardContent className="space-y-4">

            {comments.length > 0 ? (
              comments.map((e) => (
                <div
                  key={e.id}
                  className="p-4 rounded-lg bg-black border border-yellow-500/10 hover:border-yellow-400/30 transition flex justify-between"
                >
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-yellow-400 text-sm">
                      <User2 size={16} />
                      {e.username}
                    </p>

                    <p className="text-gray-300">{e.comment}</p>

                    <p className="text-xs text-gray-500">
                      {new Date(e.create_at).toLocaleString()}
                    </p>
                  </div>

                  {e.userid === user?._id && (
                    <Button
                      size="sm"
                      onClick={() => deleteComment(e.id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                No comments yet 💬
              </p>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default BlogPage;