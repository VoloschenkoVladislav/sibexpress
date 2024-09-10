import { delay, http, HttpResponse } from 'msw';
import { postsList } from './fakeData/postsList';
import { imagesList } from './fakeData/imagesList';


export const postsHandler = http.get("/api-admin/v1/posts", async ({ request }) => {
  await delay(1000);

  const url = new URL(request.url);
  const page = !!url.searchParams.get('page') ? +url.searchParams.get('page')! : 1;
  const perPage = !!url.searchParams.get('per_page') ? +url.searchParams.get('per_page')! : 10;
  console.table({ page, perPage, length: postsList.length });

  return new HttpResponse(
    JSON.stringify({
      data: {
        items: postsList.slice((page - 1) * perPage, page * perPage),
        links: {
          first: `https://sib.express/api-admin/v1/posts?page=1`,
          last: null,
          prev: page !== 1 ? `https://sib.express/api-admin/v1/posts?page=${page - 1}` : null,
          next: page * perPage < postsList.length ? `https://sib.express/api-admin/v1/posts?page=${page + 1}` : null,
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
          ...imagesList,
          thumb: "thumb_wzjbG29k.jpg",
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

export const uploadThumbnail = http.post("/api-admin/v1/posts/:id/thumbnail", async ({ request }) => {
  const data = await request.formData();
  const file = data.get('file');
  let status: number = 200;
  let error_message: string | null = null;

  if (!file) {
    status = 400;
    error_message = 'Missing document';
    return new HttpResponse('Missing document', { status: 400 })
  }

  if (!(file instanceof File)) {
    status = 400;
    error_message = 'Uploaded document is not a File';
  }

  await delay(3000);
  return new HttpResponse(
    JSON.stringify({
      data: status === 200 ? ({
        // @ts-ignore
        src: await file.text(),
      }) : null,
      error_message: error_message,
      errors: null,
    }),
    { status: 200 },
  )
});
