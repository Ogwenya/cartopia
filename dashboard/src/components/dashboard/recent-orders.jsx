import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import format_currency from "@/lib/format-currency";
import { badge_color } from "@/lib/order-status-color";
import { cn } from "@/lib/utils";

const RecentOrders = ({ orders }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => (
          <TableRow key={index}>
            <TableCell>{`${order.customer.firstname} ${order.customer.lastname}`}</TableCell>
            <TableCell>
              <Badge className={cn("w-fit", badge_color(order.status))}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {format_currency(order.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentOrders;
