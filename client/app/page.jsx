'use client'
import Link from "next/link";
import Btn from "./components/Btn/Btn";
import Heading from "./components/Heading/Heading";
import MiniHeading from "./components/MiniHeading/MiniHeading";
import Navbar from "./components/Navbar/Navbar";
import Paragraph from "./components/Paragraph/Paragraph";
import SubHeading from "./components/SubHeading/SubHeading";

export default function MainPage() {
  return (
      <div className="flex-col py-10 mx-4 ">
        <Navbar />
        <div className="title mt-28 flex-col justify-center">
          <SubHeading subhead={`Your gateway to streamlined `} />
          <Heading heading={`Alzheimer's care solutions`} />
          <div className="bg-black mx-24 h-0.5 rounded-full "></div>
          <SubHeading subhead={`Strength in care, even when memories fade`}  />
          <Paragraph para={`Our platform provides hospitals with powerful tools designed to optimize the care process for Alzheimer’s patients. From test score analysis to tracking patient sessions, we ensure you have everything you need at your fingertips.`} />
          {/* <Btn name={`Take test now`} /> */}
          <Link href="/patient-login">
            <Btn name={`Take test now`} />
          </Link>
          {/* <MiniHeading minhead={`About us`} /> */}
        </div>
      </div>
  );
}