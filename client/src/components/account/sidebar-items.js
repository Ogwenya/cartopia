import {
  Heart,
  Lock,
  MapPin,
  ShoppingBag,
  TicketPercent,
  User,
  UserCog,
} from "lucide-react";

const sidebar_items = [
  { label: "Account", link: "", icon: User },
  { label: "Edit Details", link: "/edit", icon: UserCog },
  { label: "Update Password", link: "/update-password", icon: Lock },
  { label: "Orders", link: "/orders", icon: ShoppingBag },
  { label: "Vouchers", link: "/vouchers", icon: TicketPercent },
  { label: "Address Book", link: "/addresses", icon: MapPin },
  { label: "Wish List", link: "/wish-list", icon: Heart },
];

export default sidebar_items;
