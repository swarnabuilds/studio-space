import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createStudio, getStudios } from "@/lib/studios-api";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const email = session?.user?.email?.toLowerCase();

    const { searchParams } = new URL(request.url);
    const query: any = {
      sort: (searchParams.get("sort") as any) || "newest",
    };

    if (searchParams.get("search")) query.search = searchParams.get("search");
    if (searchParams.get("category")) query.category = searchParams.get("category");
    if (searchParams.get("ownerEmail")) {
      const owner = searchParams.get("ownerEmail")?.toLowerCase();
      if (email && owner && email !== owner) {
        return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
      }
      if (owner) query.ownerEmail = owner;
    }
    if (searchParams.get("minPrice")) query.minPrice = Number(searchParams.get("minPrice"));
    if (searchParams.get("maxPrice")) query.maxPrice = Number(searchParams.get("maxPrice"));
    if (searchParams.get("minCapacity")) query.minCapacity = Number(searchParams.get("minCapacity"));
    if (searchParams.get("minRating")) query.minRating = Number(searchParams.get("minRating"));
    if (searchParams.get("limit")) query.limit = Number(searchParams.get("limit"));

    const result = await getStudios(query);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const email = session?.user?.email;
    const name = session?.user?.name;

    const body = await request.json();
    const result = await createStudio({
      ...body,
      ownerEmail: body.ownerEmail || email || "",
      ownerName: body.ownerName || name || "",
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Failed" }, { status: 500 });
  }
}
