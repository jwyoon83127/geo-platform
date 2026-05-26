import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { analyzeMention } from "@/lib/ai/openai";

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: mention, error } = await supabase
      .from("mentions")
      .select("*, brands(name)")
      .eq("id", id)
      .single();

    if (error || !mention) {
      return NextResponse.json(
        { error: "Mention not found" },
        { status: 404 }
      );
    }

    const analysis = await analyzeMention(
      mention.content,
      mention.brands?.name || ""
    );

    const { error: updateError } = await supabase
      .from("mentions")
      .update({
        sentiment: analysis.sentiment,
        analyzed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: analysis });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
