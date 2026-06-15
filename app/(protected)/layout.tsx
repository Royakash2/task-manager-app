import { NotificationsProvider } from "@/components/notifications/notifications-provider";

export const dynamic = 'force-dynamic';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationsProvider>
      {children}
    </NotificationsProvider>
  );
}
