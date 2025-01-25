import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import HeroImage from "../../assets/hero_pizza_.png";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { createMenu } from "@/apiServices/apiHandlers/menuAPI";
import { getRestaurant } from "@/apiServices/apiHandlers/restaurantAPI";

const AddMenu = () => {
  const { restaurant } = useSelector((state) => state.restaurant);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [input, setInput] = useState({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });

  const { name, description, price, image } = input;
  const [open, setOpen] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInput((prevData) => ({
      ...prevData,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || undefined;
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file && file.size > maxSizeBytes) {
      toast.error(
        "File size exceeds 10MB limit. Please choose a smaller file."
      );
      e.target.value = "";
      return;
    }
    setInput((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }

    dispatch(createMenu(token, formData)).finally(() => {
      setLoading(false);
      setOpen(false);
    });
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      dispatch(getRestaurant(token));
    };
    fetchRestaurant();
  }, []);

  return (
    <div className="max-w-[90%] md:max-w-[80%] mx-auto  my-7 md:my-12 ">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menus
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2" />
            Add Menus
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddMenu} className="space-y-4">
              {/* Name */}
              <Label className="flex flex-col gap-2">
                <span>Name</span>
                <Input
                  required
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleOnChange}
                  placeholder="Enter menu name"
                />
              </Label>

              {/* Description */}
              <Label className="flex flex-col gap-2">
                <span>Description</span>
                <Input
                  required
                  type="text"
                  name="description"
                  value={description}
                  onChange={handleOnChange}
                  placeholder="Enter menu description"
                />
              </Label>

              {/* Price */}
              <Label className="flex flex-col gap-2">
                <span>Price in (Rupees)</span>
                <Input
                  required
                  type="number"
                  name="price"
                  value={price}
                  onChange={handleOnChange}
                  placeholder="Enter menu price"
                />
              </Label>

              {/* Image */}
              <Label className="flex flex-col gap-2">
                <span>Upload Menu Image</span>
                <Input
                  required
                  onChange={handleFileChange}
                  type="file"
                  accept="image/*"
                  name="image"
                />
              </Label>

              <DialogFooter className="mt-5">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Add Menu"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {restaurant?.menus.map((menu, idx) => (
        <div key={idx} className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
            <img
              src={menu?.imageUrl}
              alt="Menu Image"
              className="md:h-24 md:w-24 h-32 w-full object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-lg mt-1 md:mt-0 font-semibold text-gray-800">
                {menu?.name}
              </h1>
              <p className="text-sm tex-gray-600 mt-1">{menu?.description}</p>
              <h2 className="text-md font-semibold mt-2">
                Price: <span className="text-[#D19254]">{menu?.price}</span>
              </h2>
            </div>
            <Button className="text-base mt-2">Edit</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddMenu;
