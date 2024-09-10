import { delay, http, HttpResponse } from 'msw';


export const topicsHandler = http.get("/api-admin/v1/topics", () => {
  return new HttpResponse(
    JSON.stringify({
      data: {
        items: [
          {
            id: 1,
            title: "Архитектура"
          },
          {
            id: 2,
            title: "Политика"
          },
          {
            id: 3,
            title: "Погода"
          },
          {
            id: 4,
            title: "Спорт"
          },
          {
            id: 5,
            title: "Экономика"
          },
          {
            id: 6,
            title: "Экология"
          },
        ]
      },
      error_message: null,
      errors: null
    }),
    { status: 200 },
  )
});

export const statusesHandler = http.get("/api-admin/v1/statuses", async () => {
  await delay(1800);
  return new HttpResponse(
    JSON.stringify({
      data: {
        items: [
          {
            id: 1,
            title: "Черновик"
          },
          {
            id: 2,
            title: "Опубликовано"
          },
          {
            id: 3,
            title: "Запланировано"
          },
        ]
      },
      error_message: null,
      errors: null
    }),
    { status: 200 },
  )
});

export const typesHandler = http.get("/api-admin/v1/types", () => {
  return new HttpResponse(
    JSON.stringify({
      data: {
        items: [
          {
            id: 1,
            title: "Без типа"
          },
          {
            id: 2,
            title: "Новость"
          },
          {
            id: 3,
            title: "Срочное"
          },
          {
            id: 4,
            title: "Фотоновость"
          },
        ]
      },
      error_message: null,
      errors: null
    }),
    { status: 200 },
  )
});

export const bannerPlacesHandler = http.get("/api-admin/v1/banner_places", () => {
  return new HttpResponse(
    JSON.stringify({
      data: {
        items: [
          {
            id: 1,
            title: "Сквозной в шапке"
          },
          {
            id: 2,
            title: "Под текстом новости"
          },
          {
            id: 3,
            title: "Сквозной всплывающий баннер"
          },
        ]
      },
      error_message: null,
      errors: null
    }),
    { status: 200 },
  )
});
