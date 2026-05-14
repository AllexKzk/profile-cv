export interface CatalogSkill {
  label: string;
  icon?: string;
  aliases: string[];
  onlyDev?: boolean;
  onlyHR?: boolean;
}

export interface SkillsCatalogSection {
  items: CatalogSkill[];
  onlyDev?: boolean;
  onlyHR?: boolean;
}

export const SKILLS_CATALOG: Record<string, SkillsCatalogSection> = {
  "skills.preferably": {
    items: [
      {
        label: "TypeScript",
        icon: "simple-icons:typescript",
        aliases: [
          "typescript",
          "ts",
          "javascript",
          "js",
          "es6",
          "es2015",
          "es2020",
          "ecmascript",
        ],
      },
      {
        label: "Vue",
        icon: "simple-icons:vuedotjs",
        aliases: ["vue", "vue 3", "vuejs", "vue.js"],
      },
      {
        label: "Nuxt",
        icon: "simple-icons:nuxt",
        aliases: ["nuxt", "nuxt 3", "nuxtjs", "nuxt.js"],
      },
      {
        label: "Pinia",
        icon: "simple-icons:pinia",
        aliases: ["vue", "vue 3", "vuejs", "vue.js"],
        onlyDev: true,
      },
    ],
  },
  "skills.additionally": {
    items: [
      {
        label: "JavaScript",
        icon: "simple-icons:javascript",
        aliases: ["js", "javascript", "ecmascript", "es6"],
      },
      {
        label: "React",
        icon: "simple-icons:react",
        aliases: ["react", "reactjs", "react.js"],
      },
      {
        label: "Next.js",
        icon: "simple-icons:nextdotjs",
        aliases: ["next", "nextjs", "next.js"],
      },
      {
        label: "Redux",
        icon: "simple-icons:redux",
        aliases: ["redux", "reduxjs", "redux.js", "redux toolkit"],
      },
      {
        label: "Zustand",
        icon: "simple-icons:zustand",
        aliases: ["zustand"],
      },
      {
        label: "Mobx",
        icon: "simple-icons:mobx",
        aliases: ["mobx"],
      },
    ],
  },
  "skills.layout": {
    items: [
      {
        label: "HTML5",
        icon: "simple-icons:html5",
        aliases: ["html", "html5", "html modules", "htmlmodules"],
      },
      {
        label: "CSS3",
        icon: "simple-icons:css3",
        aliases: ["css", "css3", "css modules", "cssmodules"],
      },
      {
        label: "SCSS",
        icon: "simple-icons:sass",
        aliases: [
          "scss",
          "sass",
          "sass css",
          "sass css modules",
          "sasscss",
          "sasscssmodules",
        ],
      },
    ],
  },
  "skills.UI": {
    items: [
      {
        label: "Tailwind CSS",
        icon: "simple-icons:tailwindcss",
        aliases: ["tailwind", "tailwindcss", "tailwind css"],
      },
      {
        label: "shadcn/ui",
        icon: "simple-icons:shadcnui",
        aliases: ["shadcn", "shadcn/ui", "shadcn ui"],
      },
      {
        label: "MUI",
        icon: "simple-icons:mui",
        aliases: ["mui", "material ui", "material-ui"],
      },
      {
        label: "Ant Design",
        icon: "simple-icons:antdesign",
        aliases: ["ant", "ant design", "ant-design"],
      },
      {
        label: "Bootstrap",
        icon: "simple-icons:bootstrap",
        aliases: ["bootstrap", "bootstrap css"],
      },
    ],
  },
  "skills.api": {
    items: [
      {
        label: "REST API",
        aliases: ["rest", "restful", "rest api", "openapi", "open api"],
      },
      {
        label: "GraphQL",
        icon: "simple-icons:graphql",
        aliases: ["graphql", "graphql api"],
      },
      {
        label: "WebSockets",
        icon: "simple-icons:socketdotio",
        aliases: [
          "socket",
          "socket io",
          "websocket",
          "websocket api",
          "ws",
          "websockets",
          "wss",
        ],
      },
    ],
  },
  "skills.architecture": {
    onlyDev: true,
    items: [
      {
        label: "Micro frontends",
        aliases: [
          "microservices",
          "microservice",
          "micro frontend",
          "micro frontends",
        ],
      },
      {
        label: "Monolith",
        aliases: ["monolith", "monolith architecture"],
      },
      {
        label: "FSD",
        aliases: ["fsd", "feature-sliced design"],
      },
      {
        label: "Atomic Design",
        aliases: ["atomic design", "atomic"],
      },
    ],
  },
  "skills.testing": {
    items: [
      {
        label: "Jest",
        icon: "simple-icons:jest",
        aliases: ["jest", "jest testing"],
      },
      {
        label: "Cypress",
        icon: "simple-icons:cypress",
        aliases: ["cypress"],
      },
      {
        label: "Lighthouse",
        icon: "simple-icons:lighthouse",
        aliases: ["lighthouse", "core web vitals", "web vitals", "cwv"],
      },
      {
        label: "Postman",
        icon: "simple-icons:postman",
        aliases: ["postman"],
      },
    ],
  },
  "skills.tooling": {
    items: [
      {
        label: "Vite",
        icon: "simple-icons:vite",
        aliases: ["vite", "vitejs", "vite.js"],
      },
      {
        label: "Webpack",
        icon: "simple-icons:webpack",
        aliases: ["webpack", "webpackjs", "webpack.js"],
      },
      {
        label: "Babel",
        icon: "simple-icons:babel",
        aliases: ["babel", "babeljs", "babel.js"],
      },
      {
        label: "ESLint",
        icon: "simple-icons:eslint",
        aliases: ["eslint", "eslintjs", "eslint.js"],
      },
      {
        label: "Prettier",
        icon: "simple-icons:prettier",
        aliases: ["prettier", "prettierjs", "prettier.js"],
      },
      {
        label: "Git",
        icon: "simple-icons:git",
        aliases: ["git", "git-scm", "git-bash"],
      },

      {
        label: "Docker",
        icon: "simple-icons:docker",
        aliases: ["docker", "docker container", "docker image"],
      },
      {
        label: "Kubernetes",
        icon: "simple-icons:kubernetes",
        aliases: ["kubernetes", "k8s", "k8s cluster", "k8s node"],
      },
    ],
  },
  "skills.backend": {
    onlyDev: true,
    items: [
      {
        label: "Node.js",
        icon: "simple-icons:nodedotjs",
        aliases: ["node", "nodejs", "node.js"],
      },
      {
        label: "NestJS",
        icon: "simple-icons:nestjs",
        aliases: ["nest", "nestjs", "nest.js"],
      },
      {
        label: "Express",
        icon: "simple-icons:express",
        aliases: ["express", "expressjs", "express.js"],
      },
      {
        label: "MongoDB",
        icon: "simple-icons:mongodb",
        aliases: ["mongo", "mongodb", "nosql"],
      },
      {
        label: "PostgreSQL",
        icon: "simple-icons:postgresql",
        aliases: ["postgres", "postgresql", "sql"],
      },
      {
        label: "MySQL",
        icon: "simple-icons:mysql",
        aliases: ["mysql", "mysql database", "mysql server"],
      },
    ],
  },
  "skills.ai": {
    items: [
      {
        label: "Cursor",
        icon: "simple-icons:cursor",
        aliases: ["cursor", "cursor"],
      },
      {
        label: "Ollama",
        icon: "simple-icons:ollama",
        aliases: ["ollama"],
      },
      {
        label: "Claude",
        icon: "simple-icons:claude",
        aliases: ["claude"],
      },
    ],
  },
  "skills.keywords": {
    onlyHR: true,
    items: [
      {
        label: "CI/CD",
        aliases: ["ci", "cd", "ci/cd"],
      },
      {
        label: "SQL / NoSQL",
        aliases: ["sql", "database", "nosql"],
      },
      {
        label: "FSD",
        aliases: ["fsd", "feature-sliced design"],
      },
      {
        label: "Pixel Perfect",
        aliases: ["pixel perfect", "pixel perfect design"],
      },
      {
        label: "Responsive Design",
        aliases: ["responsive design", "responsive"],
      },
      {
        label: "Accessibility",
        aliases: ["accessibility", "a11y"],
      },
      {
        label: "Performance Optimization",
        aliases: ["performance optimization", "performance"],
      },
      {
        label: "SEO",
        aliases: ["seo", "search engine optimization"],
      },
      {
        label: "SSR",
        aliases: ["ssr", "server-side rendering"],
      },
      {
        label: "SSG",
        aliases: ["ssg", "static site generation"],
      },
      {
        label: "SPA",
        aliases: ["spa", "single page application"],
      },
      {
        label: "PWA",
        aliases: ["pwa", "progressive web application"],
      },
      {
        label: "TMA",
        aliases: ["telegram mini apps", "tma"],
      },
    ],
  },
};

export const CATALOG_LABELS: string[] = Object.values(SKILLS_CATALOG).flatMap(
  (g) => g.items.map((i) => i.label),
);

/**
 * Lowercase token (label or alias) -> canonical catalog label.
 * Used to enforce that any wording variant of a catalog skill is treated as a match.
 */
export const LABEL_BY_ALIAS: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const group of Object.values(SKILLS_CATALOG)) {
    for (const skill of group.items) {
      map[skill.label.toLowerCase()] = skill.label;
      for (const alias of skill.aliases) {
        map[alias.toLowerCase()] = skill.label;
      }
    }
  }
  return map;
})();
