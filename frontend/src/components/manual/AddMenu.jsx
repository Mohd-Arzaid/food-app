import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createMenu, deleteMenu } from "@/apiServices/apiHandlers/menuAPI";
import { getRestaurant } from "@/apiServices/apiHandlers/restaurantAPI";
import EditMenu from "./EditMenu";

const MenuSchema = z.object({
  name: z.string().trim().min(2, "Dish name must be at least 2 characters."),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters."),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number." })
    .min(1, "Price must be greater than 0."),
});

const AddMenu = () => {
  const { restaurant } = useSelector((state) => state.restaurant);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFile, setImageFile] = useState(undefined);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(MenuSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  useEffect(() => {
    dispatch(getRestaurant(token));
  }, [dispatch, token]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file && file.size > maxSizeBytes) {
      toast.error("File size exceeds 10MB limit. Please choose a smaller file.");
      e.target.value = "";
      setImageFile(undefined);
      setImageError("File exceeds 10MB limit.");
      return;
    }
    setImageError("");
    setImageFile(file);
  };

  const onSubmit = async (data) => {
    if (!imageFile) {
      setImageError("Menu image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("image", imageFile);

    await dispatch(createMenu(token, formData));
    reset();
    setImageFile(undefined);
    setImageError("");
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Restaurant Menu
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your dishes, prices, and food items.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <Button
            onClick={() => {
              reset();
              setImageFile(undefined);
              setImageError("");
              setOpen(true);
            }}
            className="h-11 px-5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Button>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Add New Dish
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Add an appetizing dish with price and photo to your menu.
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
                  Dish Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-foreground hover:file:bg-gray-200 cursor-pointer"
                />
                {imageError && (
                  <p className="text-destructive text-xs font-medium">
                    {imageError}
                  </p>
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
                      Adding Dish...
                    </span>
                  ) : (
                    "Add Dish"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menus Grid / List */}
      {!restaurant?.menus?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-gray-50/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border text-muted-foreground shadow-xs mb-4">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No dishes added yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Click &ldquo;Add Menu Item&rdquo; above to start building your
            restaurant&apos;s menu.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurant.menus.map((menu) => (
            <div
              key={menu._id}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={menu.imageUrl}
                    alt={menu.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-base line-clamp-1">
                      {menu.name}
                    </h3>
                    <span className="font-bold text-foreground text-base">
                      ₹{menu.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {menu.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMenu(menu);
                    setEditOpen(true);
                  }}
                  className="w-full h-10 text-xs font-semibold"
                >
                  Edit Dish
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMenuToDelete(menu);
                    setDeleteDialogOpen(true);
                  }}
                  className="w-full h-10 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Menu Item Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Delete Dish
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {menuToDelete?.name}
              </span>
              ? This dish will be permanently removed from your restaurant menu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setMenuToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                if (!menuToDelete?._id) return;
                setIsDeleting(true);
                const success = await dispatch(
                  deleteMenu(token, menuToDelete._id)
                );
                setIsDeleting(false);
                if (success) {
                  setDeleteDialogOpen(false);
                  setMenuToDelete(null);
                }
              }}
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Dish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
    </div>
  );
};

export default AddMenu;
