import TicketChatPageWrapper from "@/components/modules/restaurant/support/components/TicketChatPageWrapper";

export const metadata = {
  title: "Ticket Chat | Restaurant Dashboard",
};

export default async function TicketChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return <TicketChatPageWrapper ticketId={id} />;
}
