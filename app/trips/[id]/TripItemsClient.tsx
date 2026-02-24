"use client";

import { useMemo, useState } from "react";

type TripItem = {
  id: string;
  trip_id: string;
  name: string;
  category: string | null;
  qty: number;
  checked: boolean;
  created_at: string;
};

export default function TripItemsClient({
  initialItems,
}: {
  initialItems: TripItem[];
}) {
  const [showUnpackedOnly, setShowUnpackedOnly] = useState(false);

  const visibleItems = useMemo(() => {
    if (!showUnpackedOnly) return initialItems;
    return initialItems.filter((item) => !item.checked);
  }, [initialItems, showUnpackedOnly]);

  const grouped = useMemo(() => {
    const map = new Map<string, TripItem[]>();

    for (const item of visibleItems) {
      const key = (item.category ?? "Uncategorized").trim() || "Uncategorized";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }

    // Optional: sort categories alphabetically
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [visibleItems]);

  return (
    <section style={{ marginTop: 24 }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={showUnpackedOnly}
          onChange={(e) => setShowUnpackedOnly(e.target.checked)}
        />
        Show unpacked only
      </label>

      {visibleItems.length === 0 ? (
        <p style={{ marginTop: 16 }}>
          {showUnpackedOnly
            ? "Everything is packed 🎉"
            : "No items yet. Add some items to this trip."}
        </p>
      ) : (
        <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
          {grouped.map(([category, items]) => (
            <div key={category}>
              <h2 style={{ marginBottom: 8 }}>{category}</h2>
              <ul style={{ display: "grid", gap: 6, paddingLeft: 18 }}>
                {items.map((item) => (
                  <li key={item.id}>
                    {item.qty > 1 ? `${item.qty}× ` : ""}
                    {item.name}
                    {item.checked ? " ✅" : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
