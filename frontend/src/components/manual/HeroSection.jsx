import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import HeroImage from "../../assets/hero_pizza_.png";

const HeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row max-w-[90%] mx-auto py-10 md:py-5 rounded-lg items-center justify-center gap-20">
      {/* Left Side */}
      <div className="flex flex-col gap-10 md:w-[40%]">
        {/* Heading */}
        <div className="flex flex-col gap-5">
          <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">
            Order Food anytime & anywhere
          </h1>
          <p className="text-gray-500">
            Hey! Our Delicios food is waiting for you, we are always near to
            you.
          </p>
        </div>

        {/* Search Box */}
        <div className="relative flex items-center gap-2">
        <Input
            type="text"
            placeholder="Search restaurant by name, city & country"
            className="pl-10 shadow-lg"
          />
          <Search className="text-gray-500 absolute inset-y-2 left-2" />
          <Button>Search</Button>
        </div>
      </div>

      {/* Right Side */}
      <div>
        <img src={HeroImage} alt="" 
         className="object-cover w-full max-h-[500px]"
        />
      </div>
    </div>
  );
};

export default HeroSection;
