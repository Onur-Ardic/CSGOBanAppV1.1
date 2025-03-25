"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SideSelection() {
  const [selectedSides, setSelectedSides] = useState<
    Record<string, { side: string; team: string; map: string }>
  >({});
  const [currentMap, setCurrentMap] = useState(0);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [firstTeam, setFirstTeam] = useState("");
  const [secondTeam, setSecondTeam] = useState("");
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);
  const [selectedMapInfo, setSelectedMapInfo] = useState<
    { name: string; pickedBy: string }[]
  >([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const team1Param = searchParams.get("team1");
    const team2Param = searchParams.get("team2");
    const firstTeamParam = searchParams.get("firstTeam");
    const secondTeamParam = searchParams.get("secondTeam");
    const mapsParam = searchParams.get("maps");
    const pickedByParam = searchParams.get("pickedBy");

    if (team1Param && team2Param && firstTeamParam && secondTeamParam) {
      setTeam1(team1Param);
      setTeam2(team2Param);
      setFirstTeam(firstTeamParam);
      setSecondTeam(secondTeamParam);
    }

    if (mapsParam && pickedByParam) {
      const maps = mapsParam.split(",");
      const pickedBy = pickedByParam.split(",");
      setSelectedMaps(maps);
      setSelectedMapInfo(
        maps.map((name, index) => ({
          name,
          pickedBy: pickedBy[index],
        }))
      );
      setCurrentMap(1);
    }
  }, []);

  const handleSideSelect = (side: "T" | "CT") => {
    const currentMapInfo = selectedMapInfo[currentMap - 1];
    if (!currentMapInfo) return;

    const currentTeam =
      currentMap === 1
        ? selectedMapInfo[1]?.pickedBy
        : selectedMapInfo[0]?.pickedBy;

    setSelectedSides((prev) => ({
      ...prev,
      [currentMapInfo.name]: {
        side,
        team: currentTeam || "",
        map: currentMapInfo.name,
      },
    }));
    setCurrentMap((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Side Seçimi</h1>

        {currentMap <= selectedMaps.length && (
          <div className="text-center mb-8">
            <p className="text-xl font-semibold">
              {selectedMaps[currentMap - 1]} için Side Seçimi
            </p>
            <p className="text-lg mt-2">
              Sıradaki Takım:{" "}
              {currentMap === 1
                ? selectedMapInfo[1]?.pickedBy
                : selectedMapInfo[0]?.pickedBy}
            </p>
          </div>
        )}

        {currentMap === 1 && (
          <div className="text-yellow-600 text-center mb-4">
            Not: 3. haritanın side seçimi ilk iki maçın averajına göre
            belirlenecektir.
          </div>
        )}

        {currentMap <= selectedMaps.length && currentMap <= 2 && (
          <div className="flex justify-center gap-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="side-btn t-btn relative overflow-hidden cursor-pointer"
              onClick={() => handleSideSelect("T")}
              {...({
                className:
                  "side-btn t-btn relative overflow-hidden cursor-pointer",
              } as any)}
            >
              <Image
                src="/tside.webp"
                alt="T Side"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">T Side</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="side-btn ct-btn relative overflow-hidden cursor-pointer"
              onClick={() => handleSideSelect("CT")}
              {...({
                className:
                  "side-btn ct-btn relative overflow-hidden cursor-pointer",
              } as any)}
            >
              <Image
                src="/ctside.jpg"
                alt="CT Side"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">CT Side</span>
              </div>
            </motion.button>
          </div>
        )}

        {currentMap > 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
            {...({ className: "mt-12 text-center" } as any)}
          >
            <h2 className="text-2xl font-bold mb-4">Side Seçimi Tamamlandı</h2>
            <div className="space-y-4">
              {Object.entries(selectedSides).map(([map, info]) => (
                <div key={map} className="p-4 bg-white rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">{info.map}</h3>
                  <p>Takım: {info.team}</p>
                  <p>
                    Seçilen Side:{" "}
                    {info.side === "T" ? "Terrorist" : "Counter-Terrorist"}
                  </p>
                </div>
              ))}
              <div className="mt-8 text-yellow-600">
                <p>
                  Not: 3. haritanın side seçimi ilk iki maçın averajına göre
                  belirlenecektir.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
