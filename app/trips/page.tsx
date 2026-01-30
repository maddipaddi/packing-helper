import Link from "next/link";
import { Suspense } from "react";
import TripsData from "./TripsData";

export default function TripsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Trips</h1>
      <p>
        <Link href="/trips/new">Create new trip</Link>
      </p>

      <Suspense fallback={<p>Loading trips…</p>}>
        <TripsData />
      </Suspense>
    </div>
  );
}
