export interface Brand {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  keywords: string[];
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export interface Mention {
  id: string;
  brand_id: string;
  source: string;
  content: string;
  url: string | null;
  author: string | null;
  sentiment: "positive" | "negative" | "neutral";
  reach: number;
  created_at: string;
  analyzed_at: string | null;
}

export interface MentionWithBrand extends Mention {
  brands: Pick<Brand, "name"> | null;
}

export interface AnalyticsSummary {
  total_mentions: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  avg_reach: number;
  period_start: string;
  period_end: string;
}

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: Brand;
        Insert: Omit<Brand, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Brand, "id" | "created_at" | "updated_at">>;
      };
      mentions: {
        Row: Mention;
        Insert: Omit<Mention, "id" | "created_at" | "analyzed_at">;
        Update: Partial<Omit<Mention, "id" | "created_at" | "analyzed_at">>;
      };
    };
  };
}
