import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });
cpSync("static", "dist", { recursive: true });
cpSync("manifest.json", "dist/manifest.json");
