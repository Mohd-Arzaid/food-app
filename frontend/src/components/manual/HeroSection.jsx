import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import HeroImage from "../../assets/hero_pizza_.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setSearchText(e.target.value);
  };
  const searchHandler = () => {
    // if (searchText) {
      navigate(`/search/${searchText}`);
    // } else {
      // toast.error("What delicious spot are you craving? Type it in! 🍕");
    // }
  };
  
  return (
    <div className="flex flex-col md:flex-row max-w-[90%] mx-auto py-10 md:py-5 rounded-lg items-center justify-center gap-20">
      {/* Left Side */}
      <div className="flex flex-col gap-10 md:w-[40%]">
        {/* Heading */}
        <div className="flex flex-col gap-5">
          <h1 className="font-bold md:font-extrabold md:text-5xl text-3xl">
            Order Food anytime & anywhere
          </h1>
          <p className="text-gray-500">
            Hey! Our Delicios food is waiting for you, we are always near to
            you.
          </p>
        </div>

        {/* Search Box */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={searchText}
              onChange={changeHandler}
              onKeyDown={(e) => e.key === "Enter" && searchHandler()}
              placeholder="Search restaurant by name, city & country"
              className="pl-10 h-12 rounded-lg"
            />
            <Search className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
          </div>
          <Button onClick={searchHandler} className="h-12 px-6">
            Search
          </Button>
        </div>
      </div>

      {/* Right Side */}
      <div>
        <img
          src={HeroImage}
          alt="Delicious Pizza"
          className="object-cover w-full max-h-[500px]"
        />
      </div>
    </div>
  );
};

export default HeroSection;
