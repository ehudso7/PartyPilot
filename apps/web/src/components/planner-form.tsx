"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiTrip, fetchHealth, planTrip } from "@/lib/api";
import styles from "./planner-form.module.css";

type HealthState = "checking" | "online" | "offline";
type SubmitState = "idle" | "loading" | "success" | "error";

const defaultPrompt =
  "NYC bachelor party on Jan 17, 2026 for 15 people. Mid-budget, start relaxed brunch/drinks, Italian dinner, games bar, rooftop finale. Avoid strip clubs.";

export const PlannerForm = () => {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [name, setName] = useState("Alex Organizer");
  const [email, setEmail] = useState("alex@example.com");
  const [phone, setPhone] = useState("");
  const [health, setHealth] = useState<HealthState>("checking");
  const [status, setStatus] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<ApiTrip | null>(null);

  useEffect(() => {
    const loadHealth = async () => {
      try {
        await fetchHealth();
        setHealth("online");
      } catch {
        setHealth("offline");
      }
    };

    void loadHealth();
  }, []);

  const statusLabel = useMemo(() => {
    if (status === "loading") {
      return "Planning itinerary...";
    }
    if (status === "success") {
      return "Itinerary generated. Scroll to review each stop.";
    }
    if (status === "error") {
      return "We hit a snag. Try again in a moment.";
    }
    return "PartyPilot drafts a multi-stop plan, selects venues, and saves it to the API.";
  }, [status]);

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setStatus("loading");
      setError(null);

      try {
        const plannedTrip = await planTrip({
          prompt,
          user: {
            email,
            name,
            phone: phone || undefined,
          },
        });
        setTrip(plannedTrip);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        const message = err instanceof Error ? err.message : "Unable to create a plan.";
        setError(message);
      }
    },
    [prompt, email, name, phone],
  );

  const healthDotClass =
    health === "online"
      ? styles.statusOnline
      : health === "offline"
        ? styles.statusOffline
        : styles.statusChecking;

  return (
    <section className={styles.panel} aria-label="PartyPilot planner">
      <div className={styles.panelHeader}>
        <p className={styles.ctaCopy}>Drop your party prompt. We handle venues, ordering, and exports.</p>
        <div className={styles.status}>
          <span className={`${styles.statusDot} ${healthDotClass}`} aria-hidden />
          API {health === "online" ? "ready" : health === "offline" ? "offline" : "checking..."}
        </div>
      </div>

      <form className={styles.form} onSubmit={submit}>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="prompt">Party brief</label>
            <span className={styles.hint}>Timing, group size, vibe, exclusions</span>
          </div>
          <textarea
            id="prompt"
            className={styles.textarea}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="name">Organizer name</label>
            <span className={styles.hint}>Shown on reservations + PDF</span>
          </div>
          <input
            id="name"
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="email">Email</label>
            <span className={styles.hint}>Used to associate the trip owner</span>
          </div>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="phone">Phone (optional)</label>
            <span className={styles.hint}>For SMS nudges later</span>
          </div>
          <input
            id="phone"
            className={styles.input}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+1 917 555 0199"
          />
        </div>

        <div className={styles.submitRow}>
          <button type="submit" className={styles.button} disabled={status === "loading"}>
            {status === "loading" ? "Scouting venues..." : "Generate itinerary"}
          </button>
          <p className={styles.statusText}>{statusLabel}</p>
        </div>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      {trip ? (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <h3 className={styles.resultTitle}>{trip.title}</h3>
            <span className={styles.tripMeta}>
              {trip.city} · {trip.groupSizeMin}-{trip.groupSizeMax} guests · {trip.occasion}
            </span>
          </div>
          <ul className={styles.eventList}>
            {trip.events.map((event) => (
              <li key={event.id} className={styles.eventCard}>
                <div className={styles.eventTitle}>
                  {event.orderIndex}. {event.title}
                </div>
                <div className={styles.eventTime}>
                  {new Date(event.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} →{" "}
                  {new Date(event.endTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </div>
                {event.venue ? (
                  <p className={styles.eventVenue}>
                    {event.venue.name} · {event.venue.address}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
};
