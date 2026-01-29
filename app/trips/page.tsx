import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function TripsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>Please log in.</p>;

  const { data: trips, error } = await supabase
    .from("trips")
    .select("id, name, start_date, created_at")
    .order("created_at", { ascending: false });

  if (error) return <pre>{error.message}</pre>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Trips</h1>
      <p>
        <Link href="/trips/new">Create new trip</Link>
      </p>

      {!trips?.length ? (
        <p>No trips yet.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              {trip.name}
              {trip.start_date ? ` — ${trip.start_date}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
