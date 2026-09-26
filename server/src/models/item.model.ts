export type ItemType = "learning" | "problem";

export interface Item {
  id: string;

  roadmapId: string;
  dayId: string;
  day: number;

  type: ItemType;

  title: string;
  description: string;

  videoUrl?: string;
  articleUrl?: string;
  problemUrl?: string;

  platform?: string;
  difficulty?: "Easy" | "Medium" | "Hard";

  notes: string;

  flags: {
    completed: boolean;
    revision: boolean;
    important: boolean;
    favorite: boolean;
  };

  createdAt: Date;
}
