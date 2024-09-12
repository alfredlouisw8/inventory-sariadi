import LoginForm from "@/components/auth/login-form";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
	const session = await auth();

	if (session) {
		redirect("/customers");
	}

	return (
		<div className="container mx-auto flex items-center h-screen justify-center">
			<div className="max-w-[600px] w-full">
				<LoginForm />
			</div>
		</div>
	);
}
