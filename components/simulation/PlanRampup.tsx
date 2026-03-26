"use client";

const INTRO =
  "실제 사례를 기반으로 만든 에피소드들과 선배 PM들의 꿀팁까지, 깊이 와닿으셨나요?\n빈틈없는 항해 지도를 그리는 '기획(Planning)' 단계를 훌륭하게 완수하셨습니다.\n하지만 지금부터 본격 시작입니다.\n현장에서는 예기치 못한 돌발 변수들이 늘 존재하니까요.";

const PHASES = [
  {
    label: "[착수 단계]",
    text: "프로젝트의 존재 이유(목적)를 정의하고 든든한 후원자(스폰서)를 확보하여 첫 단추를 꿰는 시간입니다.",
  },
  {
    label: "[기획 단계]",
    text: "완벽한 항해 지도를 그리고 자원과 R&R을 분배하는 시간입니다. 리더님께서 방금 무사히 통과하신 바로 그 관문입니다.",
  },
  {
    label: "[실행 단계]",
    text: "팀원들이 현장에서 본격적으로 아웃풋을 만들어냅니다. 잦은 야근, 유관부서의 이기주의, 그리고 실무진의 번아웃에 시달리게 됩니다.",
  },
  {
    label: "[감시 및 통제 단계]",
    text: "완벽했던 계획이 틀어지는 순간입니다. 수시로 터지는 리스크를 매니지하는 리더의 역량이 시험대에 오릅니다.",
  },
  {
    label: "[종료 단계]",
    text: "마침내 성과를 입증하고, 팀원들의 노고를 공정하게 평가하여 '성공적인 피날레(혹은 다음을 위한 자산)'를 만들어내는 마지막 관문입니다.",
  },
];

const OUTRO =
  "자, 이제 계획을 현실로 바꾸기 위해 팀원들이 업무에 집중하여\n아웃풋을 산출해 내는 [실행 단계]로 진입해 봅시다.";

interface PlanRampupProps {
  userName: string;
}

export function PlanRampup({ userName }: PlanRampupProps) {
  return (
    <section className="-mx-6 -mb-6">
      <div className="relative overflow-hidden rounded-none bg-black px-6 py-10 sm:mx-0 sm:rounded-lg sm:px-10 sm:py-12">
        <div className="relative">
          <div className="text-center">
            <h2 className="text-[36px] font-extrabold tracking-tight text-white sm:text-[42px]">Ramp-up</h2>
            <p className="mt-3 text-[16px] font-bold text-white">{userName}님, 다음 여정이 시작됩니다.</p>
          </div>

          <div className="mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <p className="mx-auto mt-8 max-w-3xl whitespace-pre-line text-center text-[16px] leading-[1.95] text-white/90 sm:text-[17px]">
            {INTRO}
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-center text-[16px] font-bold leading-[1.95] text-[#E4003F] sm:text-[17px]">
            앞으로 당신은 프로젝트의 다음 여정을 통과하게 됩니다.
          </p>

          <ul className="mt-10 grid gap-3 sm:gap-4">
            {PHASES.map((phase, i) => (
              <li key={i} className="relative">
                {i <= 1 || i >= 3 ? (
                  <div className="relative overflow-hidden rounded-2xl border border-[#D1D5DB] bg-[#E5E7EB] p-5 text-[15px] leading-[1.9] text-black sm:p-6 sm:text-[16px]">
                    <span className="absolute left-0 top-0 h-full w-[4px] bg-[#9CA3AF]" aria-hidden />
                    {i <= 1 && (
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md border border-[#9CA3AF] bg-[#F3F4F6] px-2 py-1 text-[11px] font-extrabold tracking-[0.08em] text-black">
                          DONE
                        </span>
                        <span className="text-[11px] font-bold tracking-[0.08em] text-black/80">완료된 단계</span>
                      </div>
                    )}
                    <span className="font-semibold">
                      {phase.label} {phase.text}
                    </span>
                  </div>
                ) : (
                  <div className="group relative overflow-hidden rounded-2xl border border-[#E4003F] bg-[#E4003F] p-5 text-[15px] leading-[1.9] text-white transition hover:bg-[#D10039] sm:p-6 sm:text-[16px]">
                    <span className="absolute left-0 top-0 h-full w-[3px] bg-[#E4003F]" aria-hidden />
                    {i === 2 && (
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md border border-white bg-white px-2 py-1 text-[11px] font-extrabold tracking-[0.08em] text-[#E4003F] shadow-[0_8px_18px_rgba(0,0,0,0.16)]">
                          NEXT
                        </span>
                        <span className="text-[11px] font-bold tracking-[0.08em] text-white">다음 단계</span>
                      </div>
                    )}
                    <span>
                      {phase.label} {phase.text}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-3xl whitespace-pre-line text-center text-[16px] leading-[1.95] text-white sm:text-[17px]">
            {OUTRO}
          </p>
        </div>
      </div>
    </section>
  );
}
