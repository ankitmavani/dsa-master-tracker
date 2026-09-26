import { db } from "../config/firebase";
import { Day } from "../models/day.model";

export class DayService {
  static async getByRoadmap(roadmapId: string) {
    const snapshot = await db
      .collection("days")
      .where("roadmapId", "==", roadmapId)
      .orderBy("day")
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  static async create(roadmapId: string, title: string) {
    const roadmap = await db.collection("roadmaps").doc(roadmapId).get();

    const totalDays = roadmap.data()?.totalDays || 0;
    const nextDay = totalDays + 1;

    const dayId = `${roadmapId}-day-${nextDay}`;

    const day: Day = {
      id: dayId,
      roadmapId,
      day: nextDay,
      title,
      createdAt: new Date(),
    };

    await db.collection("days").doc(dayId).set(day);

    await db.collection("roadmaps").doc(roadmapId).update({
      totalDays: nextDay,
    });

    return day;
  }

  static async update(id: string, title: string) {
    await db.collection("days").doc(id).update({ title });

    return true;
  }

  static async delete(id: string) {
    const dayDoc = await db.collection("days").doc(id).get();

    if (!dayDoc.exists) return false;

    const day = dayDoc.data() as Day;

    const batch = db.batch();

    batch.delete(dayDoc.ref);

    const items = await db.collection("items").where("dayId", "==", id).get();

    items.docs.forEach((doc) => batch.delete(doc.ref));

    const remaining = await db
      .collection("days")
      .where("roadmapId", "==", day.roadmapId)
      .orderBy("day")
      .get();

    remaining.docs.forEach((doc) => {
      const data = doc.data() as Day;

      if (data.day > day.day) {
        batch.update(doc.ref, {
          day: data.day - 1,
        });
      }
    });

    batch.update(db.collection("roadmaps").doc(day.roadmapId), {
      totalDays: remaining.size - 1,
    });

    await batch.commit();

    return true;
  }

  static async reorder(roadmapId: string, orderedIds: string[]) {
    const batch = db.batch();

    orderedIds.forEach((id, index) => {
      batch.update(db.collection("days").doc(id), {
        day: index + 1,
      });
    });

    await batch.commit();

    return true;
  }
}
