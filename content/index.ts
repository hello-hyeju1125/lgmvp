/**
 * 콘텐츠 모듈 인덱스.
 * 모든 문구에서 {User_Name}은 저장된 닉네임으로 치환하여 사용합니다.
 * @see lib/replaceUserName
 */

export { guideScript, GUIDE_VIDEO_URL } from "./onboarding";
export { mailContent, championQuotation } from "./mail";
export { teamMembers, stakeholders, projectOverview } from "./team";
export type { TeamMemberProfile, StakeholderProfile } from "./team";
export { tutorialContent } from "./tutorial";
export { ep1Scene, ep1Options, ep1Results, ep1SeniorTip } from "./episode1";
export {
  charterBlocks,
  ep2Dialogue,
  ep2Patterns,
  ep2SurvivalGuideline,
} from "./episode2";
export type { CharterBlockDef } from "./episode2";
