import { Event } from '@/data/event-data';

export function getEventStatus(event: Event): 'upcoming' | 'ongoing' | 'ended' | 'completed' | 'announced' {
  const now = new Date();
  const applicationStart = new Date(event.applicationPeriod?.split(' - ')[0] || '');
  const applicationEnd = new Date(event.applicationPeriod?.split(' - ')[1] || '');
  const winnersAnnouncement = new Date(event.winnersAnnouncement || '');
  const eventDate = new Date(event.date?.split(' ')[0] || '' );

  if (now < applicationStart) {
    return 'upcoming';
  } else if (now >= applicationStart && now <= applicationEnd) {
    return 'ongoing';
  } else if (now > applicationEnd && now < winnersAnnouncement) {
    return 'ended';
  } else if (now >= winnersAnnouncement && now < eventDate) {
    return 'announced';
  } else {
    return 'completed'; 
  }
}

export function getEventStatusDescription(status: ReturnType<typeof getEventStatus>): string {
  switch (status) {
    case 'upcoming':
      return '即將開始';
    case 'ongoing':
      return '報名中';
    case 'ended':
      return '等待公布';
    case 'announced':
      return '最新公佈';
    default:
      return '已結束';
  }
}