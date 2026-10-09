import {
  Loader2,
  Mail,
  MapPin,
  MapPinned,
  Plus,
  Home,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfile } from "@/apiServices/apiHandlers/profileAPI";

const ProfileSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters."),
  email: z.string().email(),
  address: z.string().trim().min(2, "Address is required."),
  city: z.string().trim().min(2, "City is required."),
  country: z.string().trim().min(2, "Country is required."),
});

const Profile = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.additionalDetails?.address || "",
        city: user.additionalDetails?.city || "",
        country: user.additionalDetails?.country || "",
      });
    }
  }, [user, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewSource(reader.result);
      };
    }
  };

  const onSubmit = async (data) => {
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", data.firstName);
    formDataToSend.append("lastName", data.lastName);
    formDataToSend.append("address", data.address);
    formDataToSend.append("city", data.city);
    formDataToSend.append("country", data.country);
    if (imageFile) {
      formDataToSend.append("displayPicture", imageFile);
    }

    await dispatch(updateProfile(token, formDataToSend));
  };

  const currentFirstName = watch("firstName");
  const currentLastName = watch("lastName");

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-sm">
        {/* User Banner Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border">
          <Avatar className="relative w-24 h-24 sm:w-28 sm:h-28 border-2 border-border shadow-xs">
            <AvatarImage
              src={previewSource || user?.image}
              alt={`profile-${user?.firstName}`}
              className="object-cover"
            />
            <AvatarFallback className="text-xl font-bold bg-gray-100 text-foreground">
              {`${(currentFirstName?.[0] || "").toUpperCase()}${(currentLastName?.[0] || "").toUpperCase()}`}
            </AvatarFallback>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg, image/webp"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/60 rounded-full cursor-pointer"
              title="Change profile picture"
            >
              <Plus className="text-white w-7 h-7" />
            </div>
          </Avatar>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {currentFirstName} {currentLastName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.email} &bull;{" "}
              <span className="font-medium text-foreground">
                {user?.isRestaurantOwner ? "Restaurant Partner" : "Customer"}
              </span>
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs font-semibold text-foreground hover:underline cursor-pointer"
            >
              Change Profile Photo
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="First Name"
              placeholder="e.g. John"
              disabled={isSubmitting}
              {...register("firstName")}
              error={errors.firstName?.message}
            />

            <Input
              label="Last Name"
              placeholder="e.g. Doe"
              disabled={isSubmitting}
              {...register("lastName")}
              error={errors.lastName?.message}
            />

            <Input
              label="Email Address (Read-only)"
              disabled
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Address"
              placeholder="e.g. 123 Main Street, Apt 4B"
              disabled={isSubmitting}
              {...register("address")}
              error={errors.address?.message}
            />

            <Input
              label="City"
              placeholder="e.g. Mumbai"
              disabled={isSubmitting}
              {...register("city")}
              error={errors.city?.message}
            />

            <Input
              label="Country"
              placeholder="e.g. India"
              disabled={isSubmitting}
              {...register("country")}
              error={errors.country?.message}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              className="h-12 px-8 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Profile...
                </span>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
