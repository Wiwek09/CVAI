"use client";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { FaUser, FaPhoneAlt, FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import { IDocumentData } from "@/interfaces/DocumentData";
import axiosInstance from "@/utils/axiosConfig";
import Link from "next/link";
import { IFormInputData } from "@/interfaces/FormInputData";
import ListViewSkeletion from "./ui/Skeleton/ListViewSkeleton";
import { folderSelectStore } from "@/app/dashboard/store";
import { useSearchContext } from "@/app/dashboard/context/SearchContext";

interface ListViewProps {
  data: IDocumentData[] | any;
  searchData: IFormInputData | null;
}

const ListView = ({ data, searchData }: ListViewProps) => {
  const [allData, setAllData] = useState<any>([]);
  const [searchResultsListView, setSearchResultsListView] = useState<any>([]);
  const [folderFilteredData, setFolderFilteredData] = useState<any>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const { resetSearch } = useSearchContext();
  const { selectFolderId } = folderSelectStore();
  useEffect(() => {
    if (data.length >= 0) {
      fetchAllData();
    }
  }, [data]);

  useEffect(() => {
    if (searchData) {
      fetchSearchData(searchData);
      setIsSearching(true);
    } else {
      resetSearch();
    }
  }, [searchData]);

  useEffect(() => {
    if (selectFolderId && searchData) {
      fetchSearchData(searchData);
      setIsSearching(false);
    }
  }, [selectFolderId, searchData]);

  useEffect(() => {
    if (selectFolderId) {
      fetchFolderFiles();
    } else {
      setFolderFilteredData([]);
    }
  }, [selectFolderId, allData]);

  const fetchAllData = async () => {
    const fetchedData: any[] = [];
    setLoading(true);

    const cachedData = sessionStorage.getItem("allData");
    if (cachedData) {
      setAllData(JSON.parse(cachedData));
      setLoading(false);
    } else {
      try {
        if (data.length > 0) {
          for (const item of data) {
            try {
              const response = await axiosInstance.get(
                `/document/cv/${item.doc_id}`
              );
              if (response.status === 200) {
                fetchedData.push(response.data);
              }
            } catch (error) {
              console.error("Error fetching document:", error);
              break;
            }
          }
          sessionStorage.setItem("allData", JSON.stringify(fetchedData));
          setAllData(fetchedData);
        }
      } catch (error) {
        console.error("General error in fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchFolderFiles = async () => {
    if (!selectFolderId) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/folder/getFiles/${selectFolderId}`
      );

      if (response.status === 200) {
        const folderDocIds = response.data;
        const docIds = folderDocIds.map((folder) => folder.doc_id);
        const cachedData = JSON.parse(sessionStorage.getItem("allData"));

        // Filter data based on folder doc_id

        const filteredData = cachedData?.filter((item: any) =>
          docIds.includes(item._id)
        );
        setLoading(true);
        await setFolderFilteredData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching folder files:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchData = async (searchData: IFormInputData) => {
    try {
      setLoading(true);
      // Fetch search IDs based on the query
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
        const searchIds = response.data.map((item) => item.doc_id); // Extract IDs from the response
        const cachedData = sessionStorage.getItem("allData");

        if (cachedData) {
          const allData = JSON.parse(cachedData);
          const results = allData.filter((doc: any) =>
            searchIds.includes(doc._id)
          );
          setSearchResultsListView(results);

          // Cache the filtered results for this specific query
          sessionStorage.setItem("searchData", JSON.stringify(results));
        } else {
          // If no cached data is available, fetch each document by ID
          const fetchedData = [];
          for (const docId of searchIds) {
            try {
              const searchResponse = await axiosInstance.get(
                `/document/cv/${docId}`
              );
              if (searchResponse.status === 200) {
                fetchedData.push(searchResponse.data);
              }
            } catch (error) {
              console.error(`Error fetching document with ID ${docId}:`, error);
              break;
            }
          }

          // Update state with the fetched data and cache it
          setSearchResultsListView(fetchedData);
          sessionStorage.setItem("searchData", JSON.stringify(fetchedData));
        }
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  // For Opening the email,linkedin, website link :
  const handleEmailCLick = (event, email) => {
    event.stopPropagation();
    window.open(`mailto:${email}`, "_blank");
  };

  const handleLinkedin = (event, linkedinUrl) => {
    event.stopPropagation();
    const newLinkedinUrl = linkedinUrl.startsWith("http")
      ? linkedinUrl
      : `https://${linkedinUrl}`;
    window.open(newLinkedinUrl, "_blank");
  };

  const displayedData =
    selectFolderId && searchData
      ? searchResultsListView
      : selectFolderId
      ? folderFilteredData
      : isSearching
      ? searchResultsListView
      : allData;

  // const displayedData =
  //   searchData && selectFolderId
  //     ? searchResults
  //     : selectFolderId
  //     ? folderFilteredData
  //     : allData;

  return (
    <div className="flex flex-col max-w-[100vw] px-4 py-4 overflow-clip rounded-md space-y-5">
      {loading ? (
        <div className="flex flex-col gap-3">
          <ListViewSkeletion variant="listView" />
          <ListViewSkeletion variant="listView" />
        </div>
      ) : displayedData?.length === 0 ? (
        <p>No Document Available</p>
      ) : (
        displayedData?.map((item: any, index: number) => (
          <Link
            legacyBehavior={false}
            key={item._id}
            href={`/cv-detail/${item._id}`}
            target="_blank"
          >
            <Card
              key={index}
              className="px-5 py-8 flex justify-between  shadow-lg transform mb-3 hover:scale-x-[1.01] hover:scale-y-[1.02] hover:cursor-pointer overflow-clip transition duration-500 ease-in-out "
            >
              {/* Basic Information */}
              <div className="flex flex-col gap-1 w-[25%] overflow-clip">
                <div className="flex mb-0 flex-col">
                  <h1 className="mb-3 text-base underline  underline-offset-4  font-bold">
                    {item?.parsed_cv?.position
                      ? item?.parsed_cv.position.toUpperCase()
                      : ""}
                  </h1>
                  <p className="flex items-center gap-2">
                    {item?.parsed_cv?.address && (
                      <span className=" flex items-center ">
                        <IoLocation className="text-base mr-2 " />
                        <span className="text-gray-500 text-sm">
                          {item?.parsed_cv.address}
                        </span>
                      </span>
                    )}
                  </p>
                </div>

                <p className="">
                  {item?.parsed_cv?.name && (
                    <div className="flex items-center gap-2 mt-0">
                      <span>
                        <FaUser className="text-sm" />
                      </span>
                      <span className="text-gray-500 font-normal text-sm">
                        {item?.parsed_cv?.name}
                      </span>
                    </div>
                  )}
                </p>
                <p className="">
                  {item?.parsed_cv?.phone_number && (
                    <span className="flex items-center gap-2">
                      <span>
                        <FaPhoneAlt className="text-sm" />
                      </span>
                      <span className="text-gray-500 text-sm">
                        {item?.parsed_cv.phone_number}
                      </span>
                    </span>
                  )}
                </p>
                <section className="">
                  {item?.parsed_cv?.email && (
                    <div className="flex items-center gap-2">
                      <span>
                        <MdEmail className="text-base  hover:opacity-60" />
                      </span>
                      <span>
                        <span
                          // href={`mailto:${item?.parsed_cv.email}`}
                          onClick={(event) =>
                            handleEmailCLick(event, item?.parsed_cv.email)
                          }
                          // target="_blank"
                          // rel="noopener noreferrer"
                          className="text-gray-500  hover:opacity-60"
                        >
                          <span>{item?.parsed_cv.email}</span>
                        </span>
                      </span>
                    </div>
                  )}
                </section>
                <div className="flex gap-2">
                  {item?.parsed_cv?.linkedin_url && (
                    <div>
                      <span
                        // href={
                        //   item.parsed_cv.linkedin_url.startsWith("http")
                        //     ? item.parsed_cv.linkedin_url
                        //     : `https://${item.parsed_cv.linkedin_url}`
                        // }
                        onClick={(event) =>
                          handleLinkedin(event, item?.parsed_cv.linkedin_url)
                        }
                        // target="_blank"
                        className="flex gap-2 "
                      >
                        <span>
                          <FaLinkedin className="cursor-pointer hover:opacity-60" />
                        </span>
                        <span className="text-gray-500 text-sm hover:opacity-75">
                          {item?.parsed_cv?.linkedin_url}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                <p>
                  {item?.parsed_cv?.github_url && (
                    <div>
                      <Link
                        href={
                          item?.parsed_cv.github_url.startsWith("http")
                            ? item.parsed_cv.github_url
                            : `https://${item.parsed_cv.github_url}`
                        }
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        className="flex gap-2"
                      >
                        <span>
                          <FaGithub className="cursor-pointer" />
                        </span>
                        <span className="text-gray-500 text-sm">
                          {item?.parsed_cv?.github_url}
                        </span>
                      </Link>
                    </div>
                  )}
                </p>
              </div>

              {/*Previous Experience */}
              <div className="flex flex-col gap-6 w-[30%] overflow-clip ">
                <div className="flex items-center gap-2">
                  <h1 className="font-medium text-base">Experience :</h1>
                  <p className="text-gray-500 text-sm ">
                    {item?.parsed_cv?.years_of_experience
                      ? item?.parsed_cv.years_of_experience + " years"
                      : ""}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold mb-3 ">
                    {item?.parsed_cv?.work_experience?.length > 0
                      ? item?.parsed_cv.work_experience[0]?.job_title
                      : ""}
                  </p>
                  <p className="flex  text-sm text-black ">
                    <span className="font-medium text-gray-500 ">
                      {item?.parsed_cv?.work_experience?.length > 0
                        ? item?.parsed_cv.work_experience[0]?.company_name +
                          " : "
                        : ""}
                      <span className="text-gray-400">
                        {" "}
                        {item?.parsed_cv?.work_experience?.length > 0
                          ? item?.parsed_cv.work_experience[0]?.start_date +
                            " - " +
                            item?.parsed_cv.work_experience[0]?.end_date
                          : ""}
                      </span>
                    </span>
                  </p>
                  {/* <p className='flex gap-[5px] items-start justify-start text-sm '>
                    <span className='mt-[2px] text-gray-800'>
                      <GoDotFill />
                    </span>
                    <span className=' text-gray-500'>
                      {item?.parsed_cv.work_experience?.length > 0
                        ? item?.parsed_cv.work_experience[0]?.responsibilities[0]?.slice(
                            0,
                            150
                          )
                        : ''}
                    </span>
                  </p> */}
                </div>
              </div>

              {/* Education and skills */}
              <div className="flex flex-col gap-2 w-[25%] overflow-clip relative ">
                <div>
                  <h1 className="font-bold text-base">Education</h1>
                  {item?.parsed_cv.education?.length > 0 ? (
                    <span className="text-sm text-gray-500">
                      {item.parsed_cv.education[0].degree}
                    </span>
                  ) : (
                    <span className="text-sm text-red-700">
                      Education details not available
                    </span>
                  )}
                </div>

                <div>
                  <h1 className=" mt-5 font-bold text-base">
                    License & Certification
                  </h1>

                  {item?.parsed_cv?.certifications?.length > 0 ? (
                    <span className="text-sm text-gray-500">
                      {item.parsed_cv.certifications[0].certification_name}
                    </span>
                  ) : (
                    <span className="text-sm text-red-700">
                      Certification details not available
                    </span>
                  )}
                </div>

                <div className="">
                  <h1 className="font-bold text-base mt-5">Skills</h1>
                  <div className="flex flex-col gap-2 justify-center">
                    <div className="flex space-x-2">
                      {item?.parsed_cv?.skills
                        ?.slice(0, 3)
                        .map((skill: any, index: number) => (
                          <Card
                            key={index}
                            className=" h-fit w-fit p-2 bg-slate-100 shadow-4xl rounded-lg text-sm overflow-hidden whitespace-nowrap text-ellipsis"
                            title={skill}
                          >
                            {skill}
                          </Card>
                        ))}
                    </div>
                    <div className="text-sm text-gray-500 hover:cursor-pointer">
                      {item?.parsed_cv.skills?.length > 3 && (
                        <span>...{item.parsed_cv.skills.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
};

export default ListView;
