import { render, screen } from "@testing-library/react";
import MarketingLayout from "@/app/(marketing)/layout";

describe("marketing layout", () => {
  it("wraps children and applies the display font scope", () => {
    render(<MarketingLayout><p>content</p></MarketingLayout>);
    const child = screen.getByText("content");
    expect(child.closest("div")?.className).toMatch(/font-display/);
  });
});
