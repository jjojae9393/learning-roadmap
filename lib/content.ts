import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const CONTENT_DIR = join(process.cwd(), "content");

/** 모든 상세 내용을 { slug: markdown } 맵으로 읽어온다. (서버 전용)
 *  정적 사이트라 빌드 시 클라이언트로 통째로 전달해 우측 패널에서 렌더한다. */
export function getAllContents(): Record<string, string> {
  try {
    const out: Record<string, string> = {};
    for (const f of readdirSync(CONTENT_DIR)) {
      if (!f.endsWith(".md")) continue;
      const slug = f.replace(/\.md$/, "");
      out[slug] = readFileSync(join(CONTENT_DIR, f), "utf8");
    }
    return out;
  } catch {
    return {};
  }
}
