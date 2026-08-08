'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function Notifications() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', data.user.id)
        .eq('lu', false)
        .order('created_at', { ascending: false });
      setNotifications(notifs ?? []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function marquerLue(id: string) {
    await supabase.from('notifications').update({ lu: true }).eq('id', id);
    setNotifications((n) => n.filter((notif) => notif.id !== id));
  }

  if (notifications.length === 0) return null;

  return (
    <div className="mb-6 flex flex-col gap-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-lagon/30 bg-lagon/5 px-4 py-3 text-sm text-lagon"
        >
          {notif.lien ? (
            <Link href={notif.lien} className="hover:underline">{notif.message}</Link>
          ) : (
            <span>{notif.message}</span>
          )}
          <button onClick={() => marquerLue(notif.id)} className="shrink-0 text-lagon/60 hover:text-lagon">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
