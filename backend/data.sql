INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다", 20000, "2019-01-01")

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다", 20000, "2023-11-01")

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("백설공주들", "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다", 20000, "2023-12-23")

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다", 20000, "2022-04-12")

SELECT * FROM LEFT
JOIN category ON books.category_id = category.id;

SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = 1

// 좋아요 삭제
DELETE FROM likes WHERE users_id = ? AND liked_books_id = ?;

// 장바구니 담기
INSERT INTO cart_items (books_id, quantity, users_id) VALUES (?, ?, ?);

// 장바구니 조회
SELECT cart_items.id, books_id, title, summary, quantity, price
FROM cart_items LEFT JOIN books
ON cart_items.books_id = books.id;

// 장바구니 아이템 조희
DELETE FROM cart_items WHERE id = ?;

// 장바구니에서 선택한 아이템 목록 조희
SELECT * FROM BOARD.cart_items WHERE users_id=? AND id IN (?, ?);