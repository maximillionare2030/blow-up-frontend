import { readFileSync, readdirSync } from "fs";
import { join } from "path";

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

test("no source files outside app/globals.css contain the lime token", () => {
  const dirs = ["app", "components", "lib"];
  const limeHex = "#c4f82a";

  function walkDir(dir: string): string[] {
    const files: string[] = [];
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "globals.css") continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...walkDir(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        files.push(fullPath);
      }
    }
    return files;
  }

  for (const sourceDir of dirs) {
    const files = walkDir(sourceDir);
    for (const file of files) {
      const content = readFileSync(file, "utf8");
      expect(content.toLowerCase()).not.toContain(limeHex.toLowerCase());
    }
  }
});
