import { readFileSync } from "fs";
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
