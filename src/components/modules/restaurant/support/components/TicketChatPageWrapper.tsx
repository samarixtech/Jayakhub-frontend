"use client";

import { useRouter } from "next/navigation";
import TicketChatView from "./TicketChatView";

export default function TicketChatPageWrapper({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  
  return (
    <TicketChatView
      ticketId={ticketId}
      onBack={() => router.push("/restaurant/support")}
    />
  );
}
