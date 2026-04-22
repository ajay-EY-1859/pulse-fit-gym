import { useEffect, useState } from 'react';
import api from '../services/api';

type Trainer = {
  _id?: string;
  name: string;
  focus: string;
  stats: string;
};

const fallbackTrainers: Trainer[] = [
  { name: 'Aisha Rao', focus: 'Strength coach', stats: '8 yrs coaching' },
  { name: 'Marcus Lee', focus: 'Boxing and HIIT', stats: '12 fight camps' },
  { name: 'Nina Patel', focus: 'Mobility and recovery', stats: '400+ clients' },
  { name: 'Dev Mehta', focus: 'Hypertrophy specialist', stats: 'NASM certified' },
];

export default function TrainerGrid() {
  const [trainers, setTrainers] = useState<Trainer[]>(fallbackTrainers);

  useEffect(() => {
    api
      .get<Trainer[]>('/trainers')
      .then((response) => setTrainers(response.data.length ? response.data : fallbackTrainers))
      .catch(() => setTrainers(fallbackTrainers));
  }, []);

  return (
    <section className="section" id="trainers">
      <div className="section-heading">
        <p className="eyebrow">Coaching team</p>
        <h2>Trainers who program with intent.</h2>
      </div>
      <div className="trainer-grid">
        {trainers.map((trainer) => (
          <article className="trainer-card" key={trainer._id ?? trainer.name}>
            <div className="avatar">{trainer.name.charAt(0)}</div>
            <h3>{trainer.name}</h3>
            <p>{trainer.focus}</p>
            <span>{trainer.stats}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
