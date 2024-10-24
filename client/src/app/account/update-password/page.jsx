"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submit-button";
import { useToast } from "@/hooks/use-toast";
import LoadingPage from "../loading";

const UpdatePassword = () => {
	const { status, data: session } = useSession();

	const { toast } = useToast();

	const [current_password, set_current_password] = useState("");
	const [new_password, set_new_password] = useState("");
	const [confirm_new_password, set_confirm_new_password] = useState("");
	const [loading, set_loading] = useState(false);

	const change_password = async () => {
		if (!current_password || !new_password || !confirm_new_password) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Fill all the fields.",
			});
			return;
		}

		try {
			set_loading(true);
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v0/client/users/update-password/${session.user.id}`,
				{
					method: "PATCH",
					body: JSON.stringify({
						current_password,
						new_password,
						confirm_new_password,
						account_type: "customer",
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session.access_token}`,
					},
				},
			);

			const result = await res.json();

			set_loading(false);

			if (result.error) {
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
				set_current_password("");
				set_new_password("");
				set_confirm_new_password("");
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
					<Label htmlFor="current_password">Current Password</Label>
					<Input
						id="current_password"
						type="password"
						value={current_password}
						onChange={(e) => set_current_password(e.target.value)}
						required
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="new_password">New Password</Label>
					<Input
						id="new_password"
						type="password"
						value={new_password}
						onChange={(e) => set_new_password(e.target.value)}
						required
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="confirm_new_password">
						Confirm New Password
					</Label>
					<Input
						id="confirm_new_password"
						type="password"
						value={confirm_new_password}
						onChange={(e) =>
							set_confirm_new_password(e.target.value)
						}
						required
					/>
				</div>
			</div>
			<SubmitButton
				className="mt-6 max-md:w-full"
				loading={loading}
				onClick={change_password}
			>
				Update Password
			</SubmitButton>
		</div>
	);
};

export default UpdatePassword;
