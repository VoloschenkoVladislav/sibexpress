import { nanoid } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';


export const authHandler = http.post("/api-admin/v1/auth", async ({ request}) => {
  const token = nanoid();
  const body = await request.json() as { email: string | null, password: string | null };
  const email = body.email;
  const password = body.password;

  let data = null;
  let errors: null | { email?: string[], password?: string[] } = null
  let status: number = 200;

  if (
    email === 'mail@mail.ru'
    && password === '123'
  ) {
    data = {
      id: 1,
      access_token: token,
      access_type: "Bearer",
      expires: "2025-05-06 07:06:28",
      abilities:[
        "postCreate",
        "postView",
        "postEdit",
        "newsDelete"
      ]
    };
  } else {
    errors = {};
    
    if (!email) {
      errors.email = ["The email field is required."];
    } else if (email !== 'mail@mail.ru') {
      errors.email = ["Invalid email."];
    }

    if (!password) {
      errors.password = ["The password field is required."];
    } else if (password !== '123') {
      errors.password = ["Invalid password."];
    }

    status = 422;
  }

  return new HttpResponse(
    JSON.stringify({
      data,
      errors,
      error_message: null,
    }),
    { status },
  )
});

export const meHandler = http.get("/api-admin/v1/me", () => {
  return new HttpResponse(
    JSON.stringify({
      data: {
        id: 1,
        name: 'Владслав Волощенко',
        email: 'mail@mail.ru',
        authorized_at: "2022-02-08 06:20:58",
        expires: "2022-05-09 06:20:58",
        permissions: [
          "newsCreate",
          "newsView",
          "newsEdit",
          "newsDelete"
        ],
      },
      errors: null,
      error_message: null,
    }),
    { status: 200 },
  )
});

export const logoutHandler = http.get("/api-admin/v1/logout", () => {
  return new HttpResponse(
    JSON.stringify({
      data: null,
      errors: null,
      error_message: 'Unauthorized',
    }),
    { status: 401 },
    // JSON.stringify({
    //   data: null,
    //   errors: null,
    //   error_message: null,
    // }),
    // { status: 200 },
  )
});
