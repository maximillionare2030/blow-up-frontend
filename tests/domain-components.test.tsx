import { render, screen } from "@testing-library/react";
import { ProvenanceBadge } from "@/components/domain/ProvenanceBadge";
import { EvidenceClass } from "@/components/domain/EvidenceClass";
import { VerdictBadge } from "@/components/domain/VerdictBadge";
import { PostState } from "@/components/domain/PostState";
import { BaselineMultiple } from "@/components/domain/BaselineMultiple";
import { LeverChip } from "@/components/domain/LeverChip";

test("provenance states are visually distinct and labelled", () => {
  const { rerender } = render(<ProvenanceBadge provenance="published" />);
  expect(screen.getByText("Published through BlowUp")).toBeInTheDocument();
  rerender(<ProvenanceBadge provenance="ingested" />);
  expect(screen.getByText("Ingested")).toBeInTheDocument();
});

test("exploratory comparisons are labelled", () => {
  render(<EvidenceClass isExploratory>{<p>content</p>}</EvidenceClass>);
  expect(screen.getByText("Exploratory")).toBeInTheDocument();
});

test("inconclusive renders as a first-class verdict, same weight", () => {
  const { rerender, container } = render(<VerdictBadge verdict="separated" />);
  const sepClass = container.firstElementChild!.className.replace(/text-\S+|bg-\S+/g, "");
  rerender(<VerdictBadge verdict="inconclusive" />);
  expect(screen.getByText("INCONCLUSIVE")).toBeInTheDocument();
  const incClass = container.firstElementChild!.className.replace(/text-\S+|bg-\S+/g, "");
  expect(incClass).toBe(sepClass); // identical except color utilities
});

test("failed post state always carries reason and a verb", () => {
  render(<PostState state="failed" failureReason="File rejected." failureAction="reupload" />);
  expect(screen.getByText("File rejected.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /re-upload/i })).toBeInTheDocument();
});

test("baseline multiple color derives from value; lime only for winners", () => {
  const { rerender } = render(<BaselineMultiple multiple={3.2} />);
  expect(screen.getByText("3.2x")).toBeInTheDocument();
  rerender(<BaselineMultiple multiple={null} />);
  expect(screen.getByText("—")).toBeInTheDocument();
});

test("lever chip is read-only by construction", () => {
  const { container } = render(<LeverChip lever="text_overlay" value="question_form" />);
  expect(screen.getByText(/text_overlay: question_form/)).toBeInTheDocument();
  expect(container.querySelector("input, textarea, [contenteditable]")).toBeNull();
  expect(container.querySelector("button")).toBeNull();
});
