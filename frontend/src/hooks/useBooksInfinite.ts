import React from "react";
import { useLocation } from "react-router-dom";
import { fetchBooks } from "../api/books.api";
import { LIMIT } from "../constants/pagiation";
import { QUERYSTRING } from "../constants/querystring";
import { useInfiniteQuery, useQuery } from "react-query";

export const useBooksInfinite = () => {
  const location = useLocation();

  const getBooks = ({ pageParam }: { pageParam?: number }) => {
    const params = new URLSearchParams(location.search);
    const category_id = params.get(QUERYSTRING.CATEGORY_ID) ? Number(params.get(QUERYSTRING.CATEGORY_ID)) : undefined;
    const news = params.get(QUERYSTRING.NEWS) ? true : undefined;
    const limit = LIMIT;
    const currentPage = pageParam;

    return fetchBooks({ category_id, news, currentPage, limit });
  }

  const {data, fetchNextPage, hasNextPage, isFetching} = useInfiniteQuery(["books", location.search], ({ pageParam = 1}) => getBooks({ pageParam }),
  {
    getNextPageParam: (lastPage) => {
      const isLastPage = Math.ceil(lastPage.pagination.totalCount / LIMIT) === lastPage.pagination.currentPage;

      return isLastPage ? null : (lastPage.pagination.currentPage as number) + 1;
    }
  });

  const books = data ? data.pages.flatMap((page) => page.books) : [];
  const isEmpty = books.length === 0; // Define isEmpty here

  const pagination = data ? data.pages[data.pages.length - 1].pagination : {};
  return { 
    books,
    pagination,
    isEmpty,
    isBooksLoading: isFetching, fetchNextPage, hasNextPage,
  };
}

// react-query

// const [books, setBooks] = useState<Book[]>([]);
  // const [pagination, setPagination] = useState<Pagination>({
  //   totalCount: 0,
  //   currentPage: 1,
  // });
  // const [isEmpty, setIsEmpty] = useState(true);

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);

  //   fetchBooks({
  //     category_id: params.get(QUERYSTRING.CATEGORY_ID) ? Number(params.get(QUERYSTRING.CATEGORY_ID)) : undefined,
  //     news: params.get(QUERYSTRING.NEWS) ? true : undefined,
  //     currentPage: params.get(QUERYSTRING.PAGE) ? Number(params.get(QUERYSTRING.PAGE)) : 1,
  //     limit: LIMIT,
  //   }).then(({ books, pagination }) => {
  //     setBooks(books);
  //     setPagination(pagination);
  //     setIsEmpty(books.length === 0);
  //   })
  // }, [location.search])
  