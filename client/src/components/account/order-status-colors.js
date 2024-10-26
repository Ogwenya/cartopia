export const badge_color = (status) => {
	return status === "PENDING"
		? "border-transparent bg-blue-400 text-destructive-foreground hover:bg-blue-400/80"
		: status === "PROCESSING"
		? "border-transparent bg-orange-400 text-destructive-foreground hover:bg-orange-400/80"
		: status === "SHIPPED"
		? "border-transparent bg-yellow-400 text-destructive-foreground hover:bg-yellow-400/80"
		: status === "COMPLETED"
		? "border-transparent bg-green-400 text-destructive-foreground hover:bg-green-400/80"
		: "border-transparent bg-red-400 text-destructive-foreground hover:bg-red-400/80";
};

export const button_color = (status) => {
	return status === "PENDING"
		? "border-blue-400 hover:text-destructive-foreground hover:bg-blue-400"
		: status === "PROCESSING"
		? "border-orange-400 hover:text-destructive-foreground hover:bg-orange-400"
		: status === "SHIPPED"
		? "border-yellow-400 hover:text-destructive-foreground hover:bg-yellow-400"
		: status === "COMPLETED"
		? "border-green-400 hover:text-destructive-foreground hover:bg-green-400"
		: "border-destructive hover:text-destructive-foreground hover:bg-destructive";
};
