import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { withSecurityHeaders } from "./lib/security-headers.server";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    const response = await next();
    if (response instanceof Response) {
      return withSecurityHeaders(response);
    }
    return response;
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return withSecurityHeaders(
      new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
    );
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
