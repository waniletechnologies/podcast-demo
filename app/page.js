import { PodcastConversation } from "./Conversation";
import { ConversationFromText } from "./ConversationFromText";

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      {/* <PodcastConversation /> */}
      <ConversationFromText />
    </main>
  );
}
