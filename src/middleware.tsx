import { type NextRequest, NextResponse } from "next/server";

import { stackServerApp } from "./stack";
import { NEXT_PUBLIC_API_KEY } from "./utils/environment";

export async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/api/public")) {
		const apiKey = request.headers.get("X-API-KEY");
		if (apiKey !== NEXT_PUBLIC_API_KEY) {
			return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
		}
		return NextResponse.next();
	}

	const user = await stackServerApp.getUser();
	if (!user) {
		return NextResponse.redirect(new URL("/handler/sign-in", request.url));
	}
	return NextResponse.next();
}

export const config = {
	// You can add your own route protection logic here
	// Make sure not to protect the root URL, as it would prevent users from accessing static Next.js files or Stack's /handler path
	matcher: ["/management/:path*", "/api/public/:path*"],
};
