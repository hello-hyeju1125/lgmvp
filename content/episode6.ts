/** E6. 핑퐁 게임을 멈춰라! (실행 단계) */
import type { KpiState } from "@/store/useStore";

export const ep6Scene = {
  title: "E6. 핑퐁 게임을 멈춰라!",
  situation:
    "PM보드 세팅을 마치자마자, [이슈 발생(Blocker)] 칸에 놓인 '북미 지역 데이터 연동 API 구축' 티켓에 붉은색 경고등이 들어옵니다. 티켓을 클릭해 보니, 각자의 '규정'을 무기로 책임 소재를 핑퐁하는 숨막히는 댓글이 이어지고 있습니다.",
  comments: [
    "💬 김지훈 (IT / 2시간 전): Sarah 매니저님, 금주 금요일까지 API 연동 테스트가 완료되어야 하나, 아직 북미 DB 접근 권한이 부여되지 않아 업무가 홀딩된 상태입니다. 바쁘시겠지만 빠른 확인 부탁드립니다.",
    "💬 Sarah Lee (북미 마케팅 / 1시간 전): 김 선임님, 해당 건은 본사 정보보안팀의 '글로벌 고객 데이터 반출 승인' 심의를 득하신 후 시스템으로 SR(Service Request)을 올려주셔야 제가 권한을 열어드릴 수 있습니다. 정태영 책임님, 해당 건 보안 심의 진행 상태 공유 부탁드립니다.",
    "💬 정태영 (인프라보안 / 30분 전): Sarah 매니저님, 김지훈 선임님. 본 건은 지난주 반려 처리되었습니다. 사유는 '데이터 처리 계획서' 누락 및 보안 심의 위원회(월 1회 개최) 미통과입니다. 차기 심의는 다음 달 둘째 주 예정입니다. 보안 규정상 예외 처리는 불가합니다.",
    "💬 김지훈 (IT / 10분 전): 정 책임님, 킥오프 때 일정상 해당 심의는 '선조치 후보고'로 예외 처리하기로 구두 협의된 것으로 알고 진행 중이었습니다. 다음 달 심의를 타게 되면 1차 마일스톤 납기는 전면 지연됩니다. PM님(@User_Name), 본 건 부서 간 규정 해석 차이로 실무선에서 진행 불가합니다. 가이드 부탁드립니다.",
  ],
  systemPrompt:
    "유관부서의 '보안 규정'과 실무진의 '납기 압박'이 정면으로 충돌하며 업무가 멈췄습니다. 이 교착 상태를 뚫기 위해 당신의 리더십을 발휘할 시간입니다. 아래의 블록을 조합하여 당신만의 커뮤니케이션 전략을 완성해 주십시오.",
};

/** 블록 1: 누구에게 연락하시겠습니까? */
export const ep6Block1Options = [
  { id: "A", label: "당사자 및 유관부서 전체 공개" },
  { id: "B", label: "김지훈, 정태영, Sarah 매니저" },
  { id: "C", label: "IT 김지훈 선임" },
  { id: "D", label: "정보보안팀장" },
];

/** 블록 2: 소통 채널 - 어디서 이야기하시겠습니까? */
export const ep6Block2Options = [
  { id: "A", label: "PM 보드 내 댓글 (모두가 보는 공식적인 시스템 기록)" },
  { id: "B", label: "관련자가 모두 참조(CC)된 공식 이메일 (결재선과 근거를 명확히 남김)" },
  { id: "C", label: "사내 메신저 그룹 채팅방 (빠르고 캐주얼한 비동기 소통)" },
  { id: "D", label: "1:1 전화 통화 (기록을 남기지 않고 은밀하게 뉘앙스를 전달)" },
  { id: "E", label: "긴급 화상회의 소집 (얼굴을 보며 실시간으로 결론 도출)" },
  { id: "F", label: "직접 자리로 찾아가기 (물리적 대면을 통한 강행 돌파)" },
];

/** 블록 3: 소통 톤 - 어떤 태도로 접근하시겠습니까? */
export const ep6Block3Options = [
  { id: "A", label: "원칙과 R&R을 강조하며 단호하게 (선 긋기 및 책임 소재 명확화)" },
  { id: "B", label: "상대방의 고충에 공감하며 정중하고 부드럽게 (감정 케어 및 라포 형성)" },
  { id: "C", label: "납기 지연의 심각성을 어필하며 절박하게 (읍소형)" },
  { id: "D", label: "감정을 배제하고 실용적인 대안 모색에만 집중하며 건조하게 (문제 해결형)" },
  { id: "E", label: "상위 직책자(본부장 등)의 지시임을 은근히 내비치며 압박하듯 (권위 활용형)" },
];

/** 블록 4: 소통 내용(Message) - 가장 핵심이 되는 지시/요청 사항 */
export const ep6Block4Options = [
  { id: "A", label: "킥오프 때의 '선조치 후보고' 구두 협의를 근거로, 이번 심의는 예외 처리하여 당장 권한을 승인해 줄 것을 강하게 요구한다.", shortMessage: "구두 협의를 근거로 예외 처리하여 당장 권한 승인을 강하게 요구" },
  { id: "B", label: "정식 심의 전까지 보안에 문제없는 '더미(Dummy) 데이터'로 API 뼈대만 우선 테스트할 수 있도록 기술적 우회로를 제안한다.", shortMessage: "'더미 데이터'로 뼈대만 우선 테스트할 수 있도록 우회로를 제안" },
  { id: "C", label: "개발 일정이 최우선이므로, 반려된 보안 기안 서류 행정 처리는 PM인 내가 직접 양식에 맞춰 대행하겠다고 나선다.", shortMessage: "반려된 보안 서류 행정 처리를 PM인 내가 대행하겠다고 나섬" },
  { id: "D", label: "현재 반려 사유인 '마스킹 계획서'를 IT 담당자와 보안팀이 30분만 화면을 공유하며 실시간으로 함께 작성하자고 제안한다.", shortMessage: "마스킹 계획서를 30분 화면 공유로 실시간 작성하자고 제안" },
  { id: "E", label: "원칙대로 다음 달 심의를 타기로 결정하고, 이로 인한 1차 납기 지연 불가피 상황을 임원진에게 공식 에스컬레이션(보고)하겠다고 통보한다.", shortMessage: "원칙대로 다음 달 심의로 하고 윗선에 공식 에스컬레이션하겠다고 통보" },
];

function kpi(partial: Partial<Record<keyof KpiState, number>>): Partial<Record<keyof KpiState, number>> {
  return partial;
}

export function getEp6Result(
  block4: string,
  block2?: string
): { text: string; advice: string; kpi: Partial<Record<keyof KpiState, number>>; kpiLabels: string[] } {
  switch (block4) {
    case "B":
    case "D":
      const bestChannel = block2 === "E";
      return {
        text: bestChannel
          ? "리더님은 **텍스트 핑퐁을 끊어내고 당사자들을 모아** 합법적인 우회로를 모색했습니다. **규정도 지키고 납기도 사수하는 완벽한 리딩**입니다."
          : "**대안은 훌륭했지만**, 여전히 텍스트로 지시를 남겨 실시간 소통의 이점을 살리지 못해 적용에 시간이 걸렸습니다.",
        advice: "텍스트 핑퐁을 끊고 당사자들을 모아 합법적인 우회로를 모색하는 것이 효과적입니다.",
        kpi: bestChannel ? kpi({ delivery: 20, stakeholderAlignment: 20, teamEngagement: 10 }) : kpi({ delivery: 10, stakeholderAlignment: 20, teamEngagement: 10 }),
        kpiLabels: bestChannel
          ? ["일정 준수 상승 ▲▲", "이해관계자 조율 상승 ▲▲", "팀 몰입도 상승 ▲"]
          : ["일정 준수 상승 ▲", "이해관계자 조율 상승 ▲▲", "팀 몰입도 상승 ▲"],
      };
    case "A":
      return {
        text: "기록이 남는 공개된 장소에서 상위 조직을 내세우며 원칙을 무시하려 들자, **정태영 책임은 방어 기제가 발동**해 '구두 협의는 효력 없으니 규정대로 다음 달 심의 올리시죠'라며 완벽한 철벽을 칩니다. **감정의 골만 깊어졌습니다.**",
        advice: "권위만으로 밀어붙이면 보안 담당자의 방어 기제가 오히려 강화됩니다.",
        kpi: kpi({ delivery: -20, stakeholderAlignment: -20, teamEngagement: -10, leaderEnergy: -20 }),
        kpiLabels: ["일정 준수 하락 ▼▼", "이해관계자 조율 하락 ▼▼", "팀 몰입도 하락 ▼", "리더의 에너지 하락 ▼▼"],
      };
    case "C":
      return {
        text: "당장의 마찰은 피했고 실무진은 환호합니다. 하지만 **리더인 당신은 밤을 새워 데이터 마스킹 계획서를 써야 합니다.** 전체 판을 읽어야 할 PM이 실무 행정 처리의 늪에 빠져 허우적대며, 팀원들은 앞으로도 껄끄러운 일은 모두 리더에게 미루게 될 것입니다.",
        advice: "PM이 직접 서류를 대행하면 당장은 해결되지만 팀의 의사결정 역량이 약해집니다.",
        kpi: kpi({ leaderEnergy: -25, teamEngagement: -20, delivery: 10 }),
        kpiLabels: ["리더의 에너지 하락 ▼▼▼", "팀 몰입도 하락 ▼▼", "일정 준수 상승 ▲"],
      };
    case "E":
      return {
        text: "**안전한 선택 같지만**, 실무선에서 풀 수 있는 문제를 너무 일찍 포기하고 상위 이해관계자들을 개입시켰습니다. 정 책임은 향후 모든 이슈에서 방어적으로 나올 것이며, **임원진은 '이런 것도 해결 못 하냐'며 당신의 리더십을 의심**합니다.",
        advice: "에스컬레이션은 필요할 때만 사용해야 합니다. 실무에서 해결 가능한 문제를 너무 일찍 윗선에 올리면 리더십이 약해 보입니다.",
        kpi: kpi({ stakeholderAlignment: -25, delivery: -20, teamEngagement: -20, leaderEnergy: -10 }),
        kpiLabels: ["이해관계자 조율 하락 ▼▼▼", "일정 준수 하락 ▼▼", "팀 몰입도 하락 ▼▼", "리더의 에너지 하락 ▼"],
      };
    default:
      return {
        text: "선택이 반영되었습니다. 당사자들과 소통 채널, 톤, 메시지 조합에 따라 결과가 달라집니다.",
        advice: "블록 4(핵심 메시지)가 프로젝트 방향을 가장 크게 결정합니다.",
        kpi: kpi({}),
        kpiLabels: [],
      };
  }
}

/** 완성된 메시지 문장용: 블록 라벨에서 괄호 설명 제거 */
export function getBlockLabelShort(label: string): string {
  const idx = label.indexOf(" (");
  return idx > 0 ? label.slice(0, idx) : label;
}
