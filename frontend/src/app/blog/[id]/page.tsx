"use client";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  author_service,
  Blog,
  blog_service,
  useAppData,
  User,
} from "@/context/AppContext";
import axios from "axios";
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

interface Comment {
  id: string;
  userid: string;
  comment: string;
  create_at: string;
  username: string;
}

const BlogPage = () => {
  const { isAuth, user, fetchBlogs, savedBlogs, getSavedBlogs } = useAppData();
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
    if (savedBlogs?.some((b) => b.blogid === id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [savedBlogs, id]);

  async function fetchSingleBlog() {
    try {
      setLoading(true);
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
    } catch (error) {
      console.log(error);
    }
  }

  async function addComment() {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${blog_service}/api/v1/comment/${id}`,
        { comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(data.message);
      fetchComment();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }

const { deleteBlog } = useAppData();

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Blog */}
        <Card className="bg-black border border-yellow-500/20 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
          <CardHeader>
            <h1 className="text-3xl font-bold text-yellow-400">
              {blog.title}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-gray-400">

              <Link href={`/profile/${author?._id}`} className="flex items-center gap-2 hover:text-yellow-400">
                <img
                  src={author?.image}
                  className="w-8 h-8 rounded-full border border-yellow-500/30"
                />
                {author?.name}
              </Link>

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
                    <Edit />
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 />
                  </Button>
                </>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <img
              src={blog.image}
              className="w-full h-64 object-cover rounded-lg mb-4 border border-yellow-500/20"
            />

            <p className="text-gray-400 mb-4">{blog.description}</p>

            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
            />
          </CardContent>
        </Card>

        {/* Add Comment */}
        {isAuth && (
          <Card className="bg-black border border-yellow-500/20">
            <CardHeader>
              <h3 className="text-xl text-yellow-400">Leave a comment</h3>
            </CardHeader>

            <CardContent>
              <Input
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-black border border-yellow-500/20 text-gray-200 
                focus:border-yellow-400 focus:ring-0 mb-3"
              />

              <Button
                onClick={addComment}
                className="bg-yellow-400 text-black hover:bg-yellow-300"
              >
                {loading ? "Posting..." : "Post Comment"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        <Card className="bg-black border border-yellow-500/20">
          <CardHeader>
            <h3 className="text-lg text-yellow-400">Comments</h3>
          </CardHeader>

          <CardContent>
            {comments.length > 0 ? (
              comments.map((e) => (
                <div
                  key={e.id}
                  className="border-b border-yellow-500/10 py-3 flex justify-between items-start"
                >
                  <div>
                    <p className="flex items-center gap-2 text-yellow-400">
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
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-6">
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