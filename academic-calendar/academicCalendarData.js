/**
 * 2026학년도 학사일정 (임시 예시 데이터)
 *
 * 실제 학교 공식 학사일정으로 교체해야 합니다.
 */
const ACADEMIC_CALENDAR_EVENTS = [
    { start: "2026-02-23", end: "2026-02-25", label: "신입생 오리엔테이션", isHoliday: false },
    { start: "2026-03-02", end: "2026-03-02", label: "1학기 개강", isHoliday: false },
    { start: "2026-03-02", end: "2026-03-08", label: "수강신청 변경/철회 기간", isHoliday: false },
    { start: "2026-04-20", end: "2026-04-24", label: "1학기 중간고사", isHoliday: false },
    { start: "2026-05-05", end: "2026-05-05", label: "어린이날", isHoliday: true },
    { start: "2026-06-15", end: "2026-06-19", label: "1학기 기말고사", isHoliday: false },
    { start: "2026-06-19", end: "2026-06-19", label: "1학기 종강", isHoliday: false },
    { start: "2026-06-22", end: "2026-07-10", label: "여름 계절학기", isHoliday: false },
    { start: "2026-08-01", end: "2026-08-31", label: "여름방학", isHoliday: false },
    { start: "2026-09-01", end: "2026-09-01", label: "2학기 개강", isHoliday: false },
    { start: "2026-09-01", end: "2026-09-07", label: "수강신청 변경/철회 기간", isHoliday: false },
    { start: "2026-10-03", end: "2026-10-03", label: "개천절", isHoliday: true },
    { start: "2026-10-09", end: "2026-10-09", label: "한글날", isHoliday: true },
    { start: "2026-10-19", end: "2026-10-23", label: "2학기 중간고사", isHoliday: false },
    { start: "2026-12-14", end: "2026-12-18", label: "2학기 기말고사", isHoliday: false },
    { start: "2026-12-18", end: "2026-12-18", label: "2학기 종강", isHoliday: false },
    { start: "2026-12-19", end: "2027-02-28", label: "겨울방학", isHoliday: false },
];

module.exports = {
    ACADEMIC_CALENDAR_EVENTS,
};
