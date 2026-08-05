const express = require("express");

const { majors, COLLEGES } = require("../data/majors");
const {
    YEAR_COLORS,
    getMajorCurriculum,
    RETAKE_VS_SUBSTITUTE,
    SUBSTITUTE_NOTICES,
    SUBSTITUTE_FAQ,
    CONTACT_INFO,
} = require("../data/curriculum");
const { UNCLASSIFIED_COLLEGE, getMajorsByCollege } = require("../data/majorColleges");

const router = express.Router();

/*
    전공 목록 및 단과대 목록 조회
    단과대 소속이 공식적으로 확인되지 않은 전공은 "기타"로 분류된다.

    GET /api/majors
*/
router.get("/", (req, res) => {
    const colleges = [...COLLEGES, UNCLASSIFIED_COLLEGE];

    const collegeMajors = {};
    colleges.forEach((college) => {
        collegeMajors[college] = getMajorsByCollege(majors, college);
    });

    res.json({
        success: true,
        majors,
        colleges,
        collegeMajors,
    });
});

/*
    특정 전공의 커리큘럼(로드맵/코드쉐어링 교과목 등) 조회
    아직 데이터가 준비되지 않은 전공은 hasCurriculum: false 로 응답

    GET /api/majors/curriculum?major=빅데이터전공
*/
router.get("/curriculum", (req, res) => {
    const { major } = req.query;

    if (!major) {
        return res.status(400).json({
            success: false,
            message: "major 쿼리 파라미터가 필요합니다.",
        });
    }

    const curriculum = getMajorCurriculum(major);

    if (!curriculum) {
        return res.json({
            success: true,
            hasCurriculum: false,
        });
    }

    res.json({
        success: true,
        hasCurriculum: true,
        curriculum,
        yearColors: YEAR_COLORS,
        retakeVsSubstitute: RETAKE_VS_SUBSTITUTE,
        substituteNotices: SUBSTITUTE_NOTICES,
        substituteFaq: SUBSTITUTE_FAQ,
        contactInfo: CONTACT_INFO,
    });
});

module.exports = router;
