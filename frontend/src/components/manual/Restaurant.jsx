import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Store, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
} from "@/apiServices/apiHandlers/restaurantAPI";
import { toast } from "sonner";

const RestaurantSchema = z.object({
  restaurantName: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters."),
  city: z.string().trim().min(2, "City is required."),
  country: z.string().trim().min(2, "Country is required."),
  deliveryTime: z.coerce
    .number({ invalid_type_error: "Delivery time must be a number." })
    .min(1, "Delivery time must be at least 1 minute."),
  cuisines: z
    .string()
    .trim()
    .min(2, "Please enter cuisines (e.g. Momos, Biryani)."),
});

const Restaurant = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { restaurant } = useSelector((state) => state.restaurant);
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RestaurantSchema),
    defaultValues: {
      restaurantName: "",
      city: "",
      country: "",
      deliveryTime: "",
      cuisines: "",
    },
  });

  useEffect(() => {
    dispatch(getRestaurant(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (restaurant) {
      reset({
        restaurantName: restaurant.restaurantName || "",
        city: restaurant.city || "",
        country: restaurant.country || "",
        deliveryTime: restaurant.deliveryTime || "",
        cuisines: Array.isArray(restaurant.cuisines)
          ? restaurant.cuisines.join(", ")
          : "",
      });
    }
  }, [restaurant, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file && file.size > maxSizeBytes) {
      toast.error("File size exceeds 10MB limit. Please choose a smaller file.");
      e.target.value = "";
      setSelectedFile(undefined);
      setFileError("File exceeds 10MB limit.");
      return;
    }
    setFileError("");
    setSelectedFile(file);
  };

  const onSubmit = async (data) => {
    // If creating a new restaurant, image is required
    if (!restaurant && !selectedFile) {
      setFileError("Restaurant banner image is required.");
      return;
    }

    const cuisinesArray = data.cuisines
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append("restaurantName", data.restaurantName);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("deliveryTime", data.deliveryTime.toString());
    formData.append("cuisines", JSON.stringify(cuisinesArray));
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (restaurant) {
      await dispatch(updateRestaurant(token, formData));
    } else {
      await dispatch(createRestaurant(token, formData));
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-[#1f2937]">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {restaurant ? "Edit Restaurant Details" : "Create Your Restaurant"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {restaurant
                ? "Update your restaurant info, location, and cuisine offerings."
                : "Enter your restaurant information to publish your profile."}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Restaurant Name */}
            <Input
              label="Restaurant Name"
              placeholder="e.g. Spice Garden"
              disabled={isSubmitting}
              {...register("restaurantName")}
              error={errors.restaurantName?.message}
            />

            {/* City */}
            <Input
              label="City"
              placeholder="e.g. Mumbai"
              disabled={isSubmitting}
              {...register("city")}
              error={errors.city?.message}
            />

            {/* Country */}
            <Input
              label="Country"
              placeholder="e.g. India"
              disabled={isSubmitting}
              {...register("country")}
              error={errors.country?.message}
            />

            {/* Delivery Time */}
            <Input
              label="Delivery Time (in minutes)"
              placeholder="e.g. 30"
              type="number"
              disabled={isSubmitting}
              {...register("deliveryTime")}
              error={errors.deliveryTime?.message}
            />

            {/* Cuisines */}
            <div className="md:col-span-2">
              <Input
                label="Cuisines (comma separated)"
                placeholder="e.g. Biryani, North Indian, Fast Food"
                disabled={isSubmitting}
                {...register("cuisines")}
                error={errors.cuisines?.message}
              />
            </div>

            {/* Banner Upload */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-foreground block">
                Restaurant Banner Image {restaurant ? "(Optional to change)" : "(Required)"}
              </label>
              <div className="relative flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-foreground hover:file:bg-gray-200 cursor-pointer transition-colors"
                />
              </div>
              {fileError && (
                <p className="text-destructive text-xs font-medium">{fileError}</p>
              )}
              {restaurant?.imageUrl && !selectedFile && (
                <div className="mt-2 flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-border w-fit">
                  <img
                    src={restaurant.imageUrl}
                    alt="Current Banner"
                    className="h-12 w-16 object-cover rounded-md"
                  />
                  <span className="text-xs text-muted-foreground">Current Banner Photo</span>
                </div>
              )}
            </div>
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
                  Saving Details...
                </span>
              ) : restaurant ? (
                "Update Restaurant"
              ) : (
                "Create Restaurant"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Restaurant;
