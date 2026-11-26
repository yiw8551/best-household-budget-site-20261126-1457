// Hearth & Ledger — the hand-in program for the best household budget site
// bounty (Node 22, standard library only). The site itself is plain static
// files under app/ (index.html, CSS, ES modules, its own seed data), so this
// program has one job: copy app/ and screenshots/ from beside this file into
// the grader's output directory and write /output/dossier.json with the
// vendored make.fun library, exactly as the kit requires. It never fetches
// anything, never writes outside the output directory, and runs the same way
// twice — the scorer runs it twice and compares the bytes.
//
// Local check:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader: /output is used instead (MAKEFUN_OUTPUT_DIR unset).

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The grader runs this program twice and demands byte-identical output, so
// the copy must be a plain recursive copy with nothing time-dependent in it:
// no timestamps, no temp files, no network. cpSync of the two directories
// plus one deterministic dossier write is the whole program.
mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The caps mirror the gate's own limits: at most 4 screenshots, each at most
// 256 KiB; app/ at most 993 files and directories and 16 MiB in all; the
// dossier text at most 160 KiB. An entry past any of them is refused here
// with the library's own words, the same refusal the scorer would give.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
