const express = require("express");
const users = require("../data/users");
const { majors } = require("../../major/data/majors");
const router = express.Router();

const GRADE_OPTIONS = ["1학년", "2학년", "3학년", "4학년"];
const ACADEMIC_STATUS_OPTIONS = ["재학", "휴학", "졸업유예", "졸업", "신입학예정"];

// 아이디 중간 자리를 가려서 노출한다 (예: "tagtest01" -> "ta******1")
function maskId(id) {
    if (id.length <= 2) {
        return id[0] + "*".repeat(id.length - 1);
    }

    return id.slice(0, 2) + "*".repeat(id.length - 3) + id.slice(-1);
}

//회원가입
router.post("/register", (req, res) => {
    const {
        id,
        password,
        name,
        major
    } = req.body;

    // 필수 정보 확인
    if (!id || !password || !name || !major) {
        return res.status(400).json({
            success: false,
            message: "필수 정보가 누락되었습니다."
        });
    }

    // 중복 아이디 확인
    const existingUser = users.find((user) => user.id === id);

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "이미 존재하는 아이디입니다."
        });
    }

    // 새 회원 정보 생성
    const newUser = {
        id,
        password,
        name,
        major
    };

    // 회원 배열에 저장
    users.push(newUser);

    return res.status(201).json({
        success: true,
        message: "회원가입 성공"
    });
});

/*
    아이디 찾기

    POST /api/auth/find-id

    Request Body
    {
        "name": "홍길동",
        "major": "빅데이터전공"
    }
*/
router.post("/find-id", (req, res) => {
    const { name, major } = req.body;

    if (!name || !major) {
        return res.status(400).json({
            success: false,
            message: "이름과 전공을 입력해주세요."
        });
    }

    const matchedUsers = users.filter(
        (user) => user.name === name && user.major === major
    );

    if (matchedUsers.length === 0) {
        return res.status(404).json({
            success: false,
            message: "일치하는 회원 정보를 찾을 수 없습니다."
        });
    }

    return res.status(200).json({
        success: true,
        ids: matchedUsers.map((user) => maskId(user.id))
    });
});

/*
    비밀번호 재설정
    아이디+이름만으로는 동명이인의 비밀번호를 바꿀 수 있어, 전공까지 일치해야 재설정할 수 있다.

    POST /api/auth/reset-password

    Request Body
    {
        "id": "user1",
        "name": "홍길동",
        "major": "빅데이터전공",
        "newPassword": "새비밀번호"
    }
*/
router.post("/reset-password", (req, res) => {
    const { id, name, major, newPassword } = req.body;

    if (!id || !name || !major || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "아이디, 이름, 전공, 새 비밀번호를 모두 입력해주세요."
        });
    }

    if (newPassword.length < 4) {
        return res.status(400).json({
            success: false,
            message: "비밀번호는 4자 이상이어야 합니다."
        });
    }

    const foundUser = users.find(
        (user) => user.id === id && user.name === name && user.major === major
    );

    if (!foundUser) {
        return res.status(404).json({
            success: false,
            message: "일치하는 회원 정보를 찾을 수 없습니다."
        });
    }

    foundUser.password = newPassword;

    return res.status(200).json({
        success: true,
        message: "비밀번호가 재설정되었습니다."
    });
});

/*
    현재 로그인 상태 확인

    GET /api/auth/me
*/
router.get("/me", (req, res) => {
    // 세션에 로그인 사용자 정보가 없는 경우
    if (!req.session.user) {
        return res.status(200).json({
            success: true,
            loggedIn: false,
            user: null
        });
    }

    // 로그인되어 있는 경우
    return res.status(200).json({
        success: true,
        loggedIn: true,
        user: req.session.user
    });
});

/*
    전공/학년/학적 정보 수정 (로그인 필요)

    PATCH /api/auth/me

    Request Body
    {
        "major": "빅데이터전공",
        "grade": "2학년",
        "academicStatus": "재학"
    }
*/
router.patch("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "로그인이 필요합니다."
        });
    }

    const { major, grade, academicStatus } = req.body;

    if (major !== undefined && !majors.includes(major)) {
        return res.status(400).json({
            success: false,
            message: "올바르지 않은 전공입니다."
        });
    }

    if (grade !== undefined && !GRADE_OPTIONS.includes(grade)) {
        return res.status(400).json({
            success: false,
            message: "올바르지 않은 학년입니다."
        });
    }

    if (academicStatus !== undefined && !ACADEMIC_STATUS_OPTIONS.includes(academicStatus)) {
        return res.status(400).json({
            success: false,
            message: "올바르지 않은 학적 상태입니다."
        });
    }

    const foundUser = users.find((user) => user.id === req.session.user.id);

    if (!foundUser) {
        return res.status(404).json({
            success: false,
            message: "사용자를 찾을 수 없습니다."
        });
    }

    if (major !== undefined) {
        foundUser.major = major;
    }

    if (grade !== undefined) {
        foundUser.grade = grade;
    }

    if (academicStatus !== undefined) {
        foundUser.academicStatus = academicStatus;
    }

    req.session.user = {
        ...req.session.user,
        major: foundUser.major,
        grade: foundUser.grade || null,
        academicStatus: foundUser.academicStatus || null
    };

    return res.status(200).json({
        success: true,
        message: "프로필이 업데이트되었습니다.",
        user: req.session.user
    });
});

/*
    로그인

    POST /api/auth/login

    Request Body
    {
        "id": "user1",
        "password": "1234"
    }
*/
router.post("/login", (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).json({
            success: false,
            message: "아이디와 비밀번호를 입력해주세요."
        });
    }

    const foundUser = users.find(
        (user) => user.id === id && user.password === password
    );

    if (!foundUser) {
        return res.status(401).json({
            success: false,
            message: "아이디 또는 비밀번호가 일치하지 않습니다."
        });
    }

    // 비밀번호는 세션에 저장하거나 프론트엔드로 보내면 안 됨
    const loginUser = {
        id: foundUser.id,//학번
        name: foundUser.name,//이름
        major: foundUser.major,//학과
        grade: foundUser.grade || null,//학년
        academicStatus: foundUser.academicStatus || null//학적 상태
    };

    req.session.user = loginUser;

    return res.status(200).json({
        success: true,
        message: "로그인 성공",
        user: loginUser
    });
});

/*
    로그아웃

    POST /api/auth/logout
*/
router.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "로그아웃 처리 중 오류가 발생했습니다."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            success: true,
            message: "로그아웃 성공"
        });
    });
});

module.exports = router;