import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const Cart = () => {
  return (
    <div className="flex flex-col max-w-[90%] mx-auto my-7 md:my-10 ">
      <div className="flex justify-end">
        <Button variant="link">Clear All</Button>
      </div>

      <Table>
      <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
        <TableRow>
        <TableCell>
        <Avatar>
                  <AvatarImage  alt="" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
        </TableCell>
        </TableRow>

        </TableBody>
      </Table>
    </div>
  );
};

export default Cart;
