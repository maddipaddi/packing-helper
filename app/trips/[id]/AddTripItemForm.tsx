"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const CATEGORIES = [
  "Clothing",
  "Sleep",
  "Cook",
  "Water",
  "Food",
  "Safety",
  "Navigation",
  "Hygiene",
  "Other",
];

export default function AddTripItemForm({ tripId }: { tripId: string }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const onAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsSaving(true);
    setError(null);

    // We omit user_id because your column default is auth.uid()
    // We omit checked/qty because defaults handle it
    const { error: insertError } = await supabase.from("trip_items").insert({
      trip_id: tripId,
      name: trimmed,
      category: category || null,
    });

    setIsSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setName("");
    setCategory("");
    router.refresh(); // re-fetch server data for the page
  };

  return (
    <section style={{ marginTop: 16, marginBottom: 16 }}>
      <h2>Add item</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input
          placeholder="Item name (e.g. Rain jacket)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">No category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button onClick={onAdd} disabled={isSaving || !name.trim()}>
          {isSaving ? "Adding…" : "Add"}
        </button>

        {error && <p style={{ whiteSpace: "pre-wrap" }}>{error}</p>}
      </div>
    </section>
  );
}
