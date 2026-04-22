import { useEffect, useState } from 'react';
import api from '../services/api';

type MembershipPlan = {
  _id?: string;
  type: string;
  price: number;
  features: string[];
};

const fallbackPlans: MembershipPlan[] = [
  { type: 'Starter', price: 49, features: ['Gym floor access', '2 classes monthly', 'Locker access'] },
  { type: 'Premium', price: 89, features: ['Unlimited classes', 'Trainer check-ins', 'Recovery lounge'] },
  { type: 'Elite', price: 139, features: ['Personal programming', 'Nutrition review', 'Priority booking'] },
];

export default function MembershipPlans() {
  const [plans, setPlans] = useState<MembershipPlan[]>(fallbackPlans);

  useEffect(() => {
    api
      .get<MembershipPlan[]>('/membership')
      .then((response) => {
        if (response.data.length > 0) {
          setPlans(response.data);
        }
      })
      .catch(() => {
        setPlans(fallbackPlans);
      });
  }, []);

  return (
    <section className="section" id="membership">
      <div className="section-heading">
        <p className="eyebrow">Membership</p>
        <h2>Choose the training access that fits your week.</h2>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className={`price-card ${plan.type.toLowerCase() === 'premium' ? 'featured' : ''}`} key={plan.type}>
            <p>{plan.type}</p>
            <h3>
              ${plan.price}
              <span>/mo</span>
            </h3>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
