"use client";

import { useState } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitButton from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import revalidate_data from "@/app/actions";

const DeleteAddress = ({ access_token, address }) => {
	const [modal_open, set_modal_open] = useState(false);
	const [loading, set_loading] = useState(false);
	const [error, set_error] = useState(null);

	const delete_address = async () => {
		try {
			set_error(null);
			set_loading(true);

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v0/client/addresses/${address.id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				},
			);

			const result = await res.json();

			set_loading(false);

			if (result.error) {
				set_error(
					Array.isArray(result.message)
						? result.message[0]
						: result.message,
				);
			} else {
				set_error(null);
				set_modal_open(false);
				revalidate_data("addresses");
			}
		} catch (error) {
			set_loading(false);
			set_error(error.message);
		}
	};

	return (
		<AlertDialog open={modal_open} onOpenChange={set_modal_open}>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Trash2 className="h-4 w-4 stroke-destructive" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm brand deletion.</AlertDialogTitle>
					<AlertDialogDescription>
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
					</AlertDialogDescription>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete the address from the database.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<SubmitButton
						variant="destructive"
						loading={loading}
						onClick={delete_address}
					>
						Delete Brand
					</SubmitButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteAddress;
