import Link from "next/link";
import React from "react";
import { Card } from "./ui/card";
import { Calendar } from "lucide-react";
import moment from "moment";

interface BlogCardProps {
  image: string;
  title: string;
  desc: string;
  id: string;
  time: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  image,
  title,
  desc,
  id,
  time,
}) => {
  return (
    <Link href={`/blog/${id}`}>
      <Card className="bg-zinc-900  text-gray-300 overflow-hidden rounded-lg border border-zinc-800 transition duration-300 hover:shadow-xl  hover:border-yellow-500 hover:shadow-[0_0_10px_rgba(250,204,21,0.6)]">
        <div className="w-full h-[200px]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="p-0">
          <div>
            <p className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>{moment(time).format("DD-MM-YYYY")}</span>
            </p>
            <h2 className="text-lg font-semibold mt-1 line-clamp-1 text-center">
              {title} 
            </h2>
            <p className="text-center">{desc.slice(0, 30)}...</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
