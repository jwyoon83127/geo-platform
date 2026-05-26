import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
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

  try {
    const brands = [
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "Acme Corporation",
        description: "글로벌 제조 및 유통 기업. 다양한 산업 분야에서 혁신적인 제품을 제공합니다.",
        website: "https://acme.example.com",
        keywords: ["acme", "acmecorp", "acme corp"],
      },
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        name: "Globex Industries",
        description: "첨단 기술 및 소프트웨어 솔루션 기업. 클라우드 서비스와 AI 플랫폼을 전문으로 합니다.",
        website: "https://globex.example.com",
        keywords: ["globex", "globex tech", "globex industries"],
      },
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
        name: "Initech Solutions",
        description: "IT 인프라 및 엔터프라이즈 컨설팅 기업. 중견기업의 디지털 전환을 지원합니다.",
        website: "https://initech.example.com",
        keywords: ["initech", "initech solutions"],
      },
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
        name: "Hooli Technologies",
        description: "빅데이터 및 검색 엔진 기술 기업. 혁신적인 데이터 플랫폼을 제공합니다.",
        website: "https://hooli.example.com",
        keywords: ["hooli", "hooli tech"],
      },
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15",
        name: "Stark Industries",
        description: "첨단 방위산업 및 에너지 기술 기업. 지속 가능한 미래 기술을 개발합니다.",
        website: "https://stark.example.com",
        keywords: ["stark", "stark industries", "stark ind"],
      },
    ];

    const { error: brandsError } = await supabase
      .from("brands")
      .upsert(brands, { onConflict: "id" });

    if (brandsError) throw brandsError;

    const mentions = [
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        source: "Twitter",
        content: "Acme의 신제품 라인업이 정말 인상적이네요! 품질이 예전보다 훨씬 좋아졌어요. #acme #review",
        url: "https://twitter.com/user1/status/123",
        author: "user1",
        sentiment: "positive",
        reach: 1250,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        source: "Reddit",
        content: "Acme 제품을 5년째 사용 중인데, 이번 업데이트가 가장 마음에 듭니다. 가격 대비 성능이 최고.",
        author: "reddit_user_42",
        sentiment: "positive",
        reach: 890,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        source: "News",
        content: "Acme Corporation, 2025년 1분기 매출 전망 상회... 글로벌 시장 점유율 확대",
        url: "https://news.example.com/acme-earnings",
        author: "기자 김민수",
        sentiment: "positive",
        reach: 15000,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        source: "Twitter",
        content: "Acme 고객센터에 문의했는데 답변이 느리네요. 개선이 필요해 보입니다.",
        url: "https://twitter.com/user2/status/456",
        author: "user2",
        sentiment: "negative",
        reach: 320,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        source: "Twitter",
        content: "Globex의 클라우드 플랫폼 마이그레이션 서비스 덕분에 우리 회사 비용 30% 절감했어요!",
        url: "https://twitter.com/techlead/status/789",
        author: "techlead_kim",
        sentiment: "positive",
        reach: 2100,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        source: "Reddit",
        content: "Globex AI 플랫폼 사용 후기입니다. 초기 설정이 복잡하지만, 한번 익숙해지면 정말 강력합니다.",
        author: "dev_sniper",
        sentiment: "neutral",
        reach: 560,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        source: "News",
        content: "Globex Industries, 새로운 AI 언어 모델 발표... 업무 자동화 분야 강화",
        url: "https://news.example.com/globex-ai",
        author: "기자 이수진",
        sentiment: "positive",
        reach: 22000,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
        source: "Twitter",
        content: "Initech 컨설팅 받았는데, 제안해준 솔루션이 우리 회사와 안 맞았어요. 커스터마이징이 약한 느낌.",
        url: "https://twitter.com/ceo_smith/status/101",
        author: "ceo_smith",
        sentiment: "negative",
        reach: 450,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
        source: "Reddit",
        content: "Initech의 보안 감사 서비스는 업계 최고 수준이라고 들었습니다. 실제로 써보신 분 계신가요?",
        author: "security_pro",
        sentiment: "neutral",
        reach: 780,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
        source: "News",
        content: "Initech Solutions, 중견기업 대상 묘듈 교육 프로그램 론칭",
        url: "https://news.example.com/initech-edu",
        author: "기자 박지훈",
        sentiment: "positive",
        reach: 8500,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
        source: "Twitter",
        content: "Hooli 검색 엔진의 신규 알고리즘 업데이트 이후 결과물 질이 떨어졌어요. 이전 버전이 더 나았음.",
        url: "https://twitter.com/search_guru/status/202",
        author: "search_guru",
        sentiment: "negative",
        reach: 670,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
        source: "Twitter",
        content: "Hooli 데이터 시각화 도구가 무료로 풀렸네요? 스타트업에겐 정말 큰 도움이 됩니다!",
        url: "https://twitter.com/startup_kr/status/303",
        author: "startup_kr",
        sentiment: "positive",
        reach: 3400,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
        source: "News",
        content: "Hooli Technologies, 개인정보 보호 강화 조치 발표",
        url: "https://news.example.com/hooli-privacy",
        author: "기자 정미래",
        sentiment: "neutral",
        reach: 18000,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15",
        source: "Twitter",
        content: "Stark의 신재생 에너지 기술이 진짜 미래를 바꿀 것 같아요. 투자 가치 충분합니다.",
        url: "https://twitter.com/investor_lee/status/404",
        author: "investor_lee",
        sentiment: "positive",
        reach: 5600,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15",
        source: "Reddit",
        content: "Stark 방산 제품의 내구성 테스트 결과가 공개되었습니다. 예상보다 훨씬 우수한 성능을 보였습니다.",
        author: "defense_watcher",
        sentiment: "positive",
        reach: 1200,
      },
      {
        brand_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15",
        source: "News",
        content: "Stark Industries, 태양광 효율 30% 돌파... 세계 신기록 경신",
        url: "https://news.example.com/stark-solar",
        author: "기자 한소희",
        sentiment: "positive",
        reach: 35000,
      },
    ];

    const { error: mentionsError } = await supabase
      .from("mentions")
      .upsert(mentions, { onConflict: "id" });

    if (mentionsError) throw mentionsError;

    return NextResponse.json({
      success: true,
      data: {
        brands: brands.length,
        mentions: mentions.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
