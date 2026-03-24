/** Screen 28. 튜토리얼: 프로젝트 리스크 레이더(Risk Radar) */

export const riskRadarCopy = {
  title: "튜토리얼: 프로젝트 리스크 레이더(Risk Radar) 가동",
  chatbotGuide: [
    "리더님, 순조롭던 실행 단계를 지나 마침내 [감시 및 통제 단계]에 진입하셨습니다! 프로젝트 실행이 중반을 넘어서면서, 곳곳에서 심상치 않은 조짐(Risk)들이 감지되고 있습니다.",
    "PM은 모든 리스크에 동일한 에너지를 쏟을 수 없습니다. 한정된 리소스를 현명하게 쓰려면, 발생할 수 있는 리스크들을 2가지 축을 기준으로 분류하고 대응 전략을 세워야 합니다.",
    "하단에 흩어진 8개의 '리스크 포스트잇'을 읽고, [영향도]와 [발생 가능성]을 판단하여 알맞은 사분면(Quadrant)으로 드래그 앤 드롭해 보세요!",
  ],
  axisY: "영향도 (Impact)",
  axisYDesc: "프로젝트의 일정, 품질, 비용에 미치는 타격의 크기 (낮음 → 높음)",
  axisX: "발생 가능성 (Probability)",
  axisXDesc: "실제로 이 문제가 터질 확률 (낮음 → 높음)",
};

export type QuadrantId = "Q1" | "Q2" | "Q3" | "Q4";

export const RISK_QUADRANTS: {
  id: QuadrantId;
  label: string;
  subLabel: string;
  tooltip: string;
}[] = [
  {
    id: "Q1",
    label: "즉각 대응",
    subLabel: "High Impact / High Probability",
    tooltip:
      "당장 프로젝트의 명운을 가를 치명타! PM이 가장 먼저 뛰어들어 우회로를 찾거나 즉시 해결해야 할 1순위 리스크. [Mitigate/Avoid]",
  },
  {
    id: "Q2",
    label: "비상 계획 수립",
    subLabel: "High Impact / Low Probability",
    tooltip:
      "당장 터질 확률은 낮지만, 한 번 터지면 대형 사고. 만약을 대비한 '플랜 B'가 필수적임. [Contingency]",
  },
  {
    id: "Q3",
    label: "지속 모니터링",
    subLabel: "Low Impact / High Probability",
    tooltip:
      "성가시게 계속 발생하지만 치명적이지는 않음. 실무자 선에서 프로세스를 개선해 빈도를 줄이도록 유도함. [Monitor/Reduce]",
  },
  {
    id: "Q4",
    label: "수용",
    subLabel: "Low Impact / Low Probability",
    tooltip:
      "굳이 리소스를 들여 방어할 필요 없음. 발생하면 그때 가서 대처해도 무방함. [Accept]",
  },
];

export interface RiskPostIt {
  id: string;
  text: string;
  /** 참고용 정답 사분면 (검증 안 함) */
  suggestedQuadrant: QuadrantId;
}

export const RISK_POSTITS: RiskPostIt[] = [
  {
    id: "r1",
    text: "본사 정보보안팀의 '북미 지역 VOC 데이터 반출' 최종 심의 탈락에 따른 데이터 연동 불가 위기",
    suggestedQuadrant: "Q1",
  },
  {
    id: "r2",
    text: "클라우드 서버 증설 예산 초과로 인한 재무팀의 기안 반려 및 개발 인프라 확보 지연",
    suggestedQuadrant: "Q1",
  },
  {
    id: "r3",
    text: "김혁기 본부장의 갑작스러운 요구사항으로 인한 대시보드 내 '생성형 AI 챗봇 기능' 추가 지시 가능성",
    suggestedQuadrant: "Q2",
  },
  {
    id: "r4",
    text: "북미 지역 데이터 핵심 담당자인 Sarah Lee 매니저의 갑작스러운 장기 병가 및 리소스 공백 발생",
    suggestedQuadrant: "Q2",
  },
  {
    id: "r5",
    text: "글로벌CS팀 최유라 선임의 워크로드 증가로 인한 베타 테스트 피드백 1~2일 지연",
    suggestedQuadrant: "Q3",
  },
  {
    id: "r6",
    text: "마케팅팀 박소진 책임의 잦은 대시보드 폰트, 컬러 등 단순 UI/UX 수정 요청 누적",
    suggestedQuadrant: "Q3",
  },
  {
    id: "r7",
    text: "경쟁사의 유사 AI 분석 시스템 '다음 달 조기 런칭 검토 중'이라는 기사 보도",
    suggestedQuadrant: "Q4",
  },
  {
    id: "r8",
    text: "사옥 주말 정기 전력 점검으로 인한 테스트 서버 2시간 일시 다운 예상",
    suggestedQuadrant: "Q4",
  },
];

/** Screen 29. 튜토리얼 결과: 선배 PM의 리스크 대응 코칭 */
export const riskRadarResultCopy = {
  title: "리스크 레이더 세팅이 완료되었습니다!",
  subtitle: "챗봇 선배 PM의 피드백 및 가이드:",
  intro:
    "수고하셨습니다, 리더님. 프로젝트 과정에서 발생하는 수많은 리스크에 동일한 리소스를 투입하는 것은 비효율적입니다. 리스크의 영향도와 발생 가능성을 기준으로 리더의 대응 수준을 차등화하는 것이 핵심입니다.",
  quadrantFeedback: [
    {
      label: "1사분면: 즉각 대응 (High Impact / High Probability)",
      text: "보안 심의 탈락이나 인프라 예산 반려와 같이 프로젝트의 진행 자체를 가로막는 중대 이슈입니다. 리더가 최우선순위로 개입하여 유관부서와 공식적으로 조율하고, 즉각적인 해결책을 도출해야 하는 영역입니다.",
    },
    {
      label: "2사분면: 비상 계획 수립 (High Impact / Low Probability)",
      text: "경영진의 갑작스러운 요구사항 변경이나 핵심 인력의 장기 부재는 발생 빈도는 낮으나, 가시화될 경우 프로젝트에 미치는 파급력이 매우 큽니다. 리스크 발생 시 즉각 가동할 수 있는 '플랜 B(Contingency Plan: 대체 자원 확보 및 방어 논리)'를 사전에 마련해 두어야 합니다.",
    },
    {
      label: "3사분면: 지속 모니터링 (Low Impact / High Probability)",
      text: "실무진의 일정 지연이나 빈번한 수정 요청 등은 상시 발생하는 관리 요소입니다. 정기적인 회의체(데일리 스크럼 등)를 통해 진행 상황을 모니터링하되, 리더의 에너지가 과도하게 매몰되지 않도록 실무선에 위임하여 통제하십시오.",
    },
    {
      label: "4사분면: 수용 (Low Impact / Low Probability)",
      text: "경쟁사의 미확인 동향 보도나 일상적인 시스템 점검 등은 프로젝트에 미치는 영향이 미미합니다. 불필요한 내부 동요를 차단하고, 해당 리스크를 현 상태로 수용(Accept)하며 본연의 과제에 집중하는 결단이 필요합니다.",
    },
  ],
  outro:
    "이처럼 리스크의 경중을 파악하고 나면 리더가 어디에 집중해야 할지 명확해집니다. 이제 1, 2사분면에서 식별된 '핵심 돌발 변수'들이 실제 상황으로 전개될 때, 리더로서 어떻게 방어하고 통제해 나갈지 다음 여정을 통해 확인해 보십시오.",
};
