"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function NewTripPage() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const DAY_HIKE_STARTER_ITEMS = [
    { name: "Water bottle", category: "Water", qty: 1 },
    { name: "Snacks / lunch", category: "Food", qty: 1 },
    { name: "Rain jacket", category: "Clothing", qty: 1 },
    { name: "Extra warm layer", category: "Clothing", qty: 1 },
    { name: "Wool socks (spare)", category: "Clothing", qty: 1 },
    { name: "Hat / beanie", category: "Clothing", qty: 1 },
    { name: "Gloves", category: "Clothing", qty: 1 },
    { name: "Headlamp", category: "Safety", qty: 1 },
    { name: "First aid kit", category: "Safety", qty: 1 },
    { name: "Phone + offline map", category: "Navigation", qty: 1 },
    { name: "Power bank", category: "Safety", qty: 1 },
    { name: "Sunscreen", category: "Hygiene", qty: 1 },
    { name: "Toilet paper", category: "Hygiene", qty: 1 },
  ];

  const onCreate = async () => {
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) return setError(userError.message);
    if (!user) return setError("Not logged in.");

    const { data: tripRow, error: tripError } = await supabase
      .from("trips")
      .insert({
        // omit user_id if your trips.user_id default is auth.uid()
        name: name.trim(),
        start_date: startDate || null,
      })
      .select("id")
      .single();

    if (tripError) return setError(tripError.message);

    const tripId = tripRow.id;

    // Insert starter items (omit user_id; defaults to auth.uid())
    const { error: itemsError } = await supabase.from("trip_items").insert(
      DAY_HIKE_STARTER_ITEMS.map((item) => ({
        trip_id: tripId,
        name: item.name,
        category: item.category,
        qty: item.qty,
        // omit checked: default false
      })),
    );

    if (itemsError) return setError(itemsError.message);

    // navigate to the new trip
    router.push(`/trips/${tripId}`);
    router.refresh();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Create trip</h1>

      <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label>
          Trip name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Start date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <button disabled={!name.trim()} onClick={onCreate}>
          Create
        </button>

        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
