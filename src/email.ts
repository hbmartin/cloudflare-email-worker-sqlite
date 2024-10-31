import PostalMime from 'postal-mime';
import type { Env } from './types';

export async function email(message: ForwardableEmailMessage, env: Env, ctx?: ExecutionContext): Promise<void> {
  const MAX_LEN = 524288; // 512KB
  const { from, to } = message;
  const email = await PostalMime.parse(message.raw);
  const subject = email.subject;
  const body = email.text?.substring(0, MAX_LEN);
  console.log(from);
  console.log(subject);
  console.log(body);
}
