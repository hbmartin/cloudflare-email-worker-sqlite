import type { ForwardableEmailMessage } from "@cloudflare/workers-types";
import PostalMime from "postal-mime";
import { sendPushoverNotification } from "./pushover";
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
  const result = await env.DB.prepare(
    "INSERT INTO emails (sender, recipient, subject, body) VALUES (?, ?, ?, ?);",
  )
    .bind(from, to, subject, body)
    .run();
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
      result: result,
    }),
  );
  await sendPushoverNotification(
    `Email processed: ${subject}`,
    `From: ${from}\nTo: ${to}\nBody: ${body}`,
    env.PUSHOVER_APP_API_TOKEN,
    env.PUSHOVER_USER_KEY,
  );
}
