import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "3A-Roofing-website-local-backup/**",
      "Atkinson website archive/**",
      ".worktrees/**",
      "archives/**",
      "proposal-assets/**",
      "t3-labs-main-sync/**",
      "t3-labs-private-atkinson-live/**",
      "t3-labs-private/**",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
