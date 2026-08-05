/**
 * 검색 "학교생활" 카테고리용 사이트 기능 안내
 *
 * 홈페이지 "학교생활" 메뉴 및 신입생 가이드에서 제공하는 페이지들을
 * 검색 결과로 노출하기 위한 정적 데이터.
 */
const SCHOOL_LIFE_ITEMS = [
    {
        title: "전공 안내",
        content: "단과대학별 전공 소개와 커리큘럼 로드맵을 확인할 수 있어요.",
        url: "/major",
    },
    {
        title: "신입생 가이드",
        content: "수강신청, 학생증, 장학금 등 신입생이 알아야 할 정보를 모아뒀어요.",
        url: "/freshman-guide",
    },
    {
        title: "수강신청 안내",
        content: "수강신청 일정부터 장바구니 담기, 정정기간까지 절차를 정리했어요.",
        url: "/course-registration",
    },
    {
        title: "휴·복학 안내",
        content: "현재 학적 상태를 확인·변경하고, 휴학·복학 관련 공지를 모아볼 수 있어요.",
        url: "/leave-of-absence",
    },
    {
        title: "학생증",
        content: "로그인하면 이름·학번·전공이 담긴 모바일 학생증을 바로 확인할 수 있어요.",
        url: "/student-id",
    },
    {
        title: "졸업 안내",
        content: "졸업 기준일, 심사료 납부 등 졸업 관련 학사일정과 공지를 확인하세요.",
        url: "/graduation",
    },
    {
        title: "장학금 안내",
        content: "성적·근로·교외 장학 등 학교 장학 공지를 모아서 확인할 수 있어요.",
        url: "/scholarship",
    },
];

module.exports = {
    SCHOOL_LIFE_ITEMS,
};
