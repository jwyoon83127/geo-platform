import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id");
    const sentiment = searchParams.get("sentiment");
    const source = searchParams.get("source");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("mentions")
      .select("*, brands(name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (brandId) {
      query = query.eq("brand_id", brandId);
    }

    if (sentiment) {
      query = query.eq("sentiment", sentiment);
    }

    if (source) {
      query = query.eq("source", source);
    }

    const { data: mentions, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: mentions, count: count || 0 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch mentions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("mentions")
      .insert({
        brand_id: body.brand_id,
        source: body.source,
        content: body.content,
        url: body.url,
        author: body.author,
        sentiment: body.sentiment || "neutral",
        reach: body.reach || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create mention" },
      { status: 500 }
    );
  }
}
