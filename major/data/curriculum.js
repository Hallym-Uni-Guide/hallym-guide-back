// 학년별 색상 (진한 순): 1학년 → 4학년
const YEAR_COLORS = ["#030F5D", "#002496", "#006BFF", "#0095FF"];

// 로드맵 트랙(행) 별 학년(1~4) 교과목.
// 각 학년은 { sem1, sem2 } 학기별 교과목 외에, 두 학기에 걸쳐 폭 전체를 차지하는 `wide` 교과목을 가질 수 있음
// (예: 학년 세미나·캡스톤디자인처럼 학기 구분 없이 표기되는 과목).
const ROADMAP_ROWS = [
    {
        label: "소프트웨어 기반 교과목",
        years: [
            { sem1: ["이산구조론", "자바 프로그래밍 I"], sem2: ["선형 대수", "오픈소스 리눅스 실무", "자바 프로그래밍 II"], wide: [] },
            { sem1: ["논리 설계 및 실험", "자료구조", "C 프로그래밍"], sem2: ["컴퓨터 구조", "알고리즘", "C++ 프로그래밍"], wide: ["파이썬과학 프로그래밍 기초"] },
            { sem1: ["운영체제", "프로그래밍 이론", "계산 이론"], sem2: ["시스템 프로그래밍", "컴파일러 구성", "네트워크 보안"], wide: ["오디세이 세미나 3"] },
            { sem1: [], sem2: [], wide: ["시스템 보안"] },
        ],
    },
    {
        label: "빅데이터 특화 교과목",
        years: [
            { sem1: [], sem2: [], wide: [] },
            { sem1: ["데이터사이언스기초"], sem2: ["데이터베이스기초"], wide: [] },
            { sem1: ["데이터 시각화", "데이터마이닝"], sem2: ["머신러닝", "클라우드 컴퓨팅", "빅데이터 개론"], wide: [] },
            { sem1: [], sem2: [], wide: ["소프트웨어 캡스톤 디자인"] },
        ],
    },
    {
        label: "인공지능 특화 교과목",
        years: [
            { sem1: [], sem2: [], wide: [] },
            { sem1: [], sem2: ["데이터 베이스", "인공지능 수학"], wide: [] },
            { sem1: ["머신러닝 응용", "데이터마이닝"], sem2: ["머신러닝", "텍스트정보처리", "딥러닝이론 및 응용"], wide: [] },
            { sem1: [], sem2: [], wide: ["소프트웨어 캡스톤 디자인"] },
        ],
    },
];

const NOTE_LINES = {
    cert: ["코드쉐어링 인정", "(디지털역량인증제)"],
    crossIt: ["코드쉐어링 인정", "(정보통신공학과)"],
    crossBd: ["코드쉐어링 인정", "(빅데이터전공)"],
    crossSw: ["코드쉐어링 인정", "(SW융합학과)"],
    none: ["-"],
};

const CURRICULUM_COURSES = {
    1: [
        { code: "236403", name: "컴퓨팅적사고와SW코딩", credit: "3-3-0", note: NOTE_LINES.cert },
        { code: "544150", name: "이산수학", credit: "3-3-0", note: NOTE_LINES.crossIt },
        { code: "618301", name: "C프로그래밍", credit: "3-3-0", note: NOTE_LINES.crossIt },
        { code: "612383", name: "논리회로설계", credit: "3-3-0", note: NOTE_LINES.none },
        { code: "614365", name: "자바프로그래밍", credit: "1-0-2", note: NOTE_LINES.crossSw },
        { code: "636467", name: "자료구조", credit: "2-2-2", note: NOTE_LINES.crossIt },
        { code: "309574", name: "확률과통계", credit: "3-3-0", note: NOTE_LINES.crossBd },
        { code: "329879", name: "데이터베이스", credit: "3-3-0", note: NOTE_LINES.crossBd },
        { code: "329689", name: "빅데이터처리", credit: "3-3-0", note: NOTE_LINES.cert },
    ],
    2: [
        { code: "600664", name: "컴퓨터구조", credit: "3-3-0", note: NOTE_LINES.crossIt },
        { code: "729020", name: "알고리즘", credit: "3-3-0", note: NOTE_LINES.cert },
        { code: "507506", name: "운영체제", credit: "3-3-0", note: NOTE_LINES.crossIt },
        { code: "514820", name: "객체지향프로그래밍", credit: "3-2-2", note: NOTE_LINES.crossSw },
        { code: "614101", name: "데이터구조와알고리즘", credit: "3-3-0", note: NOTE_LINES.crossBd },
        { code: "209674", name: "데이터시각화", credit: "3-2-2", note: NOTE_LINES.cert },
        { code: "259953", name: "데이터마이닝", credit: "3-3-0", note: NOTE_LINES.crossBd },
        { code: "209663", name: "클라우드컴퓨팅", credit: "3-3-0", note: NOTE_LINES.crossIt },
        { code: "208727", name: "머신러닝", credit: "3-3-0", note: NOTE_LINES.cert },
        { code: "208721", name: "딥러닝", credit: "3-3-0", note: NOTE_LINES.crossBd },
        { code: "706089", name: "산학협력프로젝트", credit: "2-0-2", note: NOTE_LINES.none },
    ],
};

const MAJOR_CURRICULUM = {
    "빅데이터전공": {
        college: "정보과학대학",
        roadmapRows: ROADMAP_ROWS,
        courses: CURRICULUM_COURSES,
    },
};

const RETAKE_VS_SUBSTITUTE = [
    {
        label: "개요",
        retake: [
            "과거 이수한 과목과 동일과목을 수강하는 경우",
            "수강신청 시 맨 오른쪽에 재이수 구분란이 있으며, 재이수인 경우 y로 표시됨",
            "동일 과목은 2회까지 재이수 가능",
        ],
        substitute: [
            "과거 수강한 과목과 다른 과목을 수강하여 학점을 대체하는 경우",
            "이수구분이 같은 과목에 한하여 대체 지정 가능",
        ],
    },
    {
        label: "신청 시기",
        retake: ["과거 이수한 과목과 동일과목 수강신청 시 자동신청 (별도 지정 필요 없음)"],
        substitute: ["수강신청 완료 후, 별도로 안내된 기간에 신청 (학사일정 및 교내 공지사항 참조)"],
    },
    {
        label: "대상 교과목",
        span: true,
        content: ["취득한 성적의 등급이 C+ 이하인 교과목"],
    },
    {
        label: "공통 유의사항",
        span: true,
        content: [
            "재이수·대체재이수하여 취득한 성적은 A0을 넘을 수 없음",
            "성적 취득과 동시에 이전에 취득한 성적은 무효가 됨",
        ],
    },
];

const SUBSTITUTE_NOTICES = [
    {
        title: "학점이 다른 과목 대체재이수 지정 시 총 취득학점 변동",
        detail: "예시) 3학점 교양 A과목을 현재 학기 1학점 교양 B과목으로 대체재이수 지정 → 총 취득학점 2학점 감소",
    },
    {
        title: "대체재이수 지정으로 대체된 기존 교과목은 이수하지 않은 것과 같음",
        detail: "졸업요건·전공 이수 요건에 반영되어 있던 과목이라면, 지정 전 관련 요건을 다시 확인해야 함",
    },
    {
        title: "전공필수 교과목(전필) 대체재이수는 해당 교과목이 폐강된 경우에만 가능",
        detail: "폐강 여부는 학사공지 또는 이전 강의계획서를 통해 확인 가능",
    },
];

const SUBSTITUTE_FAQ = [
    {
        q: "한 학기당 대체재이수 지정 횟수 제한이 있나요?",
        a: "별도의 횟수 제한은 없습니다. 다만 안내된 신청 기간이 지나면 반영되지 않으니 기간 내에 신청해야 합니다.",
    },
    {
        q: "이수구분이 다른 과목끼리도 대체재이수가 가능한가요?",
        a: "원칙적으로 이수구분(전공·교양 등)이 같은 과목 사이에서만 대체재이수 지정이 가능합니다.",
    },
    {
        q: "대체재이수로 지정된 기존 교과목은 어떻게 처리되나요?",
        a: "이수하지 않은 것으로 처리되며, 졸업요건에 반영되어 있었다면 재확인이 필요합니다.",
    },
    {
        q: "대체재이수 신청 후 취소할 수 있나요?",
        a: "수강신청 변경기간 내에서만 취소 및 재신청이 가능하며, 기간이 지나면 취소할 수 없습니다.",
    },
    {
        q: "대체재이수 관련 문의는 어디로 하나요?",
        a: "소속 학과사무실로 문의하시면 대상 교과목 확인 및 신청 절차를 안내받을 수 있습니다.",
    },
];

const CONTACT_INFO = {
    name: "소프트웨어학부 교학팀",
    phone: "033-248-2340",
    email: "de2340@hallym.ac.kr",
};

function getMajorCurriculum(major) {
    return MAJOR_CURRICULUM[major] || null;
}

module.exports = {
    YEAR_COLORS,
    MAJOR_CURRICULUM,
    getMajorCurriculum,
    RETAKE_VS_SUBSTITUTE,
    SUBSTITUTE_NOTICES,
    SUBSTITUTE_FAQ,
    CONTACT_INFO,
};
