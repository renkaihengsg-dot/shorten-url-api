declare namespace NodeJS {
  interface ProcessEnv {
    MYSQLCONNSTR: string; // now TypeScript knows this exists
    // add more env vars here if needed
  }
}
