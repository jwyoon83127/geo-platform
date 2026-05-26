import { NextResponse } from "next/server";
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

export async function POST() {
  try {
    const { data: mentions, error } = await supabase
      .from("mentions")
      .select("*, brands(name)")
      .is("analyzed_at", null)
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const results = [];
    for (const mention of mentions || []) {
      try {
        const analysis = await analyzeMention(
          mention.content,
          mention.brands?.name || ""
        );
        await supabase
          .from("mentions")
          .update({
            sentiment: analysis.sentiment,
            analyzed_at: new Date().toISOString(),
          })
          .eq("id", mention.id);
        results.push({
          id: mention.id,
          status: "success",
          sentiment: analysis.sentiment,
        });
      } catch (err: any) {
        results.push({
          id: mention.id,
          status: "error",
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      data: results,
      total: results.length,
      success: results.filter((r) => r.status === "success").length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Batch analysis failed" },
      { status: 500 }
    );
  }
}
