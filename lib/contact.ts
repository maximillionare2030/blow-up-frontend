export const contactTopics = {
  support: "General support",
  privacy: "Privacy",
  deletion: "Account deletion",
  legal: "Legal / terms",
} as const;

export type ContactTopic = keyof typeof contactTopics;

export function isContactTopic(value: string): value is ContactTopic {
  return Object.hasOwn(contactTopics, value);
}

export type ContactState = { status: "idle" | "success" | "error"; message: string };
