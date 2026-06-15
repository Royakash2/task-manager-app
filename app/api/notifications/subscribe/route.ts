import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAblyTokenRequest } from "@/lib/ably";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const kindeUser = await getUser();
    if (!kindeUser || !kindeUser.id) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const tokenRequest = await getAblyTokenRequest(kindeUser.id);

    return NextResponse.json({ tokenRequest, userId: kindeUser.id });
  } catch (error) {
    console.error("Failed to generate Ably token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
