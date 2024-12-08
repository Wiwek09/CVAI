"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import DetailViewSkeleton from "@/components/ui/Skeleton/DetailViewSkeleton";
import axiosInstance from "@/utils/axiosConfig";

const CVDetailPage = ({ params }: { params: string }) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<boolean>(false);
  const { id }: any = params;
  const pdfUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cv/${id}.pdf`;

  useEffect(() => {
    fetchFullCV();
  }, []);

  const fetchFullCV = async () => {
    try {
      const response = await axiosInstance.get(`/document/cv/${id}`);
      // console.log("Detail-CV", response.data.parsed_cv);
      setData(response.data.parsed_cv);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Data", error);
      // setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100vh] space-x-4 w-full">
      <Card className="w-[70%] bg-gray-100">
        <div className="h-[100vh] ">
          {/* Embed PDF viewer */}
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: "none", borderRadius: "0.375rem" }}
          ></iframe>
        </div>
      </Card>

      {loading ? (
        <div className="w-[40%]">
          <DetailViewSkeleton />
        </div>
      ) : (
        <Card className="px-3 py-5  w-[40%] h-full bg-gray-100 flex flex-col gap-3">
          {/* First Part */}
          <div className="py-5 sticky top-0 bg-gray-100 z-10">
            <div className="flex justify-between w-[100%] items-start">
              <div className="flex flex-col w-max-[60%] flex-wrap pr-3 ">
                <h1 className="font-bold text-2xl">{data?.name}</h1>
                <p className="font-semibold">{data?.position}</p>
                <p className="flex gap-2 ">
                  <span>Linkedin:</span>
                  {data?.linkedin_url && (
                    <Link
                      href={
                        data?.linkedin_url.startsWith("http")
                          ? data?.linkedin_url
                          : `https://${data?.linkedin_url}`
                      }
                      target="_blank"
                    >
                      <span>{data?.linkedin_url}</span>
                    </Link>
                  )}
                </p>
                <p className="flex gap-2">
                  <span>Github:</span>
                  {data?.git_url && (
                    <Link
                      href={
                        data?.git_url.startsWith("http")
                          ? data?.git_url
                          : `https://${data?.git_url}`
                      }
                      target="_blank"
                    >
                      <span>{data?.git_url}</span>
                    </Link>
                  )}
                </p>

                <p className="flex gap-2 max-w-sm truncate">
                  <span>Website:</span>
                  {data?.website && (
                    <Link
                      href={
                        data?.website.startsWith("http")
                          ? data?.website
                          : `https://${data?.website}`
                      }
                      target="_blank"
                    >
                      <span>{data?.website}</span>
                    </Link>
                  )}
                </p>

                <p className="flex gap-2">
                  <span>Email:</span>
                  {data?.email && (
                    <Link href={`mailto:${data?.email}`} target="_blank">
                      <span>{data?.email}</span>
                    </Link>
                  )}
                </p>
              </div>

              <div className="flex w-max-[40%] flex-wrap flex-col gap-2 justify-end">
                {/* <div className="h-20 bg-white w-32 flex text-center justify-self-end self-end">
                <Image
                  className="bg-cover"
                  src={"/assets/qr.jpg"}
                  alt="QR Image"
                  height={200}
                  width={200}
                />
              </div> */}
                <div>
                  <div className="flex flex-wrap gap-1">
                    <span>Phone Number:</span>
                    <span className=" font-semibold">{data?.phone_number}</span>
                  </div>
                  <div className="flex flex-1 gap-1">
                    <span>Address:</span>
                    <span className="font-semibold">{data?.address}</span>
                  </div>
                  <div className="flex flex-1 gap-1">
                    <span>Rating:</span>
                    <span className="font-semibold">{data?.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <hr className="bg-slate-500 h-1 mt-3" />
          </div>

          {/* Second Part (Scrollable) */}
          <div className="flex-grow flex-col space-y-3 overflow-y-auto scrollbar-thin">
            {/* Experience */}
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-xl flex gap-4 ">
                Experiences
                <span>
                  {data?.years_of_experience
                    ? "(" + data?.years_of_experience + "years" + ")"
                    : ""}
                </span>
              </p>
              <div className="flex flex-col gap-3">
                {data?.work_experience.length > 0 &&
                  data?.work_experience.map((item: any, index: number) => (
                    <div key={index}>
                      <span className="font-semibold">
                        {index + 1 + ". " + item?.job_title}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-semibold">
                          {item?.company_name}
                        </span>
                        <span className="text-sm">
                          {"(" +
                            item?.start_date +
                            " - " +
                            item?.end_date +
                            ")"}
                        </span>
                      </span>
                      <span className="flex flex-col text-sm max-w-3xl ">
                        {item.responsibilities.length > 0 &&
                          item.responsibilities.map((el: any, idx: number) => (
                            <div className="flex gap-1" key={idx}>
                              <span className="mt-[1px]">
                                <GoDotFill />
                              </span>
                              <span>{el}</span>
                            </div>
                          ))}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <span className="flex flex-col gap-1 pb-2">
                <span className="font-semibold text-xl">Skills</span>
                <span className="flex flex-wrap gap-2 text-sm max-w-3xl">
                  {data?.skills?.length > 0 &&
                    data?.skills?.map((item: any, idx: number) => (
                      <div key={idx}>
                        <span className="flex shadow-md px-2 py-3 bg-[#f7f9fc] rounded-md w-fit font-semibold">
                          {item}
                        </span>
                      </div>
                    ))}
                </span>
              </span>
            </div>
            <div>
              <span className="flex flex-col gap-1">
                <span className="font-semibold text-xl">Projects</span>
                <span className="flex gap-2 flex-col">
                  {data?.technical_projects?.length > 0 &&
                    data?.technical_projects.map((data: any, index: number) => (
                      <div key={index}>
                        <p className="font-semibold">
                          {index + 1 + ". " + data.project_name}
                        </p>
                      </div>
                    ))}
                </span>
              </span>
            </div>
            {/* Education */}
            <div>
              <span className="flex flex-col gap-1">
                <span className="font-semibold text-xl">Education</span>
                <span className="flex gap-2 flex-col">
                  {data?.education?.length > 0 &&
                    data?.education.map((el: any, index: number) => (
                      <div key={index}>
                        <p className="font-semibold">
                          {index + 1 + ". " + el.degree}
                        </p>
                        <div className="flex gap-1 items-center">
                          <span>{el?.institution}</span>
                          <span className="text-sm">
                            {"(" + el?.start_date + " - " + el?.end_date + ")"}
                          </span>
                        </div>
                      </div>
                    ))}
                </span>
              </span>
            </div>

            {/* Certificate */}
            <div>
              {data?.certifications?.length > 0 && (
                <>
                  <p className="font-semibold text-xl">Certification</p>
                  {data.certifications.map((el: any, index: number) => (
                    <div className="flex flex-col" key={index}>
                      <p className="text-sm flex">
                        {index + 1 + ". " + el?.certification_name}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CVDetailPage;
