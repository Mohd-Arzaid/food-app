import {
  Loader2,
  LocateIcon,
  Mail,
  MapPin,
  MapPinnedIcon,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { useState } from "react";
import { Button } from "../ui/button";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form className=" max-w-[90%] md:max-w-[80%] mx-auto my-5 md:my-12">
      <div className="flex items-center justify-between">
        {/* Profile Image and Name */}
        <div className="flex items-center gap-2">
          <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
            <AvatarImage src="" />
            <AvatarFallback>CN</AvatarFallback>
            <input className="hidden" type="file" accept="image/*" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer">
              <Plus className="text-white w-8 h-8" />
            </div>
          </Avatar>

          <input
            type="text"
            value="Mohd Arzaid"
            name="fullname"
            className="font-bold px-3 py-2 text-base md:text-2xl outline-none border-none focus-visible:ring-transparent"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 md:gap-2 gap-3 mt-8 mb-8 md:mt-12 md:mb-16">
        {/* Email */}
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
          <Mail className="text-gray-500" />
          <div className="w-full">
            <Label className="text-sm md:text-base">Email</Label>
            <input
              disabled
              name="email"
              value="arzaid010103@gmail.com"
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
          <LocateIcon className="text-gray-500" />
          <div className="w-full">
            <Label className="text-sm md:text-base">Address</Label>
            <input
              disabled
              name="address"
              value="House no 8 , Village Kureni"
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>

        {/* City */}
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
          <MapPin className="text-gray-500" />
          <div className="w-full">
            <Label className="text-sm md:text-base">City</Label>
            <input
              disabled
              name="city"
              value="New Delhi"
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>

        {/* Country */}
        <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
          <MapPinnedIcon className="text-gray-500" />
          <div className="w-full">
            <Label className="text-sm md:text-base">Country</Label>
            <input
              disabled
              name="country"
              value="India"
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
      </div>

      <div className="text-center w-full">
        <Button disabled={isLoading} className="w-full md:w-auto md:text-base" type="submit">
          {isLoading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
};

export default Profile;
