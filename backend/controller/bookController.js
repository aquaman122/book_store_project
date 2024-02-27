const ensureAuthorization = require("../auth");
const { getBooks, getBookById } = require("../service/book");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

/** (카테고리별, 신간 여부별) 전체 도서 조회  */
const getAllBooks = async (req, res) => {
    try {
        let { category_id, newBook, limit, currentPage } = req.query;
        const offset = (currentPage - 1) * limit;

        const { books, pagination } = await getBooks({ category_id, newBook, limit, offset, currentPage });

        return res.status(StatusCodes.OK).json({ books, pagination });
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "서버 오류 발생",
        });
    }
};

/** 개별 도서 조회 */
const getIndividualBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const authorization = ensureAuthorization(req, res);

        if (authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "로그인 토큰이 만료되었습니다. 다시 로그인하세요.",
            });
        }

        if (authorization instanceof jwt.JsonWebTokenError) {
            console.log(jwt.JsonWebTokenError);
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "잘못된 토큰입니다.",
            });
        }

        const book = await getBookById(bookId, authorization);

        if (book) {
            return res.status(StatusCodes.OK).json(book);
        } else {
            return res.status(StatusCodes.NOT_FOUND).send("존재하지 않는 도서");
        }
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "서버 오류 발생",
        });
    }
};

module.exports = { getAllBooks, getIndividualBook };