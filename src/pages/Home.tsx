import Hero from '../components/Hero';
import MembershipPlans from '../components/MembershipPlans';
import ScheduleTable from '../components/ScheduleTable';
import TrainerGrid from '../components/TrainerGrid';

export default function Home() {
  return (
    <main>
      <Hero />
      <TrainerGrid />
      <MembershipPlans />
      <ScheduleTable />
    </main>
  );
}
