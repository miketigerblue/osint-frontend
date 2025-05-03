import { onRequest as __api_analysis_ts_onRequest } from "/Users/mike/osint-frontend/functions/api/analysis.ts"

export const routes = [
    {
      routePath: "/api/analysis",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_analysis_ts_onRequest],
    },
  ]