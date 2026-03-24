export interface TeamMemberProfile {
  id: string;
  name: string;
  role: string;
  quote: string;
  age: number;
  gender: string;
  years: number;
  dept: string;
  position: string;
  description: string;
  tags: string[];
  isFullTime: boolean;
}

export const teamMembers: TeamMemberProfile[] = [
  {
    id: "kimjihun",
    name: "김지훈",
    role: "선임 (IT데이터팀)",
    quote: "합리와 효율이 먼저죠. 명확한 데이터만 주시면 다 구현해 드립니다.",
    age: 32,
    gender: "남성",
    years: 5,
    dept: "IT데이터팀",
    position: "데이터 엔지니어 (백엔드 아키텍처 및 API 연동 담당)",
    description: "뛰어난 개발 역량을 갖춘 MZ세대 에이스. 명확한 R&R과 효율을 중시함.",
    tags: ["#개인주의", "#칼퇴요정", "#효율성_최우선", "#R&R_명확히", "#감정보다_논리"],
    isFullTime: true,
  },
  {
    id: "parksojin",
    name: "박소진",
    role: "책임 (마케팅전략팀)",
    quote: "우리 마케팅팀 본연의 업무에 지장이 가면 안 되는데요.",
    age: 41,
    gender: "여성",
    years: 15,
    dept: "마케팅전략팀",
    position: "시니어 마케터 (신규 캠페인 기획 및 성과 분석 리딩)",
    description: "마케팅 트렌드에 빠삭하지만, 방어적이고 본래 소속 팀의 안위를 1순위로 생각함.",
    tags: ["#방어기제_만렙", "#본업우선주의", "#마케팅_전문가", "#리스크_회피", "#깐깐한_검토"],
    isFullTime: true,
  },
  {
    id: "leeminsu",
    name: "이민수",
    role: "책임 (고객가치혁신팀)",
    quote: "우리 PM님이 시키시는 대로 하는게 제 역할이죠.",
    age: 46,
    gender: "남성",
    years: 20,
    dept: "고객가치혁신팀",
    position: "VOC 운영 파트 (PM과 동일 부서 소속의 고참 선배)",
    description: "PM과 같은 부서 출신. 성실하지만 수동적이며, 스스로 의사결정하는 것을 꺼림.",
    tags: ["#수동적_실행러", "#갈등회피형", "#가이드_집착", "#안전제일", "#착한_선배"],
    isFullTime: true,
  },
  {
    id: "choiyura",
    name: "최유라",
    role: "선임 (글로벌CS팀)",
    quote: "해외 지사 VOC 취합은 제가 꽉 잡고 있습니다. 근데 AI는 잘 몰라요.",
    age: 29,
    gender: "여성",
    years: 6,
    dept: "글로벌CS팀",
    position: "VOC 취합 및 글로벌 고객 불만(Claim) 응대 총괄",
    description: "고객의 Pain point를 가장 잘 아는 실무자.\n업무 의욕은 높으나 신기술(AI)에 대한 막연한 두려움이 있음.",
    tags: ["#열정만수르", "#현장경험_최고", "#AI포비아", "#고객마음_척척", "#감성적_소통"],
    isFullTime: true,
  },
  {
    id: "jungtaeyoung",
    name: "정태영",
    role: "책임 (인프라보안팀)",
    quote: "저희 팀 우선순위 일정 있으니까, 두 달 전에는 미리 말씀해 주셨어야죠. 대기표 뽑고 기다리세요.",
    age: 43,
    gender: "남성",
    years: 15,
    dept: "인프라보안팀",
    position: "DB 및 사내 데이터 보안 검수 담당",
    description: "전사 DB 접근 권한을 쥔 핵심 인력. 본업이 바빠 프로젝트 업무는 항상 후순위로 미룸.",
    tags: ["#문고리_권력", "#마이웨이", "#바쁘다바빠", "#규정_엄수", "#철벽방어"],
    isFullTime: false,
  },
  {
    id: "sarahlee",
    name: "Sarah Lee",
    role: "매니저 (북미지역본부 마케팅)",
    quote: "(오프라인 상태) 메일 남겨주시면 시차 확인 후 회신할게요.",
    age: 35,
    gender: "여성",
    years: 9,
    dept: "북미지역본부 마케팅",
    position: "마케팅 데이터 애널리스트 (현지 VOC 데이터 관리)",
    description: "글로벌 핵심 데이터를 쥐고 있는 해외 파트너.\n시차와 물리적 거리로 인해 소통과 통제가 가장 어려움.",
    tags: ["#시차의_장벽", "#글로벌_스탠다드", "#서면소통_선호", "#비동기_근무", "#칼같은_오프라인"],
    isFullTime: false,
  },
];

export interface StakeholderProfile {
  id: string;
  name: string;
  role: string;
  quote: string;
  position: string;
  description: string;
  tags: string[];
}

export const stakeholders: StakeholderProfile[] = [
  {
    id: "kimhyukgi",
    name: "김혁기",
    role: "본부장",
    quote: "Simple is the Best, 그리고 도전적인 목표가 혁신을 만듭니다. 안 되면 되게 하자!",
    position: "경영혁신본부 (본 프로젝트의 최종 스폰서)",
    description: "프로젝트의 거시적인 방향을 제시하지만, 실무적인 난관(리소스, R&R)보다 큰 그림과 성과에 집중함. C-Level 특유의 하향식(Top-down) 지시가 익숙하며, 30% 개선보다는 50%의 파격적인 '스트레치 골'을 요구함.",
    tags: ["#스트레치골_매니아", "#탑다운_지시", "#큰그림_중시", "#결과우선주의", "#카리스마"],
  },
  {
    id: "choisungmin",
    name: "최성민",
    role: "상무",
    quote: "본부장님이 '심플'을 강조하시긴 했지만, 그래도 보고용 장표는 데이터가 꽉 차고 시각적으로 화려해야지. 알아서 잘 믹스해 봐.",
    position: "고객가치혁신담당 상무 (PM의 직속 상사이자 실질적인 인사 평가자)",
    description: "최고위 본부장의 지시를 PM에게 전달하고 압박/관리함. 본부장의 무리한 지시를 방어해 주기보다는 그대로 하달하며, 실무진의 고충보다는 상부의 니즈에 맞는 가시적인 성과와 '완벽한 보고서'를 중시함.",
    tags: ["#보고서_장인", "#본부장님_바라기", "#중간보스의_비애", "#화려한_장표선호", "#압박전담반"],
  },
];

export const projectOverview = {
  title: "글로벌 VOC 통합 분석 AI 도입",
  background: "파편화된 고객 데이터: 전 세계 다양한 채널에서 수집되는 글로벌 VOC 데이터가 CS팀과 마케팅팀 등 각 부서에 산재되어 있어 전사적인 통합 관리가 부재한 상황입니다. 비효율적인 수작업 프로세스로 실무진이 방대한 양의 데이터를 일일이 수작업으로 취합·분류하느라 병목이 발생하고 있으며, 시장 대응력이 약화되고 있습니다.",
  purpose: "AI 기반 VOC 통합 분석 체계 구축, 데이터 처리 효율성 극대화, 실시간 비즈니스 인사이트 창출.",
  kpi: [
    "산출물 품질 (Quality): 현업(CS/마케팅) 데이터 처리 공수 30% 이상 단축 가능한 'AI VOC 대시보드' 프로토타입의 정상 구동 및 완성도",
    "일정 준수 (Delivery): 6개월 기한 내 프로젝트 마일스톤 달성 및 결과물 적기 납품",
    "팀 몰입도 (Team Engagement): 팀원 몰입도 70% 이상의 주도적이고 건강한 조직 문화",
    "이해관계자 조율 (Stakeholder Alignment): 유관부서 협조율 80% 이상 달성",
  ],
  peopleMission: "프로젝트 리더로서 일(Work)과 사람(People)을 동시에 관리하며 위 4가지 핵심 KPI와 리더의 에너지(한정 자원)의 밸런스를 유지해야 합니다.",
};
