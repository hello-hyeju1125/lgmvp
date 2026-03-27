# Component Refactoring Prompt
공유 기반 컴포넌트 구조 리팩토링

---

## 목표

현재 프로젝트의 컴포넌트를 리팩토링하여, 같은 "역할"을 가진
컴포넌트들이 단일 기반 컴포넌트를 공유하도록 구조를 개선한다.
에피소드별 콘텐츠(텍스트, 데이터)는 그대로 유지하고, UI 구조만 추상화한다.

---

## 배경 및 현황

현재 62개 컴포넌트가 있으며, 다음 패턴이 각 에피소드/단계별로 중복 구현되어 있다.

### 패턴 A: Episode Scene-Options-Result (7회 반복)

| 에피소드 | Scene | Options | Result |
|---------|-------|---------|--------|
| Ep1 | Ep1Scene | Ep1Options | Ep1Result |
| Ep2 | Ep2AlignScene | Ep2AlignOptions | Ep2AlignResult |
| Ep3 | Ep3TeamScene | Ep3TeamOptions | Ep3TeamResult |
| Ep4 | Ep4RoleScene | Ep4RoleOptions | Ep4RoleResult |
| Ep5 | Ep5BlueprintScene | Ep5BlueprintOptions | Ep5BlueprintResult |
| Ep6 | Ep6PingpongScene | Ep6PingpongOptions | Ep6PingpongResult |
| Ep7 | Ep7PassionScene | Ep7PassionOptions | Ep7PassionResult |

### 패턴 B: Phase Action Allocation (3회 반복)

- InitiationAction
- PlanningAction
- ExecAction

### 패턴 C: Phase Recap (4회 반복)

- InitiationRecap / PlanRecap / ExecRecap / MonitoringRecap

### 패턴 D: Senior Tips (3회 반복)

- InitiationSeniorTips / ExecSeniorTips / MonitoringSeniorTips

### 패턴 E: Phase Rampup (4회 반복)

- InitiationRampup / PlanRampup / ExecRampup / MonitoringRampup

---

## 리팩토링 원칙

1. **공유 기반 컴포넌트 생성**: 각 패턴에 대해 `/components/shared/` 디렉토리에
   기반 컴포넌트를 만든다.

2. **Props로 콘텐츠 주입**: 텍스트, 선택지, 결과 데이터 등 에피소드별 콘텐츠는
   props로 받도록 설계한다.

3. **기존 파일 유지 (Wrapper 방식)**: 기존 `Ep1Scene.tsx` 등의 파일을 삭제하지 않고,
   기반 컴포넌트를 import하여 해당 에피소드 데이터를 주입하는 얇은 wrapper로
   변환한다. 이렇게 하면 `simulation/page.tsx`의 라우팅 로직을 건드리지 않아도 된다.

4. **타입 안전성 유지**: 모든 기반 컴포넌트에 TypeScript interface를 정의한다.

5. **한 번에 하나씩**: 패턴 A부터 시작하고, 각 패턴 완료 후 기존 동작이 유지되는지
   확인한 뒤 다음 패턴으로 진행한다.

---

## 구체적 실행 계획

### Step 1: 현재 코드 분석 (먼저 읽기)

리팩토링 전에 반드시 다음 파일들을 읽고 실제 코드를 확인한다.

```
/components/simulation/Ep1Scene.tsx
/components/simulation/Ep1Options.tsx
/components/simulation/Ep1Result.tsx
/components/simulation/Ep3TeamScene.tsx
/components/simulation/Ep3TeamOptions.tsx
/components/simulation/Ep3TeamResult.tsx
/components/simulation/InitiationAction.tsx
/components/simulation/PlanningAction.tsx
/components/simulation/InitiationRecap.tsx
/components/simulation/InitiationSeniorTips.tsx
/components/simulation/InitiationRampup.tsx
```

이 파일들의 공통 UI 구조(className, 레이아웃, 버튼 스타일 등)를 파악한다.

---

### Step 2: 패턴 A — EpisodeScene 기반 컴포넌트

**파일:** `/components/shared/EpisodeScene.tsx`

공통 구조:
- 제목/상황 설명 텍스트 영역
- 캐릭터 다이얼로그 박스
- 하단 네비게이션 버튼

Props interface:

```typescript
interface EpisodeSceneProps {
  title: string;
  situation: string;
  dialogues?: Array<{ speaker: string; text: string }>;
  onNext: () => void;
  // 에피소드별 특수 요소는 children으로 처리
  children?: React.ReactNode;
}
```

기존 파일 변환 방식 (Ep1Scene.tsx 예시):

```typescript
// 기존 Ep1Scene.tsx를 이렇게 변환
import EpisodeScene from '@/components/shared/EpisodeScene';
import { ep1Content } from '@/content/episode1';

export default function Ep1Scene({ onNext }: { onNext: () => void }) {
  return (
    <EpisodeScene
      title={ep1Content.title}
      situation={ep1Content.situation}
      dialogues={ep1Content.dialogues}
      onNext={onNext}
    />
  );
}
```

---

### Step 3: 패턴 A — EpisodeOptions 기반 컴포넌트

**파일:** `/components/shared/EpisodeOptions.tsx`

Props interface:

```typescript
interface Option {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  label: string;
  description: string;
}

interface EpisodeOptionsProps {
  title: string;
  situation?: string;
  options: Option[];
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
  onNext: () => void;
  onPrev?: () => void;
}
```

---

### Step 4: 패턴 A — EpisodeResult 기반 컴포넌트

**파일:** `/components/shared/EpisodeResult.tsx`

Props interface:

```typescript
interface ResultOption {
  id: string;
  label: string;
  advice: string;
  kpiImpacts?: Array<{ metric: string; change: number }>;
}

interface EpisodeResultProps {
  title: string;
  selectedOption: string;
  results: ResultOption[];
  onNext: () => void;
  onPrev?: () => void;
}
```

---

### Step 5: 패턴 B — ActionAllocation 기반 컴포넌트

**파일:** `/components/shared/ActionAllocation.tsx`

Props interface:

```typescript
interface ActionItem {
  id: string;
  title: string;
  description: string;
  pmbok?: string;
  min: number;
  max: number;
}

interface ActionAllocationProps {
  phaseTitle: string;
  totalHours: number;
  actions: ActionItem[];
  allocations: Record<string, number>;
  onAllocate: (actionId: string, hours: number) => void;
  onConfirm: () => void;
}
```

---

### Step 6: 패턴 C, D, E — Recap / SeniorTips / Rampup

각각 기반 컴포넌트를 생성한다.

| 패턴 | 기반 컴포넌트 파일 |
|-----|----------------|
| Recap | `/components/shared/PhaseRecap.tsx` |
| SeniorTips | `/components/shared/SeniorTipsPanel.tsx` |
| Rampup | `/components/shared/PhaseRampup.tsx` |

---

## 주의사항

1. **`simulation/page.tsx` 라우팅은 건드리지 않는다.**
   기존 컴포넌트 이름을 그대로 유지하는 wrapper 방식을 사용한다.

2. **한 번에 전체를 바꾸지 않는다.**
   패턴 A(Scene)를 먼저 완성하고, Ep1Scene → Ep2AlignScene → Ep3TeamScene 순서로
   하나씩 변환하면서 각 변환 후 TypeScript 에러가 없는지 확인한다.

3. **스타일은 기반 컴포넌트에 집중시킨다.**
   버튼 className, 카드 스타일, 색상 등은 기반 컴포넌트에만 정의하고,
   wrapper 파일에는 스타일을 넣지 않는다.

4. **콘텐츠 파일(`/content/`)은 수정하지 않는다.**
   UI 구조만 리팩토링 대상이다.

5. **`store/useStore.ts`는 수정하지 않는다.**
   상태 관리 로직은 유지한다.

---

## 완료 기준

- [ ] `/components/shared/` 디렉토리에 기반 컴포넌트 파일 생성
- [ ] Ep1~Ep7의 Scene / Options / Result가 기반 컴포넌트를 사용하는 wrapper로 변환
- [ ] 3개 ActionAllocation이 기반 컴포넌트를 사용하는 wrapper로 변환
- [ ] 4개 Recap, 3개 SeniorTips, 4개 Rampup이 기반 컴포넌트를 사용하는 wrapper로 변환
- [ ] TypeScript 빌드 에러 없음 (`npx tsc --noEmit`)
- [ ] 기반 컴포넌트의 버튼 className 하나를 바꾸면 모든 에피소드에 반영됨을 코드로 확인
