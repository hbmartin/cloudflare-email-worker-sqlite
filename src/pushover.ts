export async function sendPushoverNotification(
  title: string,
  message: string,
  token?: string,
  user?: string,
): Promise<void> {
  if (!token || token.startsWith("$") || !user || user.startsWith("$")) {
    return;
  }
  const formData = new FormData();
  formData.append("token", token);
  formData.append("user", user);
  formData.append("title", title);
  formData.append("message", message);

  try {
    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
