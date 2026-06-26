import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const CONTENT_DIR = join(process.cwd(), "content");

/** content/<slug>.md 내용을 읽어온다. 없으면 null. (서버 전용) */
export function getContent(slug: string): string | null {
  try {
    return readFileSync(join(CONTENT_DIR, `${slug}.md`), "utf8");
  } catch {
    return null;
  }
}

/** 상세 내용(.md)이 존재하는 slug 목록. (서버 전용) */
export function contentSlugs(): string[] {
  try {
    return readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}
