import { delay, http, HttpResponse } from 'msw';
import { newsList } from './fakeData/fakePostsList';


export const postsHandler = http.get("/api-admin/v1/posts", async ({ request }) => {
  await delay(1000);

  const url = new URL(request.url);
  const page = !!url.searchParams.get('page') ? +url.searchParams.get('page')! : 1;
  const perPage = !!url.searchParams.get('per_page') ? +url.searchParams.get('per_page')! : 10;
  console.table({ page, perPage, length: newsList.length });

  return new HttpResponse(
    JSON.stringify({
      data: {
        items: newsList.slice((page - 1) * perPage, page * perPage),
        links: {
          first: `https://sib.express/api-admin/v1/posts?page=1`,
          last: null,
          prev: page !== 1 ? `https://sib.express/api-admin/v1/posts?page=${page - 1}` : null,
          next: page * perPage < newsList.length ? `https://sib.express/api-admin/v1/posts?page=${page + 1}` : null,
        },
        meta: {
          current_page: page,
          from: (page - 1) * perPage + 1,
          path: "https://sib.express/api-admin/v1/posts",
          per_page: perPage.toString(),
          to: page * perPage
        }
      },
      errors: null,
      error_message: null,
    }),
    { status: 200 },
  )
});

export const postHandler = http.get("/api-admin/v1/posts/:id", async ({ params }) => {
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
        published_at: "2024-09-23 05:59:57",
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
