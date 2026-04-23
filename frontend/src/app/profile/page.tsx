"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData, user_service } from "@/context/AppContext";
import React, { useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";

const ProfilePage = () => {
  const { user, setUser, logoutUser } = useAppData();

  if (!user) return redirect("/login");

  const logoutHandler = () => {
    logoutUser();
  };

  const InputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
  });

  const clickHandler = () => {
    InputRef.current?.click();
  };

  const changeHandler = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        setLoading(true);
        const token = Cookies.get("token");

        const { data } = await axios.post(
          `${user_service}/api/v1/user/update/pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(data.message);
        Cookies.set("token", data.token, {
          expires: 5,
          secure: true,
          path: "/",
        });

        setUser(data.user);
      } catch {
        toast.error("Image Update Failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${user_service}/api/v1/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);

      Cookies.set("token", data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });

      setUser(data.user);
      setOpen(false);
    } catch {
      toast.error("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center p-4 text-gray-300">
      {loading ? (
        <Loading />
      ) : (
        <Card className="w-full max-w-xl bg-black border border-yellow-500/20 shadow-[0_0_20px_rgba(250,204,21,0.1)] p-6 rounded-2xl">
          
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-yellow-400">
              Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center space-y-4">

            {/* Avatar */}
            <Avatar
              className="w-28 h-28 border-4 border-yellow-400/40 shadow-[0_0_12px_rgba(250,204,21,0.4)] cursor-pointer"
              onClick={clickHandler}
            >
              <AvatarImage src={user?.image} alt="profile pic" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={InputRef}
                onChange={changeHandler}
              />
            </Avatar>

            {/* Name */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">Name</p>
              <p className="text-lg text-white">{user?.name}</p>
            </div>

            {/* Bio */}
            {user?.bio && (
              <div className="text-center">
                <p className="text-yellow-500 text-sm">Bio</p>
                <p className="text-white">{user.bio}</p>
              </div>
            )}

            {/* Social Icons */}
            <div className="flex gap-5 mt-3">
              {user?.instagram && (
                <a href={user.instagram} target="_blank">
                  <Instagram className="text-yellow-400 hover:scale-110 transition" />
                </a>
              )}
              {user?.facebook && (
                <a href={user.facebook} target="_blank">
                  <Facebook className="text-yellow-400 hover:scale-110 transition" />
                </a>
              )}
              {user?.linkedin && (
                <a href={user.linkedin} target="_blank">
                  <Linkedin className="text-yellow-400 hover:scale-110 transition" />
                </a>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full justify-center">
              
              <Button
                onClick={logoutHandler}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>

              <Button
                onClick={() => router.push("/blog/new")}
                className="bg-yellow-400 text-black hover:bg-yellow-300"
              >
                Add Blog
              </Button>

              {/* Edit Dialog */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-yellow-400 text-black-400 hover:bg-yellow-400"
                  >
                    Edit
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-black border border-yellow-500/20 text-gray-300">
                  <DialogHeader>
                    <DialogTitle className="text-yellow-400">
                      Edit Profile
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3">

                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="bg-black border border-yellow-500/20 focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <Label>Bio</Label>
                      <Input
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        className="bg-black border border-yellow-500/20 focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <Label>Instagram</Label>
                      <Input
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagram: e.target.value,
                          })
                        }
                        className="bg-black border border-yellow-500/20 focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <Label>Facebook</Label>
                      <Input
                        value={formData.facebook}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            facebook: e.target.value,
                          })
                        }
                        className="bg-black border border-yellow-500/20 focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <Label>LinkedIn</Label>
                      <Input
                        value={formData.linkedin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            linkedin: e.target.value,
                          })
                        }
                        className="bg-black border border-yellow-500/20 focus:border-yellow-400"
                      />
                    </div>

                    <Button
                      onClick={handleFormSubmit}
                      className="w-full mt-4 bg-yellow-400 text-black hover:bg-yellow-300"
                    >
                      Save Changes
                    </Button>

                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;