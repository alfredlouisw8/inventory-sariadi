"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export default function BackButton() {
	return (
		<Button onClick={() => history.back()} variant="ghost" className="w-fit">
			<ArrowLeft className="h-4 w-4" />
		</Button>
	);
}
