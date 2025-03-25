"use client";

import { useState, useEffect } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useRouter } from "next/navigation";

interface Map {
  id: string;
  name: string;
  status: "available" | "banned" | "picked";
  bannedBy?: string;
  pickedBy?: string;
  image: string;
}

const initialMaps: Map[] = [
  {
    id: "train",
    name: "Train",
    status: "available",
    image: "/maps/train.webp",
  },
  {
    id: "inferno",
    name: "Inferno",
    status: "available",
    image: "/maps/inferno.jpeg",
  },
  {
    id: "mirage",
    name: "Mirage",
    status: "available",
    image: "/maps/mirage.webp",
  },
  { id: "nuke", name: "Nuke", status: "available", image: "/maps/nuke.webp" },
  {
    id: "dust2",
    name: "Dust 2",
    status: "available",
    image: "/maps/dust2.webp",
  },
  {
    id: "ancient",
    name: "Ancient",
    status: "available",
    image: "/maps/ancient.webp",
  },
  {
    id: "anubis",
    name: "Anubis",
    status: "available",
    image: "/maps/anubis.webp",
  },
];

const steps = [
  { type: "ban", team: "first" },
  { type: "ban", team: "second" },
  { type: "pick", team: "first" },
  { type: "pick", team: "second" },
  { type: "ban", team: "first" },
  { type: "ban", team: "second" },
  { type: "pick", team: "first" },
];

export default function MapSelection() {
  const [maps, setMaps] = useState<Map[]>(initialMaps);
  const [currentStep, setCurrentStep] = useState(0);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [firstTeam, setFirstTeam] = useState<string>();
  const [secondTeam, setSecondTeam] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const team1Param = searchParams.get("team1");
    const team2Param = searchParams.get("team2");

    if (team1Param && team2Param) {
      setTeam1(team1Param);
      setTeam2(team2Param);

      const teams = [team1Param, team2Param];
      const randomIndex = Math.floor(Math.random() * 2);
      setFirstTeam(teams[randomIndex]);
      setSecondTeam(teams[1 - randomIndex]);
    }
  }, []);

  const handleMapClick = (mapId: string) => {
    if (currentStep >= steps.length) return;

    const currentAction = steps[currentStep];
    const actingTeam = currentAction.team === "first" ? firstTeam : secondTeam;

    setMaps(
      maps.map((map) => {
        if (map.id === mapId) {
          return {
            ...map,
            status: currentAction.type === "ban" ? "banned" : "picked",
            bannedBy: currentAction.type === "ban" ? actingTeam : undefined,
            pickedBy: currentAction.type === "pick" ? actingTeam : undefined,
          };
        }
        return map;
      })
    );

    setCurrentStep((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Harita Seçimi</h1>

        {currentStep < steps.length && (
          <div className="text-center mb-8">
            <p className="text-xl font-semibold">
              Sıradaki İşlem:{" "}
              {steps[currentStep].type === "ban" ? "Banlama" : "Seçim"}
            </p>
            <p className="text-lg mt-2">
              Sıradaki Takım:{" "}
              {steps[currentStep].team === "first" ? firstTeam : secondTeam}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maps.map((map) => (
            <motion.div
              key={map.id}
              className={`map-card ${map.status}`}
              whileHover={map.status === "available" ? { scale: 1.05 } : {}}
              onClick={() =>
                map.status === "available" && handleMapClick(map.id)
              }
            >
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={map.image}
                  alt={map.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <span className="text-2xl font-bold text-white drop-shadow-lg">
                    {map.name}
                  </span>
                </div>

                {map.status !== "available" && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
                    {map.status === "banned"
                      ? `Banned by ${map.bannedBy}`
                      : `Picked by ${map.pickedBy}`}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {currentStep >= steps.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              Harita Seçimi Tamamlandı
            </h2>
            <button
              className="btn btn-primary"
              onClick={() => {
                const pickedMaps = maps
                  .filter((map) => map.status === "picked")
                  .map((map) => map.name);
                const pickedBy = maps
                  .filter((map) => map.status === "picked")
                  .map((map) => map.pickedBy);

                const searchParams = new URLSearchParams();
                searchParams.set("team1", team1);
                searchParams.set("team2", team2);
                searchParams.set("firstTeam", firstTeam || "");
                searchParams.set("secondTeam", secondTeam || "");
                searchParams.set("maps", pickedMaps.join(","));
                searchParams.set("pickedBy", pickedBy.join(","));

                router.push(`/sides?${searchParams.toString()}`);
              }}
            >
              Side Seçimine Geç
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
