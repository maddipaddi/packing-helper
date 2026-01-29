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

  const onCreate = async () => {
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) return setError(userError.message);
    if (!user) return setError("Not logged in.");

    const { error: insertError } = await supabase.from("trips").insert({
      user_id: user.id,
      name: name.trim(),
      start_date: startDate || null,
    });

    if (insertError) return setError(insertError.message);

    router.push("/trips");
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
