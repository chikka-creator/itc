import { getDictionary } from '@/lib/i18n';
import { Hero } from '@/components/sections/Hero';
import { Platform } from '@/components/sections/Platform';
import { Features } from '@/components/sections/Features';
import { Testimonials } from '@/components/sections/Testimonials';
import { JoinCTA } from '@/components/sections/JoinCTA';
import { Integrations } from '@/components/sections/Integrations';
import { Footer } from '@/components/sections/Footer';
import {
  getUpcomingMeetings,
  getPublicLeaderboard,
  getPublicStats,
  getPublicShowcase,
} from '@/lib/data';

export default async function LandingPage() {
  const dict = await getDictionary();

  // Fetch dynamic data from database for live integration across all sections
  const [meetings, leaderboard, stats, showcase] = await Promise.all([
    getUpcomingMeetings(3),
    getPublicLeaderboard(5),
    getPublicStats(),
    getPublicShowcase(),
  ]);

  return (
    <div className="w-full flex flex-col">
      <Hero
        dict={dict}
        stats={stats}
        upcomingMeeting={meetings[0]}
        topLeader={leaderboard[0]}
      />
      <Platform
        dict={dict}
        stats={stats}
        leaderboard={leaderboard}
      />
      <Features
        dict={dict}
        stats={stats}
        meetings={meetings}
        leaderboard={leaderboard}
      />
      <Testimonials dict={dict} showcase={showcase} />
      <JoinCTA dict={dict} stats={stats} showcase={showcase} />
      <Integrations dict={dict} />
      <Footer dict={dict} />
    </div>
  );
}