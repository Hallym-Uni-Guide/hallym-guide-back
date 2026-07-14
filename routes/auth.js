const express = require("express");
const users = require("../data/users");
const router = express.Router();

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
        major: foundUser.major//학과
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