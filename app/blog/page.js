// @flow strict
"use client";
import React, { useState, useEffect } from "react";
import { personalData } from "@/utils/data/personal-data";
import BlogCard from "../components/homepage/blog/blog-card";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

function Page() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async (page = 1, allBlogs = []) => {
      try {
        const res = await fetch(
          `https://dev.to/api/articles?username=${personalData.devUsername}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        const updatedBlogs = [...allBlogs, ...data];

        // Assuming the API returns an empty array when there are no more blogs to fetch
        if (data.length === 0 || data.length < 1000) {
          setBlogs(updatedBlogs);
          setIsLoading(false);
        } else {
          fetchBlogs(page + 1, updatedBlogs); // Fetch next page
        }
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return (
      <div>
        <ClimbingBoxLoader />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
            All Blog
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {blogs.map(
          (blog) => blog?.cover_image && <BlogCard blog={blog} key={blog.id} />
        )}
      </div>
    </div>
  );
}

export default Page;
