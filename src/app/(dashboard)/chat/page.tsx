import { Metadata } from "next";
import { ChatLayout } from "@/src/components/ui/chat/ChatLayout";

export const metadata: Metadata = {
  title: "Live Chat & Messages | Amarzone",
  description: "Real-time communication and messaging on Amarzone.",
};

export default function GeneralChatPage() {
  return (
    <div className="w-full pb-6 text-slate-100">
      <ChatLayout />
    </div>
  );
}
