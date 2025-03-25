"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleStart = () => {
    if (!team1.trim() || !team2.trim()) {
      setError("Lütfen her iki takım ismini de giriniz.");
      return;
    }
    if (team1.trim() === team2.trim()) {
      setError("Takım isimleri aynı olamaz.");
      return;
    }
    setError("");
    router.push(
      `/maps?team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(
        team2
      )}`
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-8">CSGO Map Picker</h1>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="team1"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              1. Takım
            </label>
            <input
              id="team1"
              type="text"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="team-input"
              placeholder="1. Takım ismini giriniz"
            />
          </div>

          <div>
            <label
              htmlFor="team2"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              2. Takım
            </label>
            <input
              id="team2"
              type="text"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="team-input"
              placeholder="2. Takım ismini giriniz"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="btn btn-primary w-full mt-4"
          >
            Başla
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}
