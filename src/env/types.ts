type Component<T = {}> = {
  name: string;
  url: string;
  meta: T;
};

export type Components = {
  "al-sgov-server": Component;
  "al-db-server": Component;
  "al-auth-server": Component;
  "al-ontographer": Component<{ "workspace-path": string }>;
  "al-termit-server": Component;
  "al-termit": Component<{ "workspace-path": string }>;
  "al-mission-control": Component;
  "al-issue-tracker": Component<{ "new-bug": string; "new-feature": string }>;
};

export type Config = {
  ID: string;
  CONTEXT: string;
  URL: string;
  COMPONENTS: string;
};

export type NetlifyConfig = {
  NETLIFY: string;
  NETLIFY_CONTEXT: string;
  NETLIFY_URL: string;
  NETLIFY_DEPLOY_PRIME_URL: string;
};
