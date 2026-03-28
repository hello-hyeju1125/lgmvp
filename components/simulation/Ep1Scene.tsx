"use client";

import { useStore } from "@/store/useStore";
import { ep1Scene, ep1Options } from "@/content/episode1";
import Image from "next/image";
import { MessageSquareQuote } from "lucide-react";

function replaceUserName(text: string, name: string) {
  return text.replace(/\{User_Name\}/g, name);
}

/** **text** -> highlighted keyword */
function renderWithBold(paragraph: string) {
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-[#E4003F]">
        {p}
      </strong>
    ) : (
      p
    ),
  );
}

interface Ep1SceneProps {
  userName: string;
}

function renderActionPrompt() {
  return (
    <>
      무리한 탑다운(Top-down) 지시와 상무의 타협안 앞에서,
      <br />
      <strong className="font-black">리더인 당신은 이 위기를 어떻게 돌파하시겠습니까?</strong>
    </>
  );
}

function renderOptionTitle(optionId: "A" | "B" | "C") {
  if (optionId === "A") {
    return (
      <>
        리더의 역할은
        <br />
        완벽한 방패막
      </>
    );
  }
  if (optionId === "B") {
    return (
      <>
        데이터로 무장한
        <br />
        논리적 방어
      </>
    );
  }
  return (
    <>
      극한의 제약을 통한
      <br />
      사고의 확장
    </>
  );
}

function renderOptionSummary(optionId: "A" | "B" | "C", userName: string) {
  if (optionId === "A") {
    return (
      <div className="space-y-3">
        <p>
          상무님의 조언대로 보고용 50% 달성 장표를 밤새 그럴듯하게 포장하여 본부장님을 안심시킵니다. 그리고 킥오프
          회의에서 팀원들에게는 이렇게 말합니다.
        </p>
        <p className="border-l-4 border-black pl-3">
          &quot;여러분, 지금 50% 하라고 압박이 심한데 그건 리더인 제가 일단 알아서 막아볼테니, 여러분은 원래 계획했던
          30% 현실적인 목표에만 집중해 주세요. 흔들리지 말고 일합시다.&quot;
        </p>
      </div>
    );
  }
  if (optionId === "B") {
    return (
      <div className="space-y-3">
        <p>50%는 물리적으로 절대 불가능하다고 판단합니다.</p>
        <p>
          주말 동안 당신이 직접 과거 데이터와 현재 IT 아키텍처의 한계를 샅샅이 뒤져, &apos;왜 50% 단축이 불가능한지&apos;를
          증명하는 30장짜리 논리 반박 보고서를 작성합니다.
        </p>
        <p className="border-l-4 border-black pl-3">
          이를 들고 최성민 상무를 찾아가 &quot;상무님, 이대로 가면 우리 다 죽습니다. 제가 논리는 다 만들어 뒀으니,
          이걸로 본부장님을 설득해 주십시오&quot;라고 읍소합니다.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <p>
        팀원들을 긴급 소집하여 본부장의 50% 상향 지시와 상무의 타협안을 투명하게 공유합니다. 당황하는 팀원들에게 당신은
        고객 관점에서의 도전적인 질문을 막 던집니다.
      </p>
      <p className="border-l-4 border-black pl-3">
        &quot;기존 방식으로는 맞출 수 없는 수치라는 걸 압니다. 하지만 무조건 안 된다고 쳐내기보다, End User의 관점에서
        생각해 봅시다. 만약 우리가 50%라는 도전적인 목표에 최대한 다가가려면, 무엇을 과감하게 덜어내야 할까요? 무작정
        야근하는 대신, 우리의 데이터와 협의를 바탕으로 50% 달성을 위한 &apos;파격적인 전제조건&apos;을 도출해
        역제안합시다.&quot;
      </p>
    </div>
  );
}

export function Ep1Scene({ userName }: Ep1SceneProps) {
  const { episode1Choice, setEpisode1Choice } = useStore();
  const [firstQuote, narration, secondQuote] = ep1Scene.dialogue;

  return (
    <section className="ep1-novel-page mx-auto w-full max-w-6xl space-y-4">
      <div>
        <h2 className="font-alice text-3xl font-black text-[#111] sm:text-4xl">{ep1Scene.title}</h2>
        <p className="mt-3 font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:text-[21px]">
          {renderWithBold(replaceUserName(ep1Scene.situation, userName))}
        </p>
      </div>

      <section className="ep1-manhwa-panel relative overflow-hidden border-4 border-black p-4 shadow-[8px_8px_0px_#111111] sm:p-5">
        <div className="grid min-h-[330px] gap-4 lg:grid-cols-[280px_1fr]">
          <div className="flex items-end justify-start">
            <div className="relative h-56 w-40 sm:h-64 sm:w-44">
              <Image src="/choi-seongmin.svg" alt="최성민 상무 일러스트" fill className="object-contain object-bottom" priority />
            </div>
          </div>

          <div className="space-y-3">
            {firstQuote ? (
              <div className="ep1-speech-bubble border-4 border-black bg-white p-4 sm:p-5">
                <p className="mb-2 inline-flex items-center gap-1.5 border-2 border-black bg-[#111] px-2 py-0.5 font-sans text-[11px] font-black text-white">
                  <MessageSquareQuote className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  최성민 상무
                </p>
                <p className="font-sans text-[17px] font-medium leading-[1.85] text-[#111] sm:text-[18px]">
                  {renderWithBold(replaceUserName(firstQuote, userName))}
                </p>
              </div>
            ) : null}

            {narration ? (
              <p className="my-6 px-1 font-sans text-[16px] font-medium leading-relaxed text-[#111] sm:my-8 sm:text-[17px]">
                {renderWithBold(replaceUserName(narration, userName))}
              </p>
            ) : null}

            {secondQuote ? (
              <div className="ep1-speech-bubble border-4 border-black bg-white p-4 sm:p-5">
                <p className="mb-2 inline-flex items-center gap-1.5 border-2 border-black bg-[#111] px-2 py-0.5 font-sans text-[11px] font-black text-white">
                  <MessageSquareQuote className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                  최성민 상무
                </p>
                <p className="font-sans text-[17px] font-medium leading-[1.85] text-[#111] sm:text-[18px]">
                  {renderWithBold(replaceUserName(secondQuote, userName))}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <p className="my-12 font-sans text-[19px] font-medium leading-relaxed text-[#111] sm:my-14 sm:text-[21px]">
          {renderActionPrompt()}
        </p>
        <div className="space-y-3">
          {ep1Options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setEpisode1Choice(opt.id)}
              className={`ep1-option-card w-full border-4 p-4 text-left transition-all ${
                episode1Choice === opt.id ? "ep1-option-card-selected" : "ep1-option-card-idle"
              }`}
            >
              <div className="relative grid gap-3 md:grid-cols-[300px_1fr] md:items-start">
                <span className="pointer-events-none absolute bottom-0 left-[300px] top-0 hidden w-1 bg-black md:block" aria-hidden />
                <div className="md:pr-4">
                  <p className="mb-2 inline-flex items-center gap-1.5 border-2 border-black bg-[#111] px-2 py-0.5 font-sans text-[11px] font-black text-white">
                    Option {opt.id}
                  </p>
                  <p className="font-alice text-2xl font-black leading-tight text-[#111] sm:text-[30px]">
                    {renderOptionTitle(opt.id)}
                  </p>
                </div>
                <div className="md:pl-4">
                  <div className="font-sans text-[16px] font-medium leading-relaxed text-[#111] sm:text-[17px]">
                    {renderOptionSummary(opt.id, userName)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
