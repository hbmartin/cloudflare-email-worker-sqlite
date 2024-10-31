import { extract as parseRawEmail } from 'letterparser';

export async function email(message: any, env: any, ctx?: any): Promise<void> {
  const url = env.DISCORD_WEBHOOK_URL;
  const DEFAULT_MAX_LENGTH = 524288; // 512KB
  const maxLenFromEnv = parseInt(env.MAX_LEN);
  const MAX_LEN: number = !isNaN(maxLenFromEnv) && maxLenFromEnv > 0 
    ? maxLenFromEnv 
    : DEFAULT_MAX_LENGTH;
  if (!url) throw new Error('Missing DISCORD_WEBHOOK_URL');

  // Parse email
  const { from, to } = message;
  // BugFix: Replace "UTF-8" with "utf-8" to prevent letterparser from throwing an error for some messages.
  const rawEmail = (await new Response(message.raw).text()).replace(/utf-8/gi, 'utf-8');

  // https://github.com/mat-sz/letterparser
  const email = parseRawEmail(rawEmail);
  const subject = message.headers.get('subject') || email.subject;
  const body = email.text?.substring(MAX_LEN);

  // Send discord message
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body, subject, to, from }),
  });
  if (!response.ok) throw new Error('Failed to post message to Discord webhook.' + (await response.json()));
}
