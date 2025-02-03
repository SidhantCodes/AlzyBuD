
import Heading from "./components/Heading/Heading";
import Navbar from "./components/Navbar/Navbar";
import SubHeading from "./components/SubHeading/SubHeading";

export default function MainPage() {
  return (
    <>
      <div className="flex-col py-10">
        <Navbar />
        <div className="title mt-28">
          <SubHeading subhead={`Your gateway to streamlined `} />
          <Heading heading={`Alzheimer's care solutions`} />
        </div>
      </div>
    </>
  );
}