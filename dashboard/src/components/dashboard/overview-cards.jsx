import { DollarSign, ShoppingBag, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import format_currency from "@/lib/format-currency";

const OverviewCards = ({
  total_revenue,
  total_orders,
  complete_orders,
  cancelled_orders,
}) => {
  const overview = [
    {
      icon: DollarSign,
      title: "Total Revenue",
      statistic: format_currency(total_revenue),
      footer: "Based on complete orders",
    },
    {
      icon: CreditCard,
      title: "Total Orders",
      statistic: new Intl.NumberFormat("en-US").format(total_orders),
    },
    {
      icon: ShoppingBag,
      title: "Complete Orders",
      statistic: new Intl.NumberFormat("en-US").format(complete_orders),
    },
    {
      icon: ShoppingBag,
      title: "Cancelled Orders",
      statistic: new Intl.NumberFormat("en-US").format(cancelled_orders),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {overview.map((data) => (
        <Card key={data.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
            <data.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{data.statistic}</div>
            {data.footer && (
              <p className="text-xs text-muted-foreground">{data.footer}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewCards;
