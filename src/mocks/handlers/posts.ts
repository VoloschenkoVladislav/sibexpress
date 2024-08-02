import { delay, http, HttpResponse } from 'msw';


export const postsHandler = http.get("/api-admin/v1/posts", async () => {
  await delay(1000);
  return new HttpResponse(
    JSON.stringify({
      data: {
        items: [
          {
            id: 175912,
            title: "Концентрация вредных веществ в Красноярске превышена в 2,5 раза",
            type_id: 2,
            status_id: 1,
            published_at: "2022-02-13 05:40:13"
          },
          {
            id: 175913,
            title: "Опасное загрязнение воздуха отмечено в Новосибирске и Новокузнецке",
            type_id: 1,
            status_id: 1,
            published_at: null
          }
        ],
        links: {
          first: "https://sib.express/api-admin/v1/news?page=1",
          last: null,
          prev: "https://sib.express/api-admin/v1/news?page=1",
          next: "https://sib.express/api-admin/v1/news?page=3"
        },
        meta: {
          current_page: 2,
          from: 11,
          path: "https://sib.express/api-admin/v1/news",
          per_page: "10",
          to: 20
        }
      },
      errors: null,
      error_message: null,
    }),
    { status: 200 },
  )
});

export const postHandler = http.get("/api-admin/v1/post/:id", async ({ params }) => {
  await delay(1500);
  return new HttpResponse(
    JSON.stringify({
      data: {
        id: 153202,
        type_id: 1,
        status_id: 1,
        title: "Читинцы на <b>митинге</b> против обнуления сроков Путина: «20 лет Россией правил вроде б вовсе и не он»",
        content: "<p>Митинг против изменения Конституции прошел в&nbsp;Чите. На&nbsp;акцию пришли около 100 ...",
        media: {
          thumb: {
            src: "thumb_wzjbG29k.jpg"
          },
          images: [
            "1_fk7J0vnn2.jpg",
            "2_lAe29pmt7.jpg"
          ],
          src: "img_posts/153/202/"
        },
        created_at: "2020-03-23 05:59:57",
        updated_at: "2022-05-04 01:13:29",
        published_at: "2020-03-23 05:59:57",
        topics: [
          1,
          2
        ]
      },
      errors: null,
      error_message: null,
    }),
    { status: 200 },
  )
});
