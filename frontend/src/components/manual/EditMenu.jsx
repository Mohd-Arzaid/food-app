import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editMenu } from "@/apiServices/apiHandlers/menuAPI";

const EditMenuSchema = z.object({
  name: z.string().trim().min(2, "Dish name must be at least 2 characters."),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters."),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number." })
    .min(1, "Price must be greater than 0."),
});

const EditMenu = ({ selectedMenu, editOpen, setEditOpen }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(EditMenuSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  useEffect(() => {
    if (selectedMenu) {
      reset({
        name: selectedMenu.name || "",
        description: selectedMenu.description || "",
        price: selectedMenu.price || "",
      });
      setImageFile(undefined);
    }
  }, [selectedMenu, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file && file.size > maxSizeBytes) {
      toast.error("File size exceeds 10MB limit. Please choose a smaller file.");
      e.target.value = "";
      setImageFile(undefined);
      return;
    }
    setImageFile(file);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await dispatch(editMenu(token, selectedMenu?._id, formData));
    setEditOpen(false);
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Edit Dish Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update dish name, price, description or change photo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Input
            label="Dish Name"
            placeholder="e.g. Margherita Pizza"
            disabled={isSubmitting}
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Description"
            variant="textarea"
            rows={3}
            placeholder="Short description of ingredients or taste"
            disabled={isSubmitting}
            {...register("description")}
            error={errors.description?.message}
          />

          <Input
            label="Price (₹)"
            type="number"
            placeholder="e.g. 299"
            disabled={isSubmitting}
            {...register("price")}
            error={errors.price?.message}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground block">
              Change Dish Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-foreground hover:file:bg-gray-200 cursor-pointer"
            />
            {selectedMenu?.imageUrl && !imageFile && (
              <div className="mt-2 flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-border w-fit">
                <img
                  src={selectedMenu.imageUrl}
                  alt={selectedMenu.name}
                  className="h-10 w-10 object-cover rounded-md"
                />
                <span className="text-xs text-muted-foreground">
                  Current dish image
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="h-11 px-6 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Dish...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenu;
