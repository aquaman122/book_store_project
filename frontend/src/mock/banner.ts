import { http, HttpResponse } from "msw";
import { Banner } from "@/models/banner.model";

const bannersData:Banner[] = [
  {
    id: 1,
    title: "배너1 제목", 
    description: "banner 1 description",
    image: "https://picsum.photos/id/11/1200/400",
    url: "https://some.url",
    target: "_blank"
  },
  {
    id: 2,
    title: "배너2 제목", 
    description: "banner 2 description",
    image: "https://picsum.photos/id/22/1200/400",
    url: "https://some.url",
    target: "_self"
  },
  {
    id: 3,
    title: "배너3 제목", 
    description: "banner 3 description",
    image: "https://picsum.photos/id/33/1200/400",
    url: "https://some.url",
    target: "_blank"
  },
];

export const banners = http.get("http://localhost:5678/banners", () => {
  return HttpResponse.json(bannersData, {
    status: 200,
  });
});