-- ============================================================
-- Geo Platform — Development Seed Data
-- Run this in Supabase SQL Editor after migrations
-- ============================================================

-- Clear existing data (optional, for clean seed)
-- TRUNCATE TABLE mentions, brands CASCADE;

-- ------------------------------------------------------------
-- Seed Brands
-- ------------------------------------------------------------
INSERT INTO brands (id, name, description, website, keywords, created_at, updated_at) VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Acme Corporation',
    '글로벌 제조 및 유통 기업. 다양한 산업 분야에서 혁신적인 제품을 제공합니다.',
    'https://acme.example.com',
    ARRAY['acme', 'acmecorp', 'acme corp'],
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Globex Industries',
    '첨단 기술 및 소프트웨어 솔루션 기업. 클라우드 서비스와 AI 플랫폼을 전문으로 합니다.',
    'https://globex.example.com',
    ARRAY['globex', 'globex tech', 'globex industries'],
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '25 days'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Initech Solutions',
    'IT 인프라 및 엔터프라이즈 컨설팅 기업. 중견기업의 디지털 전환을 지원합니다.',
    'https://initech.example.com',
    ARRAY['initech', 'initech solutions'],
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'Hooli Technologies',
    '빅데이터 및 검색 엔진 기술 기업. 혁신적인 데이터 플랫폼을 제공합니다.',
    'https://hooli.example.com',
    ARRAY['hooli', 'hooli tech'],
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'Stark Industries',
    '첨단 방위산업 및 에너지 기술 기업. 지속 가능한 미래 기술을 개발합니다.',
    'https://stark.example.com',
    ARRAY['stark', 'stark industries', 'stark ind'],
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  );

-- ------------------------------------------------------------
-- Seed Mentions
-- ------------------------------------------------------------
INSERT INTO mentions (brand_id, source, content, url, author, sentiment, reach, created_at) VALUES
  -- Acme Corporation
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Twitter', 'Acme의 신제품 라인업이 정말 인상적이네요! 품질이 예전보다 훨씬 좋아졌어요. #acme #review', 'https://twitter.com/user1/status/123', 'user1', 'positive', 1250, NOW() - INTERVAL '2 hours'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Reddit', 'Acme 제품을 5년째 사용 중인데, 이번 업데이트가 가장 마음에 듭니다. 가격 대비 성능이 최고.', NULL, 'reddit_user_42', 'positive', 890, NOW() - INTERVAL '5 hours'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'News', 'Acme Corporation, 2025년 1분기 매출 전망 상회... 글로벌 시장 점유율 확대', 'https://news.example.com/acme-earnings', '기자 김민수', 'positive', 15000, NOW() - INTERVAL '1 day'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Twitter', 'Acme 고객센터에 문의했는데 답변이 느리네요. 개선이 필요해 보입니다.', 'https://twitter.com/user2/status/456', 'user2', 'negative', 320, NOW() - INTERVAL '3 hours'),

  -- Globex Industries
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Twitter', 'Globex의 클라우드 플랫폼 마이그레이션 서비스 덕분에 우리 회사 비용 30% 절감했어요!', 'https://twitter.com/techlead/status/789', 'techlead_kim', 'positive', 2100, NOW() - INTERVAL '1 hour'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Reddit', 'Globex AI 플랫폼 사용 후기입니다. 초기 설정이 복잡하지만, 한번 익숙해지면 정말 강력합니다.', NULL, 'dev_sniper', 'neutral', 560, NOW() - INTERVAL '8 hours'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'News', 'Globex Industries, 새로운 AI 언어 모델 발표... 업무 자동화 분야 강화', 'https://news.example.com/globex-ai', '기자 이수진', 'positive', 22000, NOW() - INTERVAL '2 days'),

  -- Initech Solutions
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Twitter', 'Initech 컨설팅 받았는데, 제안해준 솔루션이 우리 회사와 안 맞았어요. 커스터마이징이 약한 느낌.', 'https://twitter.com/ceo_smith/status/101', 'ceo_smith', 'negative', 450, NOW() - INTERVAL '6 hours'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Reddit', 'Initech의 보안 감사 서비스는 업계 최고 수준이라고 들었습니다. 실제로 써보신 분 계신가요?', NULL, 'security_pro', 'neutral', 780, NOW() - INTERVAL '12 hours'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'News', 'Initech Solutions, 중견기업 대상 묘듈 교육 프로그램 론칭', 'https://news.example.com/initech-edu', '기자 박지훈', 'positive', 8500, NOW() - INTERVAL '3 days'),

  -- Hooli Technologies
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Twitter', 'Hooli 검색 엔진의 신규 알고리즘 업데이트 이후 결과물 질이 떨어졌어요. 이전 버전이 더 나았음.', 'https://twitter.com/search_guru/status/202', 'search_guru', 'negative', 670, NOW() - INTERVAL '4 hours'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Twitter', 'Hooli 데이터 시각화 도구가 무료로 풀렸네요? 스타트업에겐 정말 큰 도움이 됩니다!', 'https://twitter.com/startup_kr/status/303', 'startup_kr', 'positive', 3400, NOW() - INTERVAL '30 minutes'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'News', 'Hooli Technologies, 개인정보 보호 강화 조치 발표', 'https://news.example.com/hooli-privacy', '기자 정미래', 'neutral', 18000, NOW() - INTERVAL '1 day'),

  -- Stark Industries
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Twitter', 'Stark의 신재생 에너지 기술이 진짜 미래를 바꿀 것 같아요. 투자 가치 충분합니다.', 'https://twitter.com/investor_lee/status/404', 'investor_lee', 'positive', 5600, NOW() - INTERVAL '2 hours'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Reddit', 'Stark 방산 제품의 내구성 테스트 결과가 공개되었습니다. 예상보다 훨씬 우수한 성능을 보였습니다.', NULL, 'defense_watcher', 'positive', 1200, NOW() - INTERVAL '10 hours'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'News', 'Stark Industries, 태양광 효율 30% 돌파... 세계 신기록 경신', 'https://news.example.com/stark-solar', '기자 한소희', 'positive', 35000, NOW() - INTERVAL '5 hours');
