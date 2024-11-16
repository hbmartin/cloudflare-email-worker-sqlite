export async function sendPushoverNotification(
  title: string,
  message: string,
  token?: string,
  user?: string,
): Promise<number> {
  if (!token || token.startsWith("$") || !user || user.startsWith("$")) {
    return -2;
  }
  const formData = new FormData();
  formData.append("token", token);
  formData.append("user", user);
  formData.append("title", title.substring(0, 250));
  formData.append("message", message.substring(0, 1024));

  try {
    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      body: formData,
    });

    return response.status;
  } catch (error) {
    console.error("Error sending notification:", error);
    return -1;
  }
}
