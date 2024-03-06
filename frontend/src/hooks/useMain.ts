import { fetchBanners } from "@/api/banner.api";
import { fetchBestBooks, fetchBooks } from "@/api/books.api";
import { fetchReviewAll } from "@/api/review.api";
import { Banner } from "@/models/banner.model";
import { Book, BookReviewItem } from "@/models/book.model";
import { useEffect, useState } from "react";

export const useMain = () => {
  const [reviews, setReviews] = useState<BookReviewItem[]>([]);
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [bestBooks, setBestBooks] = useState<Book[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);


  useEffect(() => {
    fetchReviewAll().then((reivews) => {
      setReviews(reivews);
    });

    fetchBooks({ 
      category_id: undefined,
      news: true,
      currentPage: 1,
      limit: 4,
    }).then(({ books }) => {
      setNewBooks(books);
    });

    fetchBestBooks().then((books) => {
      setBestBooks(books);
    });

    fetchBanners().then((banners) => {
      setBanners(banners);
    })

  }, []);

  return { reviews, newBooks, bestBooks, banners };
}