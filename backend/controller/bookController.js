const {verifyToken} = require("../middleware/ensureAuthorization");
const { getBooks, getBookById } = require("../service/book");
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
    const book_id = req.params.id;
    try {
        verifyToken(req, res, async () => {
            try {
              const book = await getBookById(book_id, req.user_id);
              if (book) {
                  return res.status(StatusCodes.OK).json(book);
              } else {
                  return res.status(StatusCodes.NOT_FOUND).send("존재하지 않는 도서");
              }
            } catch (err) {
              console.log(err);
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                  message: "서버 오류 발생",
              });
            }
          });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "서버 오류 발생",
        });
    }
};

module.exports = { getAllBooks, getIndividualBook };