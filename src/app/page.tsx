import { ChatWrapper } from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

export default async function Home() {
  const sessionCookie = cookies().get("sessionId")?.value;
  const sessionId = sessionCookie || "default-session";

  const isAlreadyIndexed = await redis.sismember("indexed-urls", "home");

  const initialMessages = await ragChat.history.getMessages({
    amount: 10,
    sessionId,
  });

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "text",
      data: "This is the home page of the website.",
      options: { metadata: { page: "home" } },
    });

    redis.sadd("indexed-urls", "home");
  }

  return (
    <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
  );
}
