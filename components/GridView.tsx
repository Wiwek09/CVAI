'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import { ViewContext } from "@/app/dashboard/context/ViewContext";
import { IFormInputData } from '@/interfaces/FormInputData';
import { IDocumentData } from '@/interfaces/DocumentData';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosConfig';
import GridViewSkeleton from './ui/Skeleton/GridViewSkeleton';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoCallOutline } from 'react-icons/io5';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { FaGithub } from 'react-icons/fa';
import { CiLinkedin } from 'react-icons/ci';
import ListViewSkeleton from './ui/Skeleton/ListViewSkeleton';

interface GridViewProps {
  data: IDocumentData[];
  searchData: IFormInputData | null;
}

function GridView({ data, searchData }: GridViewProps) {
  // console.log(data);
  const [imageDataID, setImageDataID] = useState<any[]>([]);
  // const contextValue = useContext(ViewContext);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [hoveredUser, setHoveredUser] = useState<any[]>([]);

  // useEffect(() => {
  //   const storedSearchData = sessionStorage.getItem("searchData");

  //   if (storedSearchData) {
  //     setInitialLoad(false);
  //     getFullImageData(JSON.parse(storedSearchData));
  //     // getSkillSummary();
  //   } else if (data?.length > 0 && !searchData) {
  //     setInitialLoad(true);
  //   } else {
  //     setInitialLoad(false);
  //   }
  // }, [data, searchData]);

  // Trigger loading state based on `data`
  useEffect(() => {
    if (data?.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [data]);

  // Handle search data and view changes
  useEffect(() => {
    if (searchData) {
      setLoading(true);
      getFullImageData(searchData);
    } else if (data?.length === 0) {
      setImageDataID([]);
      setLoading(false);
    }
  }, [searchData]);

  useEffect(() => {
    const getHoveredDetails = async () => {
      const response = await axiosInstance.get(`/document/cv/${hoveredId}`);
      console.log(response.data.parsed_cv);
      setHoveredUser(response.data.parsed_cv);
    };
    if (hoveredId) {
      getHoveredDetails();
    } else {
      console.log('no hover');
    }
  }, [hoveredId]);

  const getFullImageData = async (searchData: IFormInputData) => {
    try {
      const response = await axiosInstance.post(
        `/document/search_by_query`,
        searchData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setImageDataID(response.data);
        setLoading(true);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error Fetching', error);
    } finally {
      setLoading(false);
    }
  };
  const handleMouseOver = (id: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      console.log('This is the id', id);

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

  // const getSkillSummary = async () => {
  //   try {
  //     const fetchedData = await Promise.all(
  //       data?.map(async (item: any) => {
  //         const response = await axios.get(`/document/cv/${item.doc_id}`);
  //         return response.data;
  //       })
  //     );
  //     // setLoading(true);
  //     setParsedData(fetchedData);
  //   } catch (error) {
  //     console.log("Error fetching data", error);
  //   }
  //   // finally {
  //   //   setLoading(true);
  //   // }
  // };

  // if(data?.length){
  //   setLoading(false);
  // }

  return (
    <div className='masonry-container bg-gray-100'>
      {hoveredId && (
        <div
          className='fixed inset-0 bg-black opacity-80 z-10'
          style={{ filter: 'brightness(0)', pointerEvents: 'none' }}
        ></div>
      )}
      {loading ? (
        <div className='flex justify-between items-center '>
          <GridViewSkeleton />
          <GridViewSkeleton />
          <GridViewSkeleton />
        </div>
      ) : data?.length > 0 && imageDataID.length <= 0 ? (
        data?.map((item: any, index) => (
          // <HoverCard>
          //   <HoverCardTrigger>
          <div
            key={item.doc_id}
            className={`mb-6 cursor-pointer transition-transform duration-300 relative ${
              hoveredId === item.doc_id ? 'z-20' : 'z-0'
            }`}
            onMouseOver={() => {
              handleMouseOver(item.doc_id);
            }}
            onMouseLeave={() => {
              handleMouseLeave();
            }}
          >
            {/* {hoveredId === item.image_id && (
              <RxHamburgerMenu className='z-20 absolute right-0' />
            )} */}
            <Link href={`/cv-detail/${item.doc_id}`} target='_blank'>
              {hoveredId === item.doc_id && (
                <div
                  className={`absolute flex rounded-md pl-9 pr-9 py-2 flex-col bg-white w-full h-full z-50 transition-opacity duration-500 ease-in-out ${
                    hoveredUser.name
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-5'
                  }`}
                >
                  {hoveredUser.name ? (
                    <div>
                      <h1 className='font-bold text-xl py-5'>
                        {hoveredUser.name?.toUpperCase()}
                      </h1>
                      <div className='space-y-5'>
                        <section className='flex space-x-4 items-center'>
                          <button className='bg-gray-600 p-[4px] rounded-full'>
                            <IoCallOutline color='white' />
                          </button>
                          <h1>{hoveredUser.phone_number}</h1>
                        </section>

                        <section className='flex items-center'>
                          {hoveredUser.linkedin_url ? (
                            <div className='flex space-x-4 truncate'>
                              <button className='bg-gray-600 p-[4px] rounded-full'>
                                <CiLinkedin color='white' />
                              </button>
                              <a
                                onClick={(e) => e.stopPropagation()}
                                href={hoveredUser.linkedin_url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline'
                              >
                                <h1>{hoveredUser.linkedin_url}</h1>
                              </a>
                            </div>
                          ) : hoveredUser.git_url ? (
                            <div className='truncate'>
                              <a
                                onClick={(e) => e.stopPropagation()}
                                href={hoveredUser.git_url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 flex space-x-4 hover:underline'
                              >
                                <button className='bg-gray-600 p-[4px] rounded-full'>
                                  <FaGithub color='white' />
                                </button>
                                <h1>{hoveredUser.git_url}</h1>
                              </a>
                            </div>
                          ) : null}
                        </section>

                        <section>
                          <h1 className='text-lg font-semibold'>Experience</h1>
                          {hoveredUser.work_experience?.map((job, index) => (
                            <h3 key={index} className='text-gray-600 ml-3'>
                              {job.job_title}
                            </h3>
                          ))}
                        </section>

                        <section>
                          <h1 className='text-lg font-semibold'>Skills</h1>
                          {hoveredUser.skills
                            ?.slice(0, 3)
                            .map((skill, index) => (
                              <h3 key={index} className='text-gray-600 ml-3'>
                                {skill}
                              </h3>
                            ))}
                        </section>

                        <section>
                          <h1 className='text-lg font-semibold'>Education</h1>
                          {hoveredUser.education
                            ?.slice(0, 3)
                            .map((ed, index) => (
                              <h3 key={index} className='text-gray-600 ml-3'>
                                {ed.degree}
                              </h3>
                            ))}
                        </section>
                      </div>
                    </div>
                  ) : (
                    <ListViewSkeleton variant='hover' />
                  )}
                </div>
              )}
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}cv_images/${item.image_id}.webp`}
                alt={`Image ${index + 1}`}
                height={500}
                width={700}
                className='rounded-lg object-cover shadow-lg w-full'
                loading='lazy'
                layout='responsive'
              />

              {/* Overlay that appears on hover */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="spinner-tailwind" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{item.doc_name}</p>
                  )}
                </div>
              </div> */}
            </Link>
          </div>
          // </HoverCardTrigger>
          // <HoverCardContent>
          //   <div>Hello</div>
          // </HoverCardContent>
          // </HoverCard>
        ))
      ) : imageDataID?.length > 0 ? (
        imageDataID.map((item: any, index) => (
          <div
            key={index}
            // onClick={() => router.push(`/cv-detail/${item.doc_id}`)}
            className='mb-6 cursor-pointer'
          >
            <Link href={`/cv-detail/${item.doc_id}`} target='_blank'>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/cv_images/${item.img_id}.webp`}
                alt={`Image ${index + 1}`}
                height={500}
                width={700}
                className='rounded-lg object-cover shadow-lg w-full h-auto'
                loading='lazy'
                layout='responsive'
              />

              {/* Overlay that appears on hover */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm flex justify-center">
                <div className="text-white text-center p-4">
                  <h3 className="text-lg font-bold mb-2">Overview</h3>
                  <p className="text-sm">{item.skill_summary}</p>
                </div>
              </div> */}
            </Link>
          </div>
        ))
      ) : (
        <div>No Data Available....</div>
      )}
    </div>
  );
}

export default GridView;
