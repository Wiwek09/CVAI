"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IFormInputData } from "@/interfaces/FormInputData";
import { IDocumentData } from "@/interfaces/DocumentData";
import Link from "next/link";
import axiosInstance from "@/utils/axiosConfig";
import GridViewSkeleton from "./ui/Skeleton/GridViewSkeleton";
import { IoCallOutline } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
// import ListViewSkeleton from "./ui/Skeleton/ListViewSkeleton";

interface GridViewProps {
  data: IDocumentData[];
  searchData: IFormInputData | null;
}

function GridView({ data, searchData }: GridViewProps) {
  const [imageDataID, setImageDataID] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredId, setHoveredId] = useState<any | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [hoveredUser, setHoveredUser] = useState<any>(null);

  useEffect(() => {
    if (!searchData) {
      setLoading(false);
      setIsSearching(false);
    }
  }, [data, searchData]);

  // Handle search data and view changes
  useEffect(() => {
    if (searchData) {
      setLoading(true);
      setIsSearching(true);
      fetchSearchResults(searchData);
    }
  }, [searchData]);

  useEffect(() => {
    const getHoveredDetails = async () => {
      const response = await axiosInstance.get(`/document/cv/${hoveredId}`);
      setHoveredUser(response.data.parsed_cv);
    };
    if (hoveredId) {
      getHoveredDetails();
    }
  }, [hoveredId]);

  const fetchSearchResults = async (searchData: IFormInputData) => {
    try {
      const response = await axiosInstance.post(
        `/document/search_by_query`,
        searchData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setImageDataID(response.data || []);
        setLoading(true);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Erro Fetching", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseOver = (id: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      setHoveredId(id);
    }, 800);

    setTimeoutId(newTimeoutId);
  };
  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setHoveredId(null);
      setHoveredUser([]);
    }
    setHoveredUser([]);
    setHoveredId(null);
  };

  return (
    <div className="masonry-container overflow-clip max-w-[100vw]">
      {hoveredId && (
        <div
          className="fixed inset-0 bg-black opacity-80 z-10"
          style={{ filter: "brightness(0)", pointerEvents: "none" }}
        ></div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid-cols-3">
          <GridViewSkeleton />
          <GridViewSkeleton />
          <GridViewSkeleton />
        </div>
      ) : isSearching ? (
        /* Search Results */
        imageDataID.length > 0 ? (
          imageDataID.map((item, index) => (
            <div
              key={item.doc_id}
              className={`mb-6 cursor-pointer transition-transform duration-300 relative ${
                hoveredId === item.doc_id ? "z-20" : "z-0"
              }`}
              onMouseOver={() => handleMouseOver(item.doc_id)}
              onMouseLeave={handleMouseLeave}
            >
              <Link href={`/cv-detail/${item.doc_id}`} target="_blank">
                {/* Hover Data */}
                {hoveredId === item.doc_id && (
                  <div
                    className={`absolute flex rounded-md pl-9 pr-9 py-2 flex-col bg-white w-full h-full z-50 transition-opacity duration-500 ease-in-out ${
                      hoveredUser && Object?.keys(hoveredUser)?.length > 0
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                    }`}
                  >
                    {hoveredUser && Object.keys(hoveredUser).length > 0 && (
                      <div className="flex flex-col gap-1">
                        <h1 className="font-bold text-xl pt-5">
                          {hoveredUser?.name?.toUpperCase()}
                        </h1>
                        {hoveredUser?.position && (
                          <h2 className="font-semibold text-md underline mb-2 ">
                            {hoveredUser?.position.toUpperCase()}
                          </h2>
                        )}
                        <div className="mt-2 flex flex-col space-y-5">
                          <section className="flex space-x-4 items-center">
                            <button className="bg-gray-600 p-[4px] rounded-full">
                              <IoCallOutline color="white" />
                            </button>
                            <h1>{hoveredUser?.phone_number}</h1>
                          </section>

                          <section className="flex items-center">
                            {hoveredUser?.linkedin_url ? (
                              <div className="flex space-x-4 truncate">
                                <button className="bg-gray-600 p-[4px] rounded-full">
                                  <CiLinkedin color="white" />
                                </button>
                                <a
                                  onClick={(e) => e.stopPropagation()}
                                  href={hoveredUser.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  <h1>{hoveredUser.linkedin_url}</h1>
                                </a>
                              </div>
                            ) : hoveredUser?.git_url ? (
                              <div className="truncate">
                                <a
                                  onClick={(e) => e.stopPropagation()}
                                  href={hoveredUser.git_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 flex space-x-4 hover:underline"
                                >
                                  <button className="bg-gray-600 p-[4px] rounded-full">
                                    <FaGithub color="white" />
                                  </button>
                                  <h1>{hoveredUser.git_url}</h1>
                                </a>
                              </div>
                            ) : null}
                          </section>

                          <section>
                            <h1 className="text-lg font-semibold">
                              Experience
                            </h1>
                            {hoveredUser?.work_experience?.length > 0 && (
                              <div key={index} className="flex flex-col">
                                <h2 className="text-gray-600 font-semibold text-[16px] ml-3">
                                  {hoveredUser.work_experience[0].job_title}
                                </h2>
                                <h3 className="text-gray-600 ml-3">
                                  {hoveredUser?.work_experience[0].company_name}
                                </h3>
                                {hoveredUser?.work_experience[0].start_date && (
                                  <span className="text-gray-600 ml-3">
                                    {hoveredUser?.work_experience[0]
                                      .start_date +
                                      "-" +
                                      hoveredUser?.work_experience[0].end_date}
                                  </span>
                                )}
                              </div>
                            )}
                          </section>

                          <section>
                            <h1 className="text-lg font-semibold">Skills</h1>
                            {hoveredUser.skills
                              ?.slice(0, 3)
                              .map((skill, index) => (
                                <h3 key={index} className="text-gray-600 ml-3">
                                  {skill}
                                </h3>
                              ))}
                          </section>

                          {/* <section>
                              <h1 className="text-lg font-semibold">
                                Education
                              </h1>
                              {hoveredUser.education
                                ?.slice(0, 3)
                                .map((ed, index) => (
                                  <h3
                                    key={index}
                                    className="text-gray-600 ml-3"
                                  >
                                    {ed.degree}
                                  </h3>
                                ))}
                            </section> */}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Image */}
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/cv_images/${item.img_id}.webp`}
                  alt={`Image ${index + 1}`}
                  height={500}
                  width={700}
                  className="rounded-lg object-cover shadow-lg w-full h-auto"
                  loading="lazy"
                  layout="responsive"
                  onError={(error) => {
                    console.error("Image failed to load", error);
                  }}
                />
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 mt-4">
            No Data Available...
          </div>
        )
      ) : data?.length > 0 ? (
        /* Initial Data */
        data.map((item, index) => (
          <div
            key={item.doc_id}
            className={`mb-6 cursor-pointer transition-transform duration-300 relative ${
              hoveredId === item.doc_id ? "z-20" : "z-0"
            }`}
            onMouseOver={() => handleMouseOver(item.doc_id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link href={`/cv-detail/${item.doc_id}`} target="_blank">
              {/* Hover Data */}
              {hoveredId === item.doc_id && (
                <div
                  className={`absolute flex rounded-md pl-9 pr-9 py-2 flex-col bg-white w-full h-full z-50 transition-opacity duration-500 ease-in-out ${
                    hoveredUser && Object?.keys(hoveredUser)?.length > 0
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                >
                  {
                    hoveredUser && Object?.keys(hoveredUser)?.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <h1 className="font-bold text-xl pt-5">
                          {hoveredUser.name?.toUpperCase()}
                        </h1>
                        {hoveredUser?.position && (
                          <h2 className="font-semibold text-md underline mb-2">
                            {hoveredUser?.position.toUpperCase()}
                          </h2>
                        )}
                        <div className="mt-2 flex flex-col space-y-5 ">
                          <section className="flex space-x-4 items-center">
                            <div className="bg-gray-600 p-[4px] rounded-full">
                              <IoCallOutline color="white" />
                            </div>
                            <h1>{hoveredUser?.phone_number}</h1>
                          </section>

                          <section className="flex items-center">
                            {hoveredUser?.linkedin_url ? (
                              <div className="flex space-x-4 truncate">
                                <button className="bg-gray-600 p-[4px] rounded-full">
                                  <CiLinkedin color="white" />
                                </button>
                                <a
                                  onClick={(e) => e.stopPropagation()}
                                  href={hoveredUser.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  <h1>{hoveredUser.linkedin_url}</h1>
                                </a>
                              </div>
                            ) : hoveredUser?.git_url ? (
                              <div className="truncate">
                                <a
                                  onClick={(e) => e.stopPropagation()}
                                  href={hoveredUser.git_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 flex space-x-4 hover:underline"
                                >
                                  <button className="bg-gray-600 p-[4px] rounded-full">
                                    <FaGithub color="white" />
                                  </button>
                                  <h1>{hoveredUser.git_url}</h1>
                                </a>
                              </div>
                            ) : null}
                          </section>

                          <section>
                            <h1 className="text-lg font-semibold">
                              Experience
                            </h1>
                            {hoveredUser?.work_experience?.length > 0 && (
                              <div key={index} className="flex flex-col">
                                <h2 className="text-gray-900 font-semibold text-[16px] ml-3">
                                  {hoveredUser?.work_experience[0].job_title}
                                </h2>
                                <h3 className="text-gray-600 ml-3">
                                  {hoveredUser?.work_experience[0].company_name}
                                </h3>
                                {hoveredUser?.work_experience[0].start_date && (
                                  <span className="text-gray-600 ml-3">
                                    {hoveredUser?.work_experience[0]
                                      .start_date +
                                      "-" +
                                      hoveredUser?.work_experience[0].end_date}
                                  </span>
                                )}
                              </div>
                            )}
                          </section>

                          <section>
                            <h1 className="text-lg font-semibold">Skills</h1>
                            {hoveredUser.skills
                              ?.slice(0, 3)
                              .map((skill, index) => (
                                <h3 key={index} className="text-gray-600 ml-3">
                                  {skill}
                                </h3>
                              ))}
                          </section>

                          {/* <section>
                          <h1 className="text-lg font-semibold">Education</h1>
                          {hoveredUser.education
                            ?.slice(0, 3)
                            .map((ed, index) => (
                              <h3 key={index} className="text-gray-600 ml-3">
                                {ed.degree}
                              </h3>
                            ))}
                        </section> */}
                        </div>
                      </div>
                    )
                    // : (
                    //   <ListViewSkeleton variant="hover" />
                    // )
                  }
                </div>
              )}
              {/* Image */}
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/cv_images/${item.image_id}.webp`}
                alt={`Image ${index + 1}`}
                height={500}
                width={700}
                className="rounded-lg object-cover shadow-lg w-full h-auto"
                loading="lazy"
                layout="responsive"
                onError={(error) => {
                  console.error("Image faile to load", error);
                }}
              />
            </Link>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600 mt-4">
          No Data Available...
        </div>
      )}
    </div>
  );
}

export default GridView;
