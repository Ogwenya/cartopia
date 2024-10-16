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
            <TableCell>{`${order.Customer.firstname} ${order.Customer.lastname}`}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === "PENDING"
                    ? "pending"
                    : order.status === "COMPLETED"
                    ? "success"
                    : "destructive"
                }
              >
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
