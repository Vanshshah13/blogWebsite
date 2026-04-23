"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useAppData, user_service } from "@/context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";

const LoginPage = () => {
  const { isAuth, setIsAuth, loading, setLoading, setUser } = useAppData();

  if (isAuth) return redirect("/blogs");

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${user_service}/api/v1/login`, {
        code: authResult["code"],
      });

      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });

      toast.success(result.data.message);
      setIsAuth(true);
      setUser(result.data.user);
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen grid md:grid-cols-2 bg-black text-white">

          {/* LEFT SIDE - Branding / Info */}
          <div className="hidden md:flex flex-col justify-center px-12 
          bg-gradient-to-br from-black via-gray-900 to-black">

            <h1 className="text-4xl font-bold text-yellow-400 mb-6">
              The Reading Retreat
            </h1>

            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Discover insightful blogs, expand your knowledge, and immerse yourself
              in a world of thoughtful reading.
            </p>

            <ul className="space-y-3 text-gray-400">
              <li>📚 Curated articles & blogs</li>
              <li>⚡ Fast and seamless experience</li>
              <li>🔒 Secure authentication with Google</li>
            </ul>
          </div>

          {/* RIGHT SIDE - Login */}
          <div className="flex items-center justify-center px-4 py-12">

            <Card className="w-full max-w-md bg-black border border-yellow-500/20 
            shadow-[0_0_40px_rgba(250,204,21,0.15)] rounded-2xl">

              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold text-yellow-400">
                  Welcome Back
                </CardTitle>

                <CardDescription className="text-gray-300">
                  Login to continue your journey
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-5">

                <Button
                  onClick={googleLogin}
                  className="flex items-center justify-center gap-3 
                  bg-yellow-400 text-black hover:bg-yellow-300 
                  shadow-[0_0_15px_rgba(250,204,21,0.7)] transition-all duration-300"
                >
                  <img
                    src="/google.png"
                    className="w-5 h-5"
                    alt="google icon"
                  />
                  Continue with Google
                </Button>

                <p className="text-center text-xs text-gray-400">
                  Secure login powered by Google
                </p>

              </CardContent>
            </Card>

          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;