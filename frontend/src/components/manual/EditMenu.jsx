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
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { editMenu } from "@/apiServices/apiHandlers/menuAPI";

const EditMenu = ({ selectedMenu, editOpen, setEditOpen }) => {
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        name: "",
        description: "",
        price: 0,
        image: undefined,
    });
    const { name, description, price, image } = input;
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

    const EditMenuHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price.toString());
        if (image) {
            formData.append("image", image);
        }

        dispatch(editMenu(token,selectedMenu?._id, formData)).finally(() => {
            setLoading(false);
            setEditOpen(false);
        });
    };

    useEffect(() => {
        setInput({
            name: selectedMenu?.name || "",
            description: selectedMenu?.description || "",
            price: selectedMenu?.price || 0,
            image: undefined,
        });
    }, [selectedMenu]);

    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Menu</DialogTitle>
                    <DialogDescription>
                        Update your menu to keep your offerings fresh and exciting!
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={EditMenuHandler} className="space-y-4">
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
                                "Submit"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditMenu;
