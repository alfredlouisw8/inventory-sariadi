import LoginForm from "@/components/auth/login-form";

export default function Home() {
	return (
		<div className="container mx-auto flex items-center h-screen justify-center">
			<div className="max-w-[600px] w-full">
				<LoginForm />
			</div>
		</div>
	);
}
