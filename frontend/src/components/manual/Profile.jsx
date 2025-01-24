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
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/apiServices/apiHandlers/profileAPI";

const Profile = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
  });
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.additionalDetails?.address || "",
        city: user.additionalDetails?.city || "",
        country: user.additionalDetails?.country || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log(file)
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("country", formData.country);
    if (imageFile) {
      formDataToSend.append("displayPicture", imageFile);
    }
    console.log("formdata", formDataToSend);
    dispatch(updateProfile(token, formDataToSend)).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <form
      onSubmit={updateProfileHandler}
      className="max-w-[90%] md:max-w-[80%] mx-auto my-7 md:my-12 "
    >
      <div className="flex items-center justify-between">
        {/* Profile Image and Name */}
        <div className="flex items-center gap-4">
          <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
            <AvatarImage
              src={previewSource || user?.image}
              alt={`profile-${user?.firstName}`}
            />
            <AvatarFallback>{`${formData.firstName?.[0]}${formData.lastName?.[0]}`}</AvatarFallback>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <div
              onClick={handleClick}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
            >
              <Plus className="text-white w-8 h-8" />
            </div>
          </Avatar>

          <div className="font-bold px-3 py-2 text-2xl md:text-3xl">
            {formData?.firstName + " " + formData?.lastName}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 md:gap-3 gap-3 mt-10 mb-8 md:mt-12 md:mb-16 ">
        {/* Email */}
        <div className="flex items-center gap-4 rounded-sm p-3 bg-gray-200">
          <Mail className="text-gray-500" />
          <div className="w-full">
            <Label className="text-sm md:text-base">Email</Label>
            <input
              disabled
              name="email"
              value={formData?.email}
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-4 rounded-sm p-3 bg-gray-200">
          <LocateIcon className="text-gray-500" />
          <div className="w-full">
            <Label className="text-sm md:text-base">Address</Label>
            <input
              name="address"
              onChange={handleChange}
              value={formData?.address}
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>

        {/* City */}
        <div className="flex items-center gap-4 rounded-sm p-3 bg-gray-200">
          <MapPin className="text-gray-500" />
          <div className="w-full">
            <Label className="text-sm md:text-base">City</Label>
            <input
              name="city"
              onChange={handleChange}
              value={formData?.city}
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>

        {/* Country */}
        <div className="flex items-center gap-4 rounded-sm p-3 bg-gray-200">
          <MapPinnedIcon className="text-gray-500" />
          <div className="w-full">
            <Label className="text-sm md:text-base">Country</Label>
            <input
              name="country"
              onChange={handleChange}
              value={formData?.country}
              className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
      </div>

      <div className="text-center w-full ">
        <Button
          disabled={isLoading}
          className="w-full md:w-auto text-base py-6 md:py-0"
          type="submit"
        >
          {isLoading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
};

export default Profile;
