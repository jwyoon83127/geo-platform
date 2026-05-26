-- ============================================================
-- Geo Platform - Initial Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- brands
-- ------------------------------------------------------------
CREATE TABLE brands (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  website     TEXT,
  keywords    TEXT[] DEFAULT '{}',
  logo_url    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE brands IS '추적 대상 브랜드';
COMMENT ON COLUMN brands.keywords IS '멘션 검색 키워드 배열';

-- ------------------------------------------------------------
-- mentions
-- ------------------------------------------------------------
CREATE TABLE mentions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id    UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  source      TEXT NOT NULL,
  content     TEXT NOT NULL,
  url         TEXT,
  author      TEXT,
  sentiment   TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')) DEFAULT 'neutral',
  reach       INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  analyzed_at TIMESTAMPTZ
);

COMMENT ON TABLE mentions IS '브랜드 멘션 (SNS, 뉴스, 커뮤니티 등)';
COMMENT ON COLUMN mentions.source IS '멘션 출처 (Twitter, Reddit, News 등)';
COMMENT ON COLUMN mentions.sentiment IS '감성 분석 결과';
COMMENT ON COLUMN mentions.reach IS '예상 도달 수';

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
CREATE INDEX idx_mentions_brand_id   ON mentions(brand_id);
CREATE INDEX idx_mentions_sentiment  ON mentions(sentiment);
CREATE INDEX idx_mentions_created_at ON mentions(created_at DESC);
CREATE INDEX idx_mentions_source     ON mentions(source);
CREATE INDEX idx_brands_user_id      ON brands(user_id);

-- ------------------------------------------------------------
-- Row Level Security (RLS)
-- ------------------------------------------------------------
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;

-- brands policies
CREATE POLICY "Users can view own brands"
  ON brands FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brands"
  ON brands FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands"
  ON brands FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
  ON brands FOR DELETE
  USING (auth.uid() = user_id);

-- mentions policies (brand 소유자 기준)
CREATE POLICY "Users can view mentions of own brands"
  ON mentions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = mentions.brand_id
        AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert mentions of own brands"
  ON mentions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = mentions.brand_id
        AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update mentions of own brands"
  ON mentions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = mentions.brand_id
        AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete mentions of own brands"
  ON mentions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = mentions.brand_id
        AND brands.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- updated_at 자동 갱신 트리거
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
