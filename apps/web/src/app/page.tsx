import { PlannerForm } from "@/components/planner-form";
import styles from "./page.module.css";

const highlights = [
  {
    title: "Real NYC venues",
    body: "Seeded inventory with booking metadata so every itinerary has credible stops."
  },
  {
    title: "Automation-ready",
    body: "APIs, deeplinks, and manual playbooks live alongside each event."
  },
  {
    title: "Day-of ops",
    body: ".ics, PDF, group text, reminders, and backup routes in one surface."
  }
];

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.hero}>
        <p className={styles.badge}>Live build · NYC focus</p>
        <h1>Party planning without 47 tabs.</h1>
        <p className={styles.subtitle}>
          PartyPilot turns a natural-language brief into a multi-stop itinerary, reserves venues, and delivers shareable
          assets for the crew. One prompt → done.
        </p>
        <div className={styles.tags}>
          <span>AI Trip Planner</span>
          <span>Venue Matching</span>
          <span>Reservations & Exports</span>
        </div>
      </header>

      <PlannerForm />

      <section className={styles.grid}>
        {highlights.map((item) => (
          <article key={item.title} className={styles.card}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
