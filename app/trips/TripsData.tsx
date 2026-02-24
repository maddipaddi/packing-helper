import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function TripsData() {
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

  if (!trips?.length) return <p>No trips yet.</p>;

  return (
    <ul>
      {trips.map((trip) => (
        <li key={trip.id}>
          <Link href={`/trips/${trip.id}`}>
            {trip.name}
            {trip.start_date ? ` — ${trip.start_date}` : ""}
          </Link>
        </li>
      ))}
    </ul>
  );
}
