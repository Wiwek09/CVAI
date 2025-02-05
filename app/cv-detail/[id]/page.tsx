"use client";
import React, { use, useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import DetailViewSkeleton from "@/components/ui/Skeleton/DetailViewSkeleton";
import axiosInstance from "@/utils/axiosConfig";
import { SquareArrowOutUpRight } from "lucide-react";
import { Star } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { PiGlobeLight } from "react-icons/pi";
import { MdEmail } from "react-icons/md";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IAvailability } from "@/interfaces/Availability";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { GrDocumentNotes } from "react-icons/gr";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

const CVDetailPage = ({ params }: { params: any }) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);

  // For Star
  // const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userChoice, setUserChoice] = useState(null);

  // State for API data and user input
  const [inputData, setInputData] = useState<IAvailability>({
    document_id: "",
    availability: null,
    time_of_day: null,
    star_rating: null,
    current_salary: null,
    estimated_salary: null,
    paid_by: null,
    votes: null,
    note: "",
  });

  const { id }: any = use(params);
  const pdfUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cv/${id}.pdf`;
  const closeButtonRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Use state for reactivity

  useEffect(() => {
    fetchFullCV();
  }, []);

  // For displaying initial availability
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/cv_document/getAvailability/${id}`
        );
        setInputData(response.data);
        // Set the userChoice based on the 'votes' value from the API response
        if (response.data.votes === true) {
          setUserChoice("like");
        } else if (response.data.votes === false) {
          setUserChoice("dislike");
        } else {
          setUserChoice(null);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const fetchFullCV = async () => {
    try {
      const response = await axiosInstance.get(`/document/cv/${id}`);
      setData(response.data.parsed_cv);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Data", error);
      setLoading(false);
    }
  };

  function validatePositiveNumber(event, field) {
    const value = event.target.value;

    // Remove any characters that aren't numbers or decimal point
    const sanitizedValue = value.replace(/[^\d.]/g, "");

    // Only allow one decimal point
    const decimalCount = (sanitizedValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return;
    }

    // Add leading zero if input starts with decimal
    let finalValue = sanitizedValue;
    if (finalValue.startsWith(".")) {
      finalValue = `0${finalValue}`;
    }

    // Allow empty input, numbers, and properly formatted decimals
    if (finalValue === "" || /^\d*\.?\d*$/.test(finalValue)) {
      setInputData((prevData) => ({
        ...prevData,
        [field]: finalValue === "" ? null : finalValue,
      }));
    }
  }

  const handleMouseEnter = (index) => {
    setHoveredRating(index);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleClick = (index) => {
    // setRating(index);
    setInputData({ ...inputData, star_rating: index });
  };

  // const handleLike = () => {
  //   if (userChoice === "like") {
  //     // Undo like
  //     setUserChoice(null);
  //   } else {
  //     setUserChoice("like");
  //   }
  // };

  // const handleDislike = () => {
  //   if (userChoice === "dislike") {
  //     setUserChoice(null);
  //   } else {
  //     setUserChoice("dislike");
  //   }
  // };

  const handleChoice = (choice: string) => {
    setUserChoice((prevChoice) => (prevChoice === choice ? null : choice));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line in textarea

      if (!isSubmitting) {
        handleSave();
      }
    }
  };

  const handleSave = async () => {
    if (isSubmitting) return; // Prevent multiple API calls
    setIsSubmitting(true); // Mark as submitting
    const vote =
      userChoice === "like" ? true : userChoice === "dislike" ? false : null;
    const body = {
      document_id: id,
      availability: inputData.availability || "",
      time_of_day: inputData.time_of_day || "",
      star_rating: inputData.star_rating,
      current_salary: inputData.current_salary,
      estimated_salary: inputData.estimated_salary,
      paid_by: inputData.paid_by || "",
      vote: vote,
      note: inputData.note,
    };

    try {
      setLoader(true);
      await axiosInstance.put(`/cv_document/updateAvailability`, body);
      toast("Successfully Updated Data", {
        style: {
          background: "black",
          color: "white",
        },
        duration: 1000,
      });
      closeButtonRef.current?.click();
    } catch (error) {
      console.error("Error saving data", error);
      toast.error("Error Occured !!", { duration: 1000 });
    } finally {
      setLoader(false);
      setIsSubmitting(false); // Reset flag after request
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
        <Card className="px-3 py-3 w-[40%] h-full bg-gray-100 flex flex-col gap-3">
          {/* Scrollable */}
          <div className="pb-3 overflow-y-auto scrollbar-thin flex flex-col gap-3">
            {/* First Part */}
            <div className=" top-0 bg-gray-100">
              <div className="flex justify-between w-[100%] items-start">
                <div className="flex flex-col w-max-[60%] flex-wrap pr-3 ">
                  <h1 className="font-bold text-xl">
                    {data?.name?.toUpperCase()}
                  </h1>

                  <p className="font-semibold underline">
                    {data?.position?.toUpperCase()}
                  </p>
                  <p className="flex gap-2 items-center">
                    {data?.linkedin_url && (
                      <>
                        <span>
                          <FaLinkedin />
                        </span>
                        <a
                          href={
                            data.linkedin_url.startsWith("http")
                              ? data.linkedin_url
                              : `https://${data.linkedin_url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="max-w-48 truncate"
                        >
                          <span className="text-blue-800 underline hover:opacity-80 text-sm">
                            {data.linkedin_url}
                          </span>
                        </a>
                      </>
                    )}
                  </p>

                  <p className="flex gap-2 items-center">
                    {data?.git_url && (
                      <>
                        <span>
                          <FaGithub />
                        </span>
                        <Link
                          href={
                            data?.git_url.startsWith("http")
                              ? data?.git_url
                              : `https://${data?.git_url}`
                          }
                          target="_blank"
                          className="max-w-48 truncate"
                        >
                          <span className="text-blue-800 underline hover:opacity-80 text-sm">
                            {data?.git_url}
                          </span>
                        </Link>
                      </>
                    )}
                  </p>

                  <p className="flex gap-2 max-w-sm truncate items-center">
                    {data?.website && (
                      <>
                        <span>
                          <PiGlobeLight size={18} />
                        </span>
                        <Link
                          href={
                            data?.website.startsWith("http")
                              ? data?.website
                              : `https://${data?.website}`
                          }
                          target="_blank"
                          className="max-w-48 truncate"
                        >
                          <span className="text-blue-800 underline hover:opacity-80 text-sm">
                            {data?.website}
                          </span>
                        </Link>
                      </>
                    )}
                  </p>

                  <p className="flex gap-2 items-center">
                    {data?.email && (
                      <>
                        <span>
                          <MdEmail />
                        </span>

                        <Link
                          href={`mailto:${data?.email}`}
                          target="_blank"
                          className="max-w-48  truncate"
                        >
                          <span className="text-blue-800 underline hover:opacity-80 text-sm">
                            {data?.email}
                          </span>
                        </Link>
                      </>
                    )}
                  </p>

                  <p>
                    {data?.phone_number && (
                      <>
                        <span className=" font-semibold text-gray-700 text-sm">
                          {data?.phone_number}
                        </span>
                      </>
                    )}
                  </p>

                  <p>
                    {data?.address && (
                      <>
                        <span className="font-semibold text-gray-700 text-sm">
                          {data?.address}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex w-max-[40%] flex-wrap flex-col gap-2 justify-end"></div>
              </div>
            </div>

            {/* Second Part*/}
            <div className="flex-grow flex-col space-y-3">
              {/* Skills */}
              <div>
                {data?.skills?.length > 0 && (
                  <span className="flex flex-col gap-1 pb-2">
                    <span className="font-semibold">Skills</span>
                    <span className="flex flex-wrap gap-2 text-sm max-w-3xl">
                      {data?.skills?.map((item: any, index: number) => (
                        <span key={index}>
                          <span className="flex shadow-md px-2 py-3 bg-[#f7f9fc] text-gray-700 font-sans rounded-md w-fit font-semibold">
                            {item}
                          </span>
                        </span>
                      ))}
                    </span>
                  </span>
                )}
              </div>

              {/* Programming Language */}
              <div>
                {data?.programming_languages?.length > 0 && (
                  <span className="flex flex-col gap-1 pb-2">
                    <span className="font-semibold">Progamming Language</span>
                    <span className="flex flex-wrap gap-2 text-sm max-w-3xl">
                      {data?.programming_languages?.map(
                        (item: any, idx: number) => (
                          <span key={idx}>
                            <span className="flex shadow-md px-2 py-3 text-gray-700 font-sans bg-[#f7f9fc] rounded-md w-fit font-semibold">
                              {item}
                            </span>
                          </span>
                        )
                      )}
                    </span>
                  </span>
                )}
              </div>
              {/* Experience */}
              <div className="flex flex-col gap-2">
                <p className="font-semibold flex items-center gap-4 ">
                  Experiences
                  <span className="text-sm">
                    {data?.years_of_experience &&
                      "(" + data?.years_of_experience + " years" + ")"}
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
                        <span className="flex flex-col text-sm max-w-3xl mr-4 ">
                          {item.responsibilities.length > 0 &&
                            item.responsibilities.map(
                              (el: any, index: number) => (
                                <span
                                  className="flex gap-1 text-gray-700 "
                                  key={index}
                                >
                                  <span className="mt-[3px]">
                                    <GoDotFill />
                                  </span>
                                  <span>{el}</span>
                                </span>
                              )
                            )}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Project */}
              <div>
                {data?.technical_projects?.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold ">Projects</p>
                    <div className="flex gap-4 flex-col">
                      {data?.technical_projects?.length > 0 &&
                        data?.technical_projects.map(
                          (data: any, index: number) => (
                            <div key={index}>
                              <div className="flex flex-col gap-2 text-gray-700">
                                <div className="flex justify-between items-center">
                                  <div className="text-gray-700 font-semibold">
                                    {index + 1 + ". " + data.project_name}
                                  </div>
                                  {data.project_link && (
                                    <Link
                                      href={
                                        data.project_link.startsWith("http")
                                          ? data.project_link
                                          : `https://${data.project_link}`
                                      }
                                      target="_blank"
                                      className=" mr-4 hover:opacity-50"
                                    >
                                      <SquareArrowOutUpRight size={16} />
                                    </Link>
                                  )}
                                </div>
                                {data.programming_language?.length > 0 && (
                                  <div className="flex gap-3 items-center text-sm mr-4 ">
                                    {/* <p>Technology Used : </p> */}
                                    {data.programming_language.map(
                                      (el, index) => (
                                        <div key={index}>
                                          <p className="shadow-md px-2 py-3 bg-[#f7f9fc]  font-sans rounded-md w-fit font-semibold">
                                            {el}
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                                {data.description && (
                                  <p className="text-sm mr-4">
                                    {data.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                )}
              </div>
              {/* Education */}
              <div>
                <span className="flex flex-col gap-1">
                  <span className="font-semibold">Education</span>
                  <span className="flex gap-2 flex-col">
                    {data?.education?.length > 0 &&
                      data?.education.map((el: any, index: number) => (
                        <div key={index}>
                          <p className="font-semibold">
                            {index + 1 + ". " + el.degree}
                          </p>
                          <div className="flex gap-1 items-center text-gray-700 text-sm">
                            <span>{el?.institution}</span>
                            <span>
                              {"(" +
                                el?.start_date +
                                " - " +
                                el?.end_date +
                                ")"}
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
          </div>

          {/* Availability Section */}
          <div className="sticky z-10 border-t-2 rounded-md border-slate-700 pt-3 flex flex-col gap-3">
            {/* Stars & Like / DisLike */}
            <div className="flex justify-between items-center">
              {/* stars */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    key={index}
                    className="p-1 hover:scale-110 transition-transform"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(index)}
                  >
                    <Star
                      size={14}
                      fill={
                        index <= (hoveredRating || inputData.star_rating)
                          ? "#f59e0b"
                          : "none"
                      }
                      stroke={
                        index <= (hoveredRating || inputData.star_rating)
                          ? "#f59e0b"
                          : "#4b5563"
                      }
                    />
                  </button>
                ))}
              </div>

              {/* Notes */}
              <div>
                <Sheet>
                  <SheetTrigger>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-pointer shadow-2xl shadow-gray-600 hover:scale-110 transition-transform bg-slate-300 h-fit w-fit p-2 rounded-md duration-300 ease-in-out">
                          <GrDocumentNotes />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Note</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col gap-3">
                    <SheetHeader>
                      <SheetTitle>Note</SheetTitle>
                    </SheetHeader>
                    <div>
                      <Textarea
                        className="h-48"
                        placeholder="Add notes..."
                        value={inputData.note}
                        onChange={(e) =>
                          setInputData({ ...inputData, note: e.target.value })
                        }
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          className="w-22 h-8"
                          type="submit"
                          onClick={handleSave}
                          ref={closeButtonRef}
                        >
                          Save
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Like / DisLike */}
              <div>
                <div className="flex items-center">
                  <button
                    // onClick={handleLike}
                    onClick={() => handleChoice("like")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all
                    ${
                      userChoice === "like"
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ThumbsUp
                      size={16}
                      fill={userChoice === "like" ? "currentColor" : "none"}
                    />
                  </button>

                  <button
                    // onClick={handleDislike}
                    onClick={() => handleChoice("dislike")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all
                    ${
                      userChoice === "dislike"
                        ? "bg-red-100 text-red-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ThumbsDown
                      size={16}
                      fill={userChoice === "dislike" ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex justify-between items-center">
              <div>
                <Select
                  value={inputData.availability || ""}
                  onValueChange={(value) =>
                    setInputData({ ...inputData, availability: value })
                  }
                >
                  <SelectTrigger className="w-[120px] h-[34px] text-xs">
                    <SelectValue
                      className="text-xs"
                      placeholder="Availability"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="remote" className="text-xs">
                        Remote
                      </SelectItem>
                      <SelectItem value="onsite" className="text-xs">
                        Onsite
                      </SelectItem>
                      <SelectItem value="hybrid" className="text-xs">
                        Hybrid
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={inputData.time_of_day || ""}
                  onValueChange={(value) =>
                    setInputData({ ...inputData, time_of_day: value })
                  }
                >
                  <SelectTrigger className="w-[120px] text-xs h-[34px]">
                    <SelectValue placeholder="Time" className="text-xs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="day" className="text-xs">
                        Day
                      </SelectItem>
                      <SelectItem value="night" className="text-xs">
                        Night
                      </SelectItem>
                      <SelectItem value="flexible" className="text-xs">
                        Flexible
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Salary */}
            <div className="flex mt-1 justify-between">
              {/* Current Salary */}
              <div className="w-40 relative">
                {/* Label */}
                <label
                  htmlFor="currentSalary"
                  className={`absolute left-3 px-1 text-xs font-medium text-gray-700 ${
                    inputData.current_salary !== null
                      ? "-top-2 bg-white"
                      : "top-2.5 text-gray-500"
                  }`}
                >
                  Current Salary (USD)
                </label>
                {/* Input Field */}
                <input
                  type="text"
                  id="currentSalary"
                  className=" peer block w-full rounded-md border border-gray-300 transition-all duration-100 bg-white py-2 px-3 text-xs shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  value={
                    inputData.current_salary !== null
                      ? inputData.current_salary.toString()
                      : ""
                  }
                  onChange={(event) =>
                    validatePositiveNumber(event, "current_salary")
                  }
                />
              </div>
              {/* Estimated Salary */}
              <div>
                <div className="w-40 relative">
                  {/* Label */}
                  <label
                    htmlFor="estimatedSalary"
                    className={`absolute left-3 px-1 text-xs font-medium transition-all duration-100 text-gray-700 ${
                      inputData.estimated_salary !== null
                        ? "-top-2 bg-white"
                        : "top-2.5 text-gray-500"
                    }`}
                  >
                    Estimated Salary (USD)
                  </label>
                  {/* Input Field */}
                  <input
                    type="text"
                    id="estimatedSalary"
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-xs shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    value={
                      inputData.estimated_salary !== null
                        ? inputData.estimated_salary.toString()
                        : ""
                    }
                    onChange={(event) =>
                      validatePositiveNumber(event, "estimated_salary")
                    }
                  />
                </div>
              </div>
            </div>

            {/* Like DisLike & Save */}
            <div className="flex justify-between">
              <div>
                <div>
                  <Select
                    value={inputData.paid_by || ""}
                    onValueChange={(value) =>
                      setInputData({ ...inputData, paid_by: value })
                    }
                  >
                    <SelectTrigger className="w-[120px] h-[34px] text-xs">
                      <SelectValue
                        className="text-xs"
                        placeholder="Salary Based"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="hourly" className="text-xs">
                          Hourly
                        </SelectItem>
                        <SelectItem value="monthly" className="text-xs">
                          Monthly
                        </SelectItem>
                        <SelectItem value="annually" className="text-xs">
                          Annually
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Button
                  className="w-22 h-8"
                  onClick={handleSave}
                  disabled={loader}
                >
                  <span className="flex items-center justify-center w-full">
                    {loader ? (
                      <LoaderCircle className="h-4 animate-spin" />
                    ) : (
                      <span className="text-xs h-4">Save</span>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CVDetailPage;
