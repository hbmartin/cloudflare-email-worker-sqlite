import type { ForwardableEmailMessage } from "@cloudflare/workers-types";
import PostalMime from "postal-mime";
import type { Env } from "./types";

export async function email(
  message: ForwardableEmailMessage,
  env: Env,
  ctx?: ExecutionContext,
): Promise<void> {
  const maxLenFromEnv = Number(env.MAX_LEN);
  const maxLen =
    !Number.isNaN(maxLenFromEnv) && maxLenFromEnv > 0 ? maxLenFromEnv : 524288; // 512KB
  const { from, to } = message;
  const email = await PostalMime.parse(message.raw);
  const subject = email.subject;
  const body = email.text?.substring(0, maxLen);
  // biome-ignore lint/suspicious/noConsoleLog: testing
  console.log(
    JSON.stringify({
      level: "info",
      event: "email_processed",
      from,
      to,
      subject,
      bodyLength: body?.length ?? 0,
      timestamp: new Date().toISOString(),
    }),
  );
}
