"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { CircleUserRoundIcon, LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, isAuth } = useAppData();

  return (
    <nav className="bg-black border-b border-yellow-500/20 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">

        {/* Logo */}
        <Link
          href={"/blogs"}
          className="text-xl font-bold text-yellow-400 tracking-wide hover:text-yellow-300 transition"
        >
          The Reading Retreat
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant={"ghost"}
            onClick={() => setIsOpen(!isOpen)}
            className="text-yellow-400 hover:bg-yellow-400/10"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 text-gray-300">
          <li>
            <Link
              href={"/blogs"}
              className="hover:text-yellow-400 transition"
            >
              Home
            </Link>
          </li>

          {isAuth && (
            <li>
              <Link
                href={"/blog/new"}
                className="hover:text-yellow-400 transition"
              >
                Add Blog
              </Link>
            </li>
          )}

          {isAuth && (
            <li>
              <Link
                href={"/my-blogs"}
                className="hover:text-yellow-400 transition"
              >
                My Blogs
              </Link>
            </li>
          )}

          {isAuth && (
            <li>
              <Link
                href={"/blog/saved"}
                className="hover:text-yellow-400 transition"
              >
                Saved Blogs
              </Link>
            </li>
          )}

          {!loading && (
            <li>
              {isAuth ? (
                <Link
                  href={"/profile"}
                  className="text-yellow-400 hover:text-yellow-300 transition"
                >
                  <CircleUserRoundIcon />
                </Link>
              ) : (
                <Link
                  href={"/login"}
                  className="text-yellow-400 hover:text-yellow-300 transition"
                >
                  <LogIn />
                </Link>
              )}
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col items-center space-y-5 py-6 bg-black border-t border-yellow-500/10 text-gray-300">

          <li>
            <Link
              href={"/blogs"}
              className="hover:text-yellow-400 transition text-lg"
            >
              Home
            </Link>
          </li>

          {isAuth && (
            <li>
              <Link
                href={"/blog/new"}
                className="hover:text-yellow-400 transition text-lg"
              >
                Add Blog
              </Link>
            </li>
          )}

          {isAuth && (
            <li>
              <Link
                href={"/my-blogs"}
                className="hover:text-yellow-400 transition text-lg"
              >
                My Blogs
              </Link>
            </li>
          )}

          {isAuth && (
            <li>
              <Link
                href={"/blog/saved"}
                className="hover:text-yellow-400 transition text-lg"
              >
                Saved Blogs
              </Link>
            </li>
          )}

          {!loading && (
            <li>
              {isAuth ? (
                <Link
                  href={"/profile"}
                  className="text-yellow-400 hover:text-yellow-300 transition"
                >
                  <CircleUserRoundIcon size={28} />
                </Link>
              ) : (
                <Link
                  href={"/login"}
                  className="text-yellow-400 hover:text-yellow-300 transition"
                >
                  <LogIn size={28} />
                </Link>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;