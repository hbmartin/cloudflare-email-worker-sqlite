import { describe, expect, it, vi } from 'vitest';
import { createEmailMessage } from '../test/helpers/createEmailMessage';
import { email } from './email';

describe(email.name, async () => {
  // @ts-ignore -- defined in .env using vitest-environment-miniflare
  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz';

  // Disable Fetch API from making real network requests
  const fetchMock = getMiniflareFetchMock();
  fetchMock.disableNetConnect();

  // Intercept calls to Discord's webhook API
  const origin = fetchMock.get('https://discord.com');
  origin
    .intercept({ method: 'POST', path: /api\/webhooks\/.*/ })
    .reply(200, 'Discord is happy in this Mock!')
    .persist();

  it.skip('handles a test email', async () => {
    // Arrange
    const message: EmailMessage = await createEmailMessage();

    // Act
    const call = email(message, { });

    // Assert
    await expect(call).resolves.toBeUndefined();
  });

  it.skip('does not leave open connections', async () => {
    // Arrange
    const message: EmailMessage = await createEmailMessage();

    // Act
    await email(message, { });

    // Assert
    fetchMock.assertNoPendingInterceptors();
  });

  it.skip('uses the webhook url', async () => {
    // Arrange
    const fetchSpy = vi.spyOn(global, 'fetch');
    const message: EmailMessage = await createEmailMessage();

    // Act
    await email(message, { });

    // Assert
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(DISCORD_WEBHOOK_URL, expect.anything());
  });

  it.skip('correctly passes the body to the webhook', async () => {
    // Arrange
    const fetchSpy = vi.spyOn(global, 'fetch');
    const message: EmailMessage = await createEmailMessage({ body: 'Hello\nI have a question\nBye!' });

    // Act
    await email(message, { });

    // Assert
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ body: expect.stringContaining('I have a question') }),
    );
  });

  it.skip("throws immediately if the webhook url isn't set", async () => {
    // Arrange
    const message: EmailMessage = await createEmailMessage();

    // Act
    const call = email(message, { });

    // Assert
    await expect(call).rejects.toThrow('Missing DISCORD_WEBHOOK_URL');
  });

  it.skip('reports errors', async () => {
    // Arrange
    const message: EmailMessage = await createEmailMessage();
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementationOnce(() => {
      throw new Error('Something unexpected');
    });

    // Act
    const invocation = email(message, { DISCORD_WEBHOOK_URL });
    const calls = fetchSpy.mock.calls;

    // Assert
    await expect(invocation).resolves.toBeUndefined();
    expect(fetchSpy.mock.calls[1]).toStrictEqual([
      expect.any(String),
      expect.objectContaining({ body: expect.stringContaining('Something unexpected') }),
    ]);
  });

  it.skip('reports an error if the response is not ok', async () => {
    // Arrange
    const message: EmailMessage = await createEmailMessage();
    // @ts-ignore
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve('Something unexpected') });
    });

    // Act
    const invocation = email(message, { DISCORD_WEBHOOK_URL });

    // Assert
    await expect(invocation).resolves.toBeUndefined();
    expect(fetchSpy.mock.calls[1]).toStrictEqual([
      expect.any(String),
      expect.objectContaining({ body: expect.stringContaining('Something unexpected') }),
    ]);
  });

  it.skip('throws if the error can not be reported', async () => {
    // Arrange
    const message: EmailMessage = await createEmailMessage();
    // @ts-ignore
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve('Something unexpected') });
    });

    // Act
    const invocation = email(message, { DISCORD_WEBHOOK_URL });

    // Assert
    await expect(invocation).rejects.toThrow('Failed to post error to Discord webhook.');
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
