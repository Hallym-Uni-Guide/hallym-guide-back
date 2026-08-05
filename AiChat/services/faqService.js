const path = require("path");

const {
    readJsonFile,
    writeJsonFile
} = require("../utils/fileManager");

const {
    findBestMatchingFAQ
} = require("../utils/keywordMatcher");

const FAQ_FILE_PATH = path.join(
    __dirname,
    "../data/faqData.json"
);

/**
 * 전체 FAQ 목록 불러오기
 */
function getAllFAQs() {
    return readJsonFile(FAQ_FILE_PATH);
}

/**
 * FAQ를 조회 수가 높은 순서로 반환
 */
function getPopularFAQs(limit = 10, category = null) {
    let faqList = getAllFAQs();

    if (category) {
        faqList = faqList.filter(
            faq => faq.category === category
        );
    }

    faqList.sort((a, b) => b.count - a.count);

    return faqList.slice(0, limit);
}

/**
 * FAQ ID로 검색
 */
function getFAQById(id) {
    const faqList = getAllFAQs();

    return faqList.find(
        faq => faq.id === Number(id)
    );
}

/**
 * 사용자 질문과 일치하는 FAQ 검색
 */
function findMatchingFAQ(question) {
    const faqList = getAllFAQs();

    return findBestMatchingFAQ(question, faqList);
}

/**
 * FAQ 조회 수 증가
 */
function increaseFAQCount(id) {
    const faqList = getAllFAQs();

    const faqIndex = faqList.findIndex(
        faq => faq.id === Number(id)
    );

    if (faqIndex === -1) {
        return null;
    }

    faqList[faqIndex].count += 1;

    const saved = writeJsonFile(
        FAQ_FILE_PATH,
        faqList
    );

    if (!saved) {
        throw new Error("FAQ 조회 수를 저장하지 못했습니다.");
    }

    return faqList[faqIndex];
}

/**
 * 새로운 FAQ 등록
 */
function createFAQ(data) {
    const faqList = getAllFAQs();

    const newId =
        faqList.length > 0
            ? Math.max(...faqList.map(faq => faq.id)) + 1
            : 1;

    const newFAQ = {
        id: newId,
        category: data.category,
        question: data.question,
        answer: data.answer,
        keywords: Array.isArray(data.keywords)
            ? data.keywords
            : [],
        count: 0,
        createdAt: new Date().toISOString()
    };

    faqList.push(newFAQ);

    const saved = writeJsonFile(
        FAQ_FILE_PATH,
        faqList
    );

    if (!saved) {
        throw new Error("FAQ를 저장하지 못했습니다.");
    }

    return newFAQ;
}

module.exports = {
    getAllFAQs,
    getPopularFAQs,
    getFAQById,
    findMatchingFAQ,
    increaseFAQCount,
    createFAQ
};