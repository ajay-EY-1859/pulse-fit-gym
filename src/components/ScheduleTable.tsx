import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

type ClassSession = {
  _id?: string;
  day: string;
  time: string;
  type: string;
  coach: string;
};

const fallbackClasses: ClassSession[] = [
  { day: 'Monday', time: '06:30', type: 'Strength', coach: 'Aisha Rao' },
  { day: 'Tuesday', time: '18:00', type: 'Boxing', coach: 'Marcus Lee' },
  { day: 'Wednesday', time: '07:15', type: 'Mobility', coach: 'Nina Patel' },
  { day: 'Thursday', time: '19:00', type: 'HIIT', coach: 'Marcus Lee' },
  { day: 'Saturday', time: '09:30', type: 'Hypertrophy', coach: 'Dev Mehta' },
];

export default function ScheduleTable() {
  const [filter, setFilter] = useState('All');
  const [classes, setClasses] = useState<ClassSession[]>(fallbackClasses);
  const options = ['All', ...Array.from(new Set(classes.map((item) => item.type)))];
  const visibleClasses = useMemo(
    () => classes.filter((item) => filter === 'All' || item.type === filter),
    [filter, classes],
  );

  useEffect(() => {
    api
      .get<ClassSession[]>('/classes')
      .then((response) => setClasses(response.data.length ? response.data : fallbackClasses))
      .catch(() => setClasses(fallbackClasses));
  }, []);

  return (
    <section className="section" id="schedule">
      <div className="section-heading inline-heading">
        <div>
          <p className="eyebrow">Schedule</p>
          <h2>Filter classes by training style.</h2>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter classes">
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Class</th>
              <th>Coach</th>
            </tr>
          </thead>
          <tbody>
            {visibleClasses.map((item) => (
              <tr key={item._id ?? `${item.day}-${item.type}`}>
                <td>{item.day}</td>
                <td>{item.time}</td>
                <td>{item.type}</td>
                <td>{item.coach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
