import { createClient } from "@/lib/supabase/server";
import TripItemsClient from "./TripItemsClient";
import AddTripItemForm from "./AddTripItemForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailsPage({ params }: PageProps) {
  const { id: tripId } = await params; // ✅ unwrap the Promise

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>Please log in.</p>;

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, name, start_date, created_at")
    .eq("id", tripId)
    .single();

  if (tripError) return <pre>{tripError.message}</pre>;
  if (!trip) return <p>Trip not found.</p>;

  const { data: items, error: itemsError } = await supabase
    .from("trip_items")
    .select("id, trip_id, name, category, qty, checked, created_at")
    .eq("trip_id", tripId)
    .order("category", { ascending: true })
    .order("created_at", { ascending: true });

  if (itemsError) return <pre>{itemsError.message}</pre>;

  return (
    <div style={{ padding: 24 }}>
      <h1>{trip.name}</h1>
      <AddTripItemForm tripId={tripId} />
      <TripItemsClient initialItems={items ?? []} />
    </div>
  );
}
