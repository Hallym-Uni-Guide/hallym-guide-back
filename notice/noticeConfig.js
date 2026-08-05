/**
 * 한림대학교 공지사항 카테고리 설정
 *
 * URL은 각 공지 메뉴의 실제 주소로 교체해야 합니다.
 */
const NOTICE_CATEGORIES = {
    /*
     * 일반공지
     * 선택하면 국제, 취업/창업, 일반공지, 전체보기, 행사가 표시됨
     */
    general: {
        name: "일반",

        subCategories: {
            international: {
                name: "국제",
                url: "https://www.hallym.ac.kr/hallym/1136/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGaGFsbHltJTJGMTU1JTJGYXJ0Y2xMaXN0LmRvJTNGZmluZENsU2VxJTNEMTM1JTI2ZmluZE9wbndyZCUzRCUyNmZpbmRUeXBlJTNEc2olMjZmaW5kV29yZCUzRCUyNg%3D%3D",
            },

            employment: {
                name: "취업/창업",
                url: "https://www.hallym.ac.kr/hallym/1136/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGaGFsbHltJTJGMTU1JTJGYXJ0Y2xMaXN0LmRvJTNGZmluZENsU2VxJTNEMTM2JTI2ZmluZE9wbndyZCUzRCUyNmZpbmRUeXBlJTNEc2olMjZmaW5kV29yZCUzRCUyNg%3D%3D",
            },

            normal: {
                name: "일반공지",
                url: "https://www.hallym.ac.kr/hallym/1136/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGaGFsbHltJTJGMTU1JTJGYXJ0Y2xMaXN0LmRvJTNGZmluZENsU2VxJTNEMTMzJTI2ZmluZE9wbndyZCUzRCUyNmZpbmRUeXBlJTNEc2olMjZmaW5kV29yZCUzRCUyNg%3D%3D",
            },

            all: {
                name: "전체보기",
                url: "https://www.hallym.ac.kr/hallym/1136/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGaGFsbHltJTJGMTU1JTJGYXJ0Y2xMaXN0LmRvJTNGZmluZENsU2VxJTNEJTI2ZmluZE9wbndyZCUzRCUyNmZpbmRUeXBlJTNEc2olMjZmaW5kV29yZCUzRCUyNg%3D%3D",
            },

            event: {
                name: "행사",
                url: "https://www.hallym.ac.kr/hallym/1136/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGaGFsbHltJTJGMTU1JTJGYXJ0Y2xMaXN0LmRvJTNGZmluZENsU2VxJTNEMTM3JTI2ZmluZE9wbndyZCUzRCUyNmZpbmRUeXBlJTNEc2olMjZmaW5kV29yZCUzRCUyNg%3D%3D",
            },
        },
    },

    /*
     * 아래부터는 독립된 대분류
     */
    event: {
        name: "행사",
        url: "https://www.hallym.ac.kr/hallym/5910/subview.do",
        subCategories: null,
    },

    recruitment: {
        name: "채용공고",
        url: "https://www.hallym.ac.kr/hallym/1137/subview.do",
        subCategories: null,
    },

    scholarship: {
        name: "장학/등록 공지",
        url: "https://www.hallym.ac.kr/hallym/1135/subview.do",
        subCategories: null,
    },

    safety: {
        name: "안전공지",
        url: "https://www.hallym.ac.kr/hallym/8569/subview.do",
        subCategories: null,
    },

    academic: {
        name: "학사공지",
        url: "https://www.hallym.ac.kr/hallym/1134/subview.do",
        subCategories: null,
    },
};

module.exports = {
    NOTICE_CATEGORIES,
};