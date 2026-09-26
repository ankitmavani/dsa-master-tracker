import { db } from "../config/firebase";
import { Roadmap } from "../models/roadmap.model";
import { Day } from "../models/day.model";

export class RoadmapService {
  static async create(data: Omit<Roadmap, "createdAt">) {
    const roadmapRef = db.collection("roadmaps").doc(data.id);

    await roadmapRef.set({
      ...data,
      createdAt: new Date(),
    });

    const batch = db.batch();

    for (let i = 1; i <= data.totalDays; i++) {
      const dayId = `${data.id}-day-${i}`;

      const dayRef = db.collection("days").doc(dayId);

      const day: Day = {
        id: dayId,
        roadmapId: data.id,
        day: i,
        title: `Day ${i}`,
        createdAt: new Date(),
      };

      batch.set(dayRef, day);
    }

    await batch.commit();

    return data;
  }

  static async findAll() {
    const snapshot = await db.collection("roadmaps").orderBy("createdAt").get();

    return snapshot.docs.map((doc) => doc.data());
  }

  static async findById(id: string) {
    const roadmap = await db.collection("roadmaps").doc(id).get();

    if (!roadmap.exists) return null;

    const days = await db
      .collection("days")
      .where("roadmapId", "==", id)
      .orderBy("day")
      .get();

    return {
      roadmap: roadmap.data(),
      days: days.docs.map((doc) => doc.data()),
    };
  }

  static async update(id: string, data: Partial<Roadmap>) {
    await db.collection("roadmaps").doc(id).update(data);

    return true;
  }

  static async delete(id: string) {
    const batch = db.batch();

    batch.delete(db.collection("roadmaps").doc(id));

    const days = await db.collection("days").where("roadmapId", "==", id).get();

    days.docs.forEach((day) => batch.delete(day.ref));

    await batch.commit();

    return true;
  }
}
