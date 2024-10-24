"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import LoadingPage from "../loading";

const EditDetails = () => {
	const { status, data: session, update: updateSession } = useSession();

	const { toast } = useToast();

	const [firstname, set_firstname] = useState(session?.user.firstname);
	const [lastname, set_lastname] = useState(session?.user.lastname);
	const [email, set_email] = useState(session?.user.email);
	const [phone_number, set_phone_number] = useState(
		session?.user.phone_number,
	);
	const [loading, set_loading] = useState(false);

	const update_details = async () => {
		if (!firstname || !lastname || !email) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Firstname, Lastname and Email must be provided.",
			});
			return;
		}

		try {
			set_loading(true);
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v0/client/users/${session.user.id}`,
				{
					method: "PATCH",
					body: JSON.stringify({
						firstname,
						lastname,
						email,
						phone_number,
						account_type: "customer",
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session.access_token}`,
					},
				},
			);

			const result = await res.json();

			if (result.error) {
				set_loading(false);
				toast({
					variant: "destructive",
					title: "Error",
					description: Array.isArray(result.message)
						? result.message[0]
						: result.message,
				});
			} else {
				toast({
					variant: "success",
					title: "Success",
					description: result.message,
				});
				await updateSession(result.access_token);
				set_loading(false);
			}
		} catch (error) {
			set_loading(false);
			toast({
				variant: "destructive",
				title: "Error",
				description: error.message,
			});
		}
	};

	if (status === "loading") {
		return <LoadingPage />;
	}

	return (
		<div>
			<div className="grid gap-8">
				<div className="grid gap-2">
					<Label htmlFor="firstname">Firstname</Label>
					<Input
						id="firstname"
						type="text"
						value={firstname}
						onChange={(e) => set_firstname(e.target.value)}
						required
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="lastname">Lastname</Label>
					<Input
						id="lastname"
						type="text"
						value={lastname}
						onChange={(e) => set_lastname(e.target.value)}
						required
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						value={email}
						onChange={(e) => set_email(e.target.value)}
						required
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="phone_number">Phone Number</Label>
					<Input
						id="phone_number"
						type="tel"
						value={phone_number}
						onChange={(e) => set_phone_number(e.target.value)}
						required
					/>
				</div>
			</div>
			<SubmitButton
				className="mt-6 max-md:w-full"
				loading={loading}
				onClick={update_details}
			>
				Save Changes
			</SubmitButton>
		</div>
	);
};

export default EditDetails;
