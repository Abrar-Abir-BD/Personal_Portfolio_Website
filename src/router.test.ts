// @vitest-environment jsdom
import { expect, test } from "vitest";
import { parseRoute } from "./router";

test("parseRoute", () => {
  expect(parseRoute("/")).toEqual({ page: "main" });
  expect(parseRoute("/index.html")).toEqual({ page: "main" });
  expect(parseRoute("/projects/a%20b/")).toEqual({ page: "project", slug: "a b" });
  expect(parseRoute("/certificates")).toEqual({ page: "certificates" });
  expect(parseRoute("/deploy-check/")).toEqual({ page: "deploy-check" });
  expect(parseRoute("/nope")).toEqual({ page: "not-found" });
  expect(parseRoute("/art/extra")).toEqual({ page: "not-found" });
});
