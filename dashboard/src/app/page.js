import { getMonth, format, getYear } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OverviewCards from "@/components/dashboard/overview-cards";
import RecentOrders from "@/components/dashboard/recent-orders";
import CalendarInput from "@/components/dashboard/calendar-input";
import RevenueOverviewGraph from "@/components/dashboard/revenue-graph";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

async function getData(searchParams) {
  let selected_date;

  if (!searchParams.date) {
    selected_date = format(new Date(), "MM/dd/yyyy");
  } else {
    const [month, year] = searchParams.date.split("-");

    if (
      !months.includes(month) ||
      Number(year) === NaN ||
      Number(year) > new Date().getFullYear()
    ) {
      selected_date = format(new Date(), "MM/dd/yyyy");
    } else {
      selected_date = format(searchParams.date, "MM/dd/yyyy");
    }
  }

  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin?date=${selected_date}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["dashboard"] },
    },
  );

  const result = await response.json();

  if (result.error) {
    throw new Error(result.message);
  }

  return { result, selected_date };
}

export default async function Home({ searchParams }) {
  const { result, selected_date } = await getData(searchParams);

  const month = getMonth(selected_date);
  const year = getYear(selected_date);

  const {
    total_revenue,
    total_orders,
    complete_orders,
    latest_orders,
    sales_overview,
    cancelled_orders,
  } = result;

  return (
    <div className="space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {months[month]}, {year}
        </h2>
        <div className="flex items-center space-x-2">
          <CalendarInput />
        </div>
      </div>
      <div className="space-y-4">
        <OverviewCards
          total_revenue={total_revenue}
          total_orders={total_orders}
          complete_orders={complete_orders}
          cancelled_orders={cancelled_orders}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <RevenueOverviewGraph data={sales_overview} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {latest_orders.length > 0 ? (
                <RecentOrders orders={latest_orders} />
              ) : (
                <CardDescription>No new Orders.</CardDescription>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
