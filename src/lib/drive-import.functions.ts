import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const runDriveImport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ secret: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    if (data.secret !== process.env["DRIVE_IMPORT_SECRET"]) throw new Error("Forbidden");
    const { runImport } = await import("./drive-import.server");
    return runImport();
  });
