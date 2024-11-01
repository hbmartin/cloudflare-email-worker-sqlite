import PostalMime from 'postal-mime';
import type { Env } from './types';

export async function email(message: ForwardableEmailMessage, env: Env, ctx?: ExecutionContext): Promise<void> {
  const DEFAULT_MAX_LENGTH = 524288; // 512KB
  const maxLenFromEnv = Number(env.MAX_LEN);
  const MAX_LEN = !Number.isNaN(maxLenFromEnv) && maxLenFromEnv > 0 ? maxLenFromEnv : DEFAULT_MAX_LENGTH;
  const { from, to } = message;
  const email = await PostalMime.parse(message.raw);
  const subject = email.subject;
  const body = email.text?.substring(0, MAX_LEN);
  console.log(
    JSON.stringify({
      level: 'info',
      event: 'email_processed',
      from,
      to,
      subject,
      bodyLength: body?.length ?? 0,
      timestamp: new Date().toISOString(),
    }),
  );
}
