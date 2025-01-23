import { useState } from "react";
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

const AddMenu = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-[90%] md:max-w-[80%] mx-auto  my-7 md:my-12 ">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menus
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2" />
              Add Menus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4">
              {/* Name */}
              <Label className="flex flex-col gap-2">
                <span>Name</span>
                <Input type="text" name="name" placeholder="Enter menu name" />
              </Label>

              {/* Description */}
              <Label className="flex flex-col gap-2">
                <span>Description</span>
                <Input
                  type="text"
                  name="description"
                  placeholder="Enter menu description"
                />
              </Label>

              {/* Price */}
              <Label className="flex flex-col gap-2">
                <span>Price in (Rupees)</span>
                <Input
                  type="number"
                  name="price"
                  placeholder="Enter menu price"
                />
              </Label>

              {/* Image */}
              <Label className="flex flex-col gap-2">
                <span>Upload Menu Image</span>
                <Input type="file" name="image" />
              </Label>

              <DialogFooter className="mt-5">
                <Button disabled={loading}>
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

      <div className="mt-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
          <img
            src={HeroImage}
            alt=""
            className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-800">Menu Name</h1>
            <p className="text-sm tex-gray-600 mt-1">Menu Description</p>
            <h2 className="text-md font-semibold mt-2">
              Price: <span className="text-[#D19254]">80</span>
            </h2>
          </div>
          <Button className="text-base mt-2">Edit</Button>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
