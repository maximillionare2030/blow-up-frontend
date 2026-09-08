import { readFileSync } from "fs";

test("design tokens are defined once in globals.css", () => {
  const css = readFileSync("app/globals.css", "utf8");
  for (const token of ["--color-accent: #c4f82a", "--color-positive: #4ade80",
                       "--color-negative: #f87171", "--color-warning: #fbbf24",
                       "--color-neutral: #71717a", "--color-hairline"]) {
    expect(css).toContain(token);
  }
  // the acid lime is defined exactly once
  expect(css.match(/#c4f82a/gi)?.length).toBe(1);
});
