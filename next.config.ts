import type { NextConfig } from "next";

// GitHub Pages는 https://<user>.github.io/<repo>/ 하위 경로로 서빙되므로
// CI(워크플로)에서 GITHUB_PAGES=true 일 때만 basePath/assetPrefix를 붙인다.
// 로컬 dev/build 는 경로 없이 그대로 동작.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "learning-roadmap";

const nextConfig: NextConfig = {
  output: "export", // 정적 HTML로 내보내기 (서버 불필요)
  trailingSlash: true, // /topic/rest/ → index.html, 새로고침 404 방지
  basePath: isGithubPages ? `/${repo}` : "",
  assetPrefix: isGithubPages ? `/${repo}/` : "",
  images: { unoptimized: true }, // 정적 export 에서는 이미지 최적화 서버가 없음
};

export default nextConfig;
