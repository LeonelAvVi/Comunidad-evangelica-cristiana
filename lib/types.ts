export const SECTOR_IDS = [
  "ninos",
  "adolescentes",
  "jovenes",
  "matrimonios",
] as const;

export type SectorId = (typeof SECTOR_IDS)[number];

export type ChurchEvent = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  location: string;
  sector: SectorId;
  imageUrl: string | null;
};

export type EventInput = Omit<ChurchEvent, "id">;
