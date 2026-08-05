const axios = require("axios");
const cheerio = require("cheerio");
const { NOTICE_CATEGORIES } = require("./noticeConfig");

/**
 * 요청한 카테고리의 URL을 찾는다.
 *
 * @param {string} category 대분류
 * @param {string} subCategory 일반공지 하위 분류
 * @returns {{categoryName: string, subCategoryName: string|null, url: string}}
 */
function getCategoryInfo(category, subCategory) {
    const categoryInfo = NOTICE_CATEGORIES[category];

    if (!categoryInfo) {
        throw new Error("존재하지 않는 공지사항 카테고리입니다.");
    }

    /*
     * 일반공지처럼 하위 카테고리가 있는 경우
     */
    if (categoryInfo.subCategories) {
        const selectedSubCategory = subCategory || "all";
        const subCategoryInfo =
            categoryInfo.subCategories[selectedSubCategory];

        if (!subCategoryInfo) {
            throw new Error(
                "존재하지 않는 일반공지 하위 카테고리입니다."
            );
        }

        return {
            categoryName: categoryInfo.name,
            subCategoryName: subCategoryInfo.name,
            url: subCategoryInfo.url,
        };
    }

    /*
     * 학사공지, 안전공지처럼 하위 카테고리가 없는 경우
     */
    return {
        categoryName: categoryInfo.name,
        subCategoryName: null,
        url: categoryInfo.url,
    };
}

/**
 * 학교 공지사항 크롤링
 *
 * @param {object} options 조회 옵션
 * @param {string} options.category 공지 대분류
 * @param {string} options.subCategory 일반공지 하위 분류
 * @param {number} options.limit 공지 개수
 * @returns {Promise<object>}
 */
async function getNotices({
    category = "general",
    subCategory = "all",
    limit = 10,
}) {
    const categoryInfo = getCategoryInfo(
        category,
        subCategory
    );

    if (
        !categoryInfo.url ||
        categoryInfo.url.includes("_URL")
    ) {
        throw new Error(
            `${categoryInfo.categoryName}의 홈페이지 URL이 아직 설정되지 않았습니다.`
        );
    }

    try {
        const response = await axios.get(categoryInfo.url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                    "AppleWebKit/537.36 (KHTML, like Gecko) " +
                    "Chrome/150.0.0.0 Safari/537.36",

                Accept:
                    "text/html,application/xhtml+xml," +
                    "application/xml;q=0.9,*/*;q=0.8",

                "Accept-Language": "ko-KR,ko;q=0.9",
            },

            timeout: 10000,
            maxRedirects: 5,
        });

        const $ = cheerio.load(response.data);
        const notices = [];

        /*
 * 독립 행사 페이지는 일반 게시판이 아니라
 * 행사 캘린더 구조이므로 별도로 크롤링
 */
if (category === "event") {
    const eventNotices = [];

    $(".event-list li, .eventList li, .event-item, .eventItem").each(
        (index, element) => {
            if (eventNotices.length >= limit) {
                return false;
            }

            const item = $(element);

            const fullText = item
                .text()
                .replace(/\s+/g, " ")
                .trim();

            if (!fullText) {
                return;
            }

            const titleElement = item
                .find("a")
                .first();

            const href = titleElement.attr("href");

            const title =
                titleElement.text().replace(/\s+/g, " ").trim() ||
                fullText;

            const dateMatch = fullText.match(
                /\d{4}\.\d{2}\.\d{2}(?:\s*~\s*\d{4}\.\d{2}\.\d{2})?/
            );

            const link = href
                ? href.startsWith("http")
                    ? href
                    : new URL(href, categoryInfo.url).href
                : categoryInfo.url;

            eventNotices.push({
                id: index + 1,
                title,
                writer: "",
                date: dateMatch ? dateMatch[0] : "",
                views: "",
                url: link,
                category,
                categoryName: categoryInfo.categoryName,
                subCategory: null,
                subCategoryName: null,
            });
        }
    );

    /*
     * 클래스 선택자로 못 찾았을 때
     * 행사 페이지 텍스트 구조를 보조 탐색
     */
    if (eventNotices.length === 0) {
        $("li").each((index, element) => {
            if (eventNotices.length >= limit) {
                return false;
            }

            const item = $(element);

            const fullText = item
                .text()
                .replace(/\s+/g, " ")
                .trim();

            const dateMatch = fullText.match(
                /\d{4}\.\d{2}\.\d{2}(?:\s*~\s*\d{4}\.\d{2}\.\d{2})?/
            );

            /*
             * 날짜가 있고 행사 관련 정보가 있는 항목만 선택
             */
            if (
                !dateMatch ||
                !(
                    fullText.includes("행사장소") ||
                    fullText.includes("행사담당부서") ||
                    fullText.includes("진행중") ||
                    fullText.includes("진행예정")
                )
            ) {
                return;
            }

            const titleElement = item.find("a").first();
            const href = titleElement.attr("href");

            let title = titleElement
                .text()
                .replace(/\s+/g, " ")
                .trim();

            if (!title) {
                title = fullText
                    .replace("진행중", "")
                    .replace("진행예정", "")
                    .replace(dateMatch[0], "")
                    .split("행사장소")[0]
                    .trim();
            }

            const link = href
                ? href.startsWith("http")
                    ? href
                    : new URL(href, categoryInfo.url).href
                : categoryInfo.url;

            eventNotices.push({
                id: eventNotices.length + 1,
                title,
                writer: "",
                date: dateMatch[0],
                views: "",
                url: link,
                category,
                categoryName: categoryInfo.categoryName,
                subCategory: null,
                subCategoryName: null,
            });
        });
    }

    if (eventNotices.length === 0) {
        throw new Error(
            "행사 일정을 찾지 못했습니다. 행사 페이지 HTML 구조를 확인해주세요."
        );
    }

    return {
        category,
        categoryName: categoryInfo.categoryName,
        subCategory: null,
        subCategoryName: null,
        notices: eventNotices,
    };
}

        /*
         * 학교 게시판의 각 게시글 행 순회
         */
        $("table tbody tr").each((index, element) => {
            if (notices.length >= limit) {
                return false;
            }

            const row = $(element);
            const columns = row.find("td");

            /*
             * 표 제목 행이나 잘못된 행 제외
             */
            if (columns.length < 3) {
                return;
            }

            /*
             * 상세보기 링크가 있는 제목 찾기
             */
            let titleElement = row
                .find('a[href*="artclView.do"]')
                .first();

            /*
             * artclView.do가 없는 게시판을 위한 보조 선택자
             */
            if (titleElement.length === 0) {
                titleElement = row.find("td a").first();
            }

            const href = titleElement.attr("href");

            const title = titleElement
                .clone()
                .find("img, .new, .category")
                .remove()
                .end()
                .text()
                .replace(/\s+/g, " ")
                .trim();

            if (!title || !href) {
                return;
            }

            const number = columns.eq(0).text().trim();
            const writer = findWriter(row, columns);
            const date = findDate(columns);
            const views = findViews(row, columns);

            const link = href.startsWith("http")
                ? href
                : new URL(href, categoryInfo.url).href;

            notices.push({
                id: number || index + 1,
                title,
                writer,
                date,
                views,
                url: link,
                category,
                categoryName: categoryInfo.categoryName,
                subCategory:
                    categoryInfo.subCategoryName
                        ? subCategory
                        : null,
                subCategoryName:
                    categoryInfo.subCategoryName,
            });
        });

        if (notices.length === 0) {
            throw new Error(
                "공지사항을 찾지 못했습니다. 게시판 HTML 구조 또는 URL을 확인해주세요."
            );
        }

        return {
            category,
            categoryName: categoryInfo.categoryName,
            subCategory:
                categoryInfo.subCategoryName
                    ? subCategory
                    : null,
            subCategoryName: categoryInfo.subCategoryName,
            notices,
        };
    } catch (error) {
        console.error("공지사항 크롤링 실패:", {
            category,
            subCategory,
            url: categoryInfo.url,
            status: error.response?.status,
            message: error.message,
        });

        if (
            error.message.includes("공지사항을 찾지 못했습니다")
        ) {
            throw error;
        }

        throw new Error(
            "학교 공지사항을 가져오지 못했습니다."
        );
    }
}

/**
 * 작성자 추출
 */
function findWriter(row, columns) {
    const classWriter = row
        .find(".td-write, .writer")
        .first()
        .text()
        .trim();

    if (classWriter) {
        return classWriter;
    }

    /*
     * 일반적인 표 구조에서 작성자는 세 번째 열
     */
    return columns.eq(2).text().trim();
}

/**
 * 날짜 형태를 가진 셀 검색
 */
function findDate(columns) {
    let result = "";

    columns.each((index, element) => {
        const text = cheerio
            .load(element)
            .text()
            .replace(/\s+/g, " ")
            .trim();

        const datePattern =
            /\d{4}[-./]\d{1,2}[-./]\d{1,2}/;

        const match = text.match(datePattern);

        if (match) {
            result = match[0];
            return false;
        }
    });

    return result;
}

/**
 * 조회수 추출
 */
function findViews(row, columns) {
    const classViews = row
        .find(".td-access, .views")
        .first()
        .text()
        .trim();

    if (classViews) {
        return classViews;
    }

    const lastColumn = columns.last().text().trim();

    /*
     * 마지막 열이 숫자일 때만 조회수로 판단
     */
    return /^\d+$/.test(lastColumn)
        ? lastColumn
        : "";
}

/**
 * 클라이언트에 제공할 카테고리 목록
 */
function getNoticeCategories() {
    return Object.entries(NOTICE_CATEGORIES).map(
        ([categoryKey, categoryValue]) => ({
            key: categoryKey,
            name: categoryValue.name,

            subCategories: categoryValue.subCategories
                ? Object.entries(
                      categoryValue.subCategories
                  ).map(([subKey, subValue]) => ({
                      key: subKey,
                      name: subValue.name,
                  }))
                : [],
        })
    );
}

module.exports = {
    getNotices,
    getNoticeCategories,
};