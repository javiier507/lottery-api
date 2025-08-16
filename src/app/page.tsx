import Link from "next/link";
import { stackServerApp } from "@/stack";

export const dynamic = "force-dynamic";

export default async function Home() {
	const user = await stackServerApp.getUser();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md text-center p-6 bg-white rounded-lg shadow-lg">
				<h1 className="text-3xl font-bold text-gray-800 break-words">
					{user ? `Hello ${user.primaryEmail || "user"}` : "Hello"}
				</h1>
				{user ? (
					<div className="mt-6">
						<Link
							href="/management"
							className="text-2xl text-blue-500 hover:text-blue-700 underline block py-2 font-semibold"
						>
							Management
						</Link>
					</div>
				) : null}
			</div>
		</div>
	);
}
