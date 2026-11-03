/** @type {import('next').NextConfig} */
export default {
  async headers() {
    // Allow /widget to be iframed on any site. TODO: restrict per-tenant allowed origins.
    return [{ source: "/widget", headers: [{ key: "Content-Security-Policy", value: "frame-ancestors *" }] }];
  },
};
