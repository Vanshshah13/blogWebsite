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
        <div className="bg-black min-h-screen flex items-center justify-center px-4 text-gray-300">
          
          <Card className="w-full max-w-md bg-black border border-yellow-500/20 shadow-[0_0_25px_rgba(250,204,21,0.15)]">
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-yellow-400">
                Welcome Back
              </CardTitle>

              <CardDescription className="text-white">
                Login to The Reading Retreat
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">

              <Button
                onClick={googleLogin}
                className="flex items-center justify-center gap-3 
                bg-yellow-400 text-black hover:bg-yellow-300 
                shadow-[0_0_10px_rgba(250,204,21,0.6)] transition"
              >
                <img
                  src="/google.png"
                  className="w-5 h-5"
                  alt="google icon"
                />
                Continue with Google
              </Button>

              <p className="text-center text-xs text-white">
                Secure login powered by Google
              </p>

            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LoginPage;