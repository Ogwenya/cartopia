import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import sidebar_items from "@/components/account/sidebar-items";
import { ChevronRight } from "lucide-react";

const LargeScreenLayout = ({ data }) => {
	return (
		<div className="grid gap-5">
			{data.map((entry, index) => (
				<div className="grid gap-2 w-full" key={index}>
					<span className="text-sm font-semibold">{entry.label}</span>
					<p
						className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
							!entry.value && "text-red-500"
						}`}
					>
						{entry.value || "Not Provided"}
					</p>
				</div>
			))}
		</div>
	);
};

const SmallScreenLayout = ({ user }) => {
	return (
		<div>
			<div className=" flex items-center space-x-4 rounded-md border p-4 bg-card">
				<div className="flex-1 space-y-1">
					<p className="text-sm font-medium leading-none">
						{user.firstname} {user.lastname}
					</p>
					<p className="text-sm text-muted-foreground">
						{user.email}
					</p>
				</div>
			</div>

			<p className="px-4 py-2 text-xs uppercase font-semibold">
				My Account
			</p>

			<div className="bg-card">
				{sidebar_items
					.filter((item) => item.link !== "")
					.map((item, index) => (
						<Link
							key={index}
							href={`/account${item.link}`}
							className="flex items-center justify-between rounded-lg px-3 py-2 transition-all"
						>
							<span className="flex items-center gap-3">
								<item.icon className="h-4 w-4" />
								{item.label}
							</span>

							<ChevronRight className="w-4" />
						</Link>
					))}
			</div>
		</div>
	);
};

const AccountPage = async () => {
	const { user } = await getServerSession(authOptions);

	const data = [
		{ label: "Firstname", value: user.firstname },
		{ label: "Lastname", value: user.lastname },
		{ label: "Email", value: user.email },
		{ label: "Phone Number", value: user.phone_number },
	];

	return (
		<div>
			<div className="max-md:hidden">
				<LargeScreenLayout data={data} />
			</div>
			<div className="md:hidden">
				<SmallScreenLayout user={user} />
			</div>
		</div>
	);
};

export default AccountPage;
