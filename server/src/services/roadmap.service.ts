import { db } from "../config/firebase";
import { Day } from "../models/day.model";
import { Roadmap } from "../models/roadmap.model";

interface BulkPayload {
  roadmap: any;
  rows: any[];
}

export class RoadmapService {
  static async create(data: Omit<Roadmap, "createdAt">) {
    const roadmapRef = db.collection("roadmaps").doc(data.id);

    await roadmapRef.set({
      ...data,

      // New fields
      youtubePlaylists: [],
      books: [],
      notes: [],

      createdAt: new Date(),
    });

    const batch = db.batch();

    for (let i = 1; i <= data.totalDays; i++) {
      const dayId = `${data.id}-day-${i}`;

      batch.set(db.collection("days").doc(dayId), {
        id: dayId,
        roadmapId: data.id,
        day: i,
        title: `Day ${i}`,
        createdAt: new Date(),
      });
    }

    await batch.commit();

    return data;
  }

  static async bulkCreate({ roadmap, rows }: BulkPayload) {
    const roadmapId = roadmap.id;

    await db
      .collection("roadmaps")
      .doc(roadmapId)
      .set({
        ...roadmap,
        totalDays: Number(roadmap.totalDays),

        // New fields
        youtubePlaylists: [],
        books: [],
        notes: [],

        createdAt: new Date(),
      });

    const grouped: Record<number, any[]> = {};

    rows.forEach((row) => {
      const day = Number(row.Day);

      if (!grouped[day]) grouped[day] = [];

      grouped[day].push(row);
    });

    const batch = db.batch();

    Object.keys(grouped).forEach((key) => {
      const day = Number(key);

      const dayId = `${roadmapId}-day-${day}`;

      const first = grouped[day][0];

      batch.set(db.collection("days").doc(dayId), {
        id: dayId,
        roadmapId,
        day,
        title: first["Day Title"],
        createdAt: new Date(),
      });

      grouped[day].forEach((row, index) => {
        if (roadmap.type === "problem") {
          const questionId = `${dayId}-q-${index + 1}`;

          batch.set(db.collection("questions").doc(questionId), {
            id: questionId,
            roadmapId,
            dayId,
            day,
            title: row["Question Title"],
            description: row["Description"] || "",
            leetcodeUrl: row["LeetCode URL"] || "",
            gfgUrl: row["GFG URL"] || "",
            difficulty: row["Difficulty"] || "Easy",
            tags: String(row["Tags"] || "")
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean),
            notes: row["Notes"] || "",
            status: "pending",
            createdAt: new Date(),
          });
        } else {
          const topicId = `${dayId}-t-${index + 1}`;

          batch.set(db.collection("items").doc(topicId), {
            id: topicId,
            roadmapId,
            dayId,
            day,
            type: "learning",
            title: row["Topic Title"],
            description: row["Description"] || "",
            videoUrl: row["Video URL"] || "",
            articleUrl: row["Article URL"] || "",
            notes: row["Notes"] || "",
            flags: {
              completed: false,
              revision: false,
              important: String(row["Important"]).toLowerCase() === "true",
              favorite: false,
            },
            createdAt: new Date(),
          });
        }
      });
    });

    await batch.commit();

    return {
      roadmapId,
      days: Object.keys(grouped).length,
      records: rows.length,
    };
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

  // ---------- YouTube ----------

  static async addPlaylist(roadmapId: string, payload: any) {
    const ref = db.collection("roadmaps").doc(roadmapId);

    const doc = await ref.get();

    const data = doc.data();

    await ref.update({
      youtubePlaylists: [...(data?.youtubePlaylists || []), payload],
    });

    return payload;
  }

  static async deletePlaylist(roadmapId: string, playlistId: string) {
    const ref = db.collection("roadmaps").doc(roadmapId);

    const doc = await ref.get();

    const data = doc.data();

    await ref.update({
      youtubePlaylists: (data?.youtubePlaylists || []).filter(
        (x: any) => x.id !== playlistId,
      ),
    });
  }

  // ---------- Books ----------

  static async addBook(roadmapId: string, payload: any) {
    const ref = db.collection("roadmaps").doc(roadmapId);

    const doc = await ref.get();

    const data = doc.data();

    await ref.update({
      books: [...(data?.books || []), payload],
    });

    return payload;
  }

  static async deleteBook(roadmapId: string, bookId: string) {
    const ref = db.collection("roadmaps").doc(roadmapId);

    const doc = await ref.get();

    const data = doc.data();

    await ref.update({
      books: (data?.books || []).filter((x: any) => x.id !== bookId),
    });
  }

  // ---------- Notes ----------

  static async addNote(roadmapId: string, payload: any) {
    const ref = db.collection("roadmaps").doc(roadmapId);

    const doc = await ref.get();

    const data = doc.data();

    await ref.update({
      notes: [...(data?.notes || []), payload],
    });

    return payload;
  }

  static async deleteNote(roadmapId: string, noteId: string) {
    const ref = db.collection("roadmaps").doc(roadmapId);

    const doc = await ref.get();

    const data = doc.data();

    await ref.update({
      notes: (data?.notes || []).filter((x: any) => x.id !== noteId),
    });
  }
}
