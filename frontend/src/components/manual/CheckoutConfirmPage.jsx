import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";

const CheckoutConfirmPage = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="font-semibold">Review Your Order</DialogTitle>
        <DialogDescription className="text-xs">
          Double-check your delivery details and ensure everything is in order.
          When you are ready, hit confirm button to finalize your order
        </DialogDescription>

        <form className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0">
          <div>
            <Label>Fullname</Label>
            <Input type="text" name="name" />
          </div>

          <div>
            <Label>Email</Label>
            <Input disabled type="email" name="email" />
          </div>
          <div>
            <Label>Contact</Label>
            <Input type="text" name="contact" />
          </div>

          <div>
            <Label>Address</Label>
            <Input type="text" name="address" />
          </div>

          <div>
            <Label>City</Label>
            <Input type="text" name="city" />
          </div>
          <div>
            <Label>Country</Label>
            <Input type="text" name="country" />
          </div>

          <DialogFooter className="col-span-2 pt-5">
            <Button disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Continue To Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmPage;
