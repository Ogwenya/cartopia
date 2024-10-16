"use client";

import { forwardRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CalendarInput() {
  const router = useRouter();
  const pathname = usePathname();
  const [selected_date, set_selected_date] = useState(new Date());

  const Custom_input = forwardRef(({ value, onClick }, ref) => (
    <Button variant="outline" onClick={onClick} ref={ref}>
      <Calendar className="mr-2 h-4 w-4" />
      {value}
    </Button>
  ));

  Custom_input.displayName = Custom_input;

  return (
    <DatePicker
      selected={selected_date}
      onChange={(date) => {
        set_selected_date(date);
        router.push(`${pathname}?date=${format(date, "MMMM-y")}`);
      }}
      dateFormat="MM/yyyy"
      maxDate={new Date()}
      showMonthYearPicker
      customInput={<Custom_input />}
    />
  );
}
