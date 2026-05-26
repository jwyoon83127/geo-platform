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
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = supabase
      .from("mentions")
      .select("*, brands(name)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (brandId) {
      query = query.eq("brand_id", brandId);
    }

    if (sentiment) {
      query = query.eq("sentiment", sentiment);
    }

    const { data: mentions, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: mentions });
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
