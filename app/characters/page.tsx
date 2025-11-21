"use client";

import { useRouter } from "next/navigation";

export default function CharactersPage() {
  const router = useRouter();

  const characters = [
    { name: "Santa", path: "/characters/santa" },
    { name: "Alien", path: "/characters/alien" },
    { name: "Navy Seal", path: "/characters/navyseal" },
    { name: "Monk", path: "/characters/monk" },
    { name: "Tribal Man", path: "/characters/tribal-man" }
  ];

  return (
    <main>
      <h1>Step 1 of 2</h1>
      <h2>Choose your character</h2>

      {characters.map((c) => (
        <div key={c.path}>
          <button onClick={() => router.push(c.path)}>{c.name}</button>
        </div>
      ))}
    </main>
  );
}
