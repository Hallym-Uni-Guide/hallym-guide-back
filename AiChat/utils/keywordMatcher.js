/**
 * 비교를 위해 문장을 정리하는 함수
 * 공백과 일부 특수문자를 제거하고 소문자로 변경한다.
 */
function normalizeText(text) {
    if (typeof text !== "string") {
        return "";
    }

    return text
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[?!.~,]/g, "");
}

/**
 * 사용자의 질문과 가장 잘 맞는 FAQ를 찾는다.
 */
function findBestMatchingFAQ(question, faqList) {
    const normalizedQuestion = normalizeText(question);

    let bestMatch = null;
    let highestScore = 0;

    for (const faq of faqList) {
        let score = 0;

        const normalizedFaqQuestion = normalizeText(faq.question);

        // FAQ 질문 전체가 사용자 질문에 포함되는 경우
        if (
            normalizedQuestion.includes(normalizedFaqQuestion) ||
            normalizedFaqQuestion.includes(normalizedQuestion)
        ) {
            score += 5;
        }

        // 키워드가 포함되는 경우
        for (const keyword of faq.keywords || []) {
            const normalizedKeyword = normalizeText(keyword);

            if (
                normalizedKeyword &&
                normalizedQuestion.includes(normalizedKeyword)
            ) {
                score += 2;
            }
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = faq;
        }
    }

    // 점수가 2점 이상인 경우만 FAQ 일치로 판단
    if (highestScore >= 2) {
        return bestMatch;
    }

    return null;
}

module.exports = {
    normalizeText,
    findBestMatchingFAQ
};