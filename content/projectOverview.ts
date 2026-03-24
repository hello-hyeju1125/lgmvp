/** 프로젝트 개요 공지 – 블랭크(클릭 시 표시)용 파트 */
export type NoticePart = { hidden: boolean; text: string };

export const projectOverviewNotice = {
  title: "[프로젝트 개요] 글로벌 VOC 통합 분석 AI 도입",
  section1: {
    heading: "1. 프로젝트 배경",
    bullets: [
      {
        label: "",
        parts: [
          { hidden: true, text: "파편화된 고객 데이터" },
          { hidden: false, text: ": 전 세계 다양한 채널에서 수집되는 글로벌 VOC 데이터가 CS팀과 마케팅팀 등 각 부서에 산재되어 있어 전사적인 통합 관리가 부재한 상황입니다." },
        ] as NoticePart[],
      },
      {
        label: "",
        parts: [
          { hidden: true, text: "비효율적인 수작업 프로세스" },
          { hidden: false, text: ": 실무진이 방대한 양의 데이터를 일일이 수작업으로 취합하고 분류하느라 불필요한 리소스 낭비와 병목 현상이 발생하고 있습니다." },
        ] as NoticePart[],
      },
      {
        label: "",
        parts: [
          { hidden: true, text: "시장 대응력 약화" },
          { hidden: false, text: ": 데이터 분석 지연으로 인해 급변하는 고객의 숨은 니즈를 파악하지 못하고, 글로벌 시장 트렌드 변화에 기민하게 대응하지 못하고 있습니다." },
        ] as NoticePart[],
      },
    ],
  },
  section2: {
    heading: "2. 프로젝트 목적",
    bullets: [
      {
        label: "",
        parts: [
          { hidden: true, text: "AI 기반 VOC 통합 분석 체계 구축" },
          { hidden: false, text: ": 최신 AI 기술을 도입하여 전 세계에 흩어진 고객의 목소리를 자동으로 수집, 분류, 감성 분석하는 통합 시스템을 마련합니다." },
        ] as NoticePart[],
      },
      {
        label: "",
        parts: [
          { hidden: true, text: "데이터 처리 효율성 극대화" },
          { hidden: false, text: ": 기존의 수작업 위주 프로세스를 자동화하여, 현업 부서(CS/마케팅 등)의 데이터 처리 공수를 획기적으로 단축합니다." },
        ] as NoticePart[],
      },
      {
        label: "",
        parts: [
          { hidden: true, text: "실시간 비즈니스 인사이트 창출" },
          { hidden: false, text: ": 분석된 데이터를 바탕으로 실시간 인사이트를 도출하여, 데이터 기반의 신속하고 정확한 의사결정 체계를 지원합니다." },
        ] as NoticePart[],
      },
    ],
  },
  section3: {
    heading: "3. 프로젝트 성공 요건(KPI)",
    intro: "프로젝트 리더로서 당신은 일(Work)과 사람(People)을 동시에 관리하며 아래 4가지 핵심 KPI를 달성해야 합니다.",
    workTitle: "[일 관리 (Work Management)]",
    workBullets: [
      {
        label: "",
        parts: [
          { hidden: true, text: "산출물 품질 (Quality)" },
          { hidden: false, text: ': "현업이 즉시 활용하며 만족할 수 있는 실효성 높고 완성도 있는 AI 대시보드를 구축하였는가?" 현업(CS/마케팅)의 데이터 처리 공수를 30% 이상 단축할 수 있는 \'AI VOC 대시보드\' 프로토타입의 정상 구동 및 아웃풋의 완성도를 평가합니다.' },
        ] as NoticePart[],
      },
      {
        label: "",
        parts: [
          { hidden: true, text: "일정 준수 (Delivery)" },
          { hidden: false, text: ': "주어진 제한 시간 내에 지연 없이 프로젝트 마일스톤을 달성하고 결과물을 적기에 납품하였는가?" 프로젝트 착수부터 대시보드 프로토타입 오픈까지의 전체 일정을 체계적으로 관리하여, \'6개월\'이라는 기한 내에 목표를 완수하는 진척도 관리 역량을 평가합니다.' },
        ] as NoticePart[],
      },
    ],
    peopleTitle: "[사람 관리 (People Management)]",
    peopleBullets: [
      {
        label: "",
        parts: [
          { hidden: true, text: "팀 몰입도 (Team Engagement)" },
          { hidden: false, text: ': "팀원들의 잠재력을 발굴하고, 하나의 목표를 향해 자발적으로 몰입하는 팀 문화를 만들었는가?" People Manager로서 프로젝트 팀원 개개인의 동기를 부여하고 역량을 끌어올려, \'팀 몰입도 70% 이상\'의 주도적이고 건강한 조직 문화를 조성하는 것을 목표로 합니다.' },
        ] as NoticePart[],
      },
      {
        label: "",
        parts: [
          { hidden: true, text: "이해관계자 조율 (Stakeholder Alignment)" },
          { hidden: false, text: ': "이해관계가 얽힌 유관부서 및 상위 조직과의 갈등을 해결하고, 적극적인 협조와 지원을 이끌어냈는가?" CS, 마케팅 등 타 부서와의 원활한 소통 및 이해관계 조율을 통해 \'유관부서 협조율 80% 이상\'을 달성하며, 프로젝트의 강력한 추진 동력을 확보하는 능력을 평가합니다.' },
        ] as NoticePart[],
      },
    ],
  },
};
