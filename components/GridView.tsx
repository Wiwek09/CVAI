'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import { ViewContext } from "@/app/dashboard/context/ViewContext";
import { IFormInputData } from '@/interfaces/FormInputData';
import { IDocumentData } from '@/interfaces/DocumentData';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosConfig';
import GridViewSkeleton from './ui/Skeleton/GridViewSkeleton';

interface GridViewProps {
  data: IDocumentData[];
  searchData: IFormInputData | null;
}

function GridView({ data, searchData }: GridViewProps) {
  // console.log(data);
  const [imageDataID, setImageDataID] = useState<any[]>([]);
  // const contextValue = useContext(ViewContext);
  const [loading, setLoading] = useState(true);

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

  // useEffect(() => {
  //   if (imageDataID?.length > 0) {
  //   }
  // }, [imageDataID]);

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
      console.error('Erro Fetching', error);
    } finally {
      setLoading(false);
    }
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
      {loading ? (
        <div className='flex justify-between items-center '>
          <GridViewSkeleton />
          <GridViewSkeleton />
          <GridViewSkeleton />
        </div>
      ) : data?.length > 0 && imageDataID.length <= 0 ? (
        data?.map((item: any, index) => (
          <div key={item.doc_id} className='mb-6 cursor-pointer'>
            <Link href={`/cv-detail/${item.doc_id}`} target='_blank'>
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
