import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchCategory } from "../api/category.api";
import { Category } from "../models/category.model";

export const useCategory = () => {
  const location = useLocation();
  const [category, setCategory] = useState<Category[]>([]);

  const setActive = () => {
    const params = new URLSearchParams(location.search);

    if (params.get("category_id")) {
      setCategory((prev) => {
        return prev.map((item) => {
          return {
            ...item,
            isActive: item.category_id === Number(params.get("category_id")),
          };
        });
      });
    } else {
      setCategory((prev) => {
        return prev.map((item) => {
          return {
            ...item,
            isActive: false,
          };
        });
      });
    }
  };

  useEffect(() => {
    fetchCategory().then((category) => {
      if(!category) return;

      const categoryWithAll = [
        {
          category_id: null,
          name: "전체",
        },
        ...category,
      ];
      setCategory(categoryWithAll);
      setActive();
    })
  }, []);

  useEffect(() => {
    setActive();
  }, [location.search]);

  return {category};
}