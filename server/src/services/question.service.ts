import { db } from "../config/firebase";
import { Question } from "../models/question.model";

export class QuestionService {
  static async getByDay(dayId: string) {
    const snapshot = await db
      .collection("questions")
      .where("dayId", "==", dayId)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  static async create(question: Question) {
    const data = {
      ...question,
      createdAt: new Date(),
    };

    await db.collection("questions").doc(question.id).set(data);

    return data;
  }

  static async update(id: string, payload: Partial<Question>) {
    await db.collection("questions").doc(id).update(payload);

    return true;
  }

  static async updateStatus(id: string, status: Question["status"]) {
    await db.collection("questions").doc(id).update({
      status,
    });

    return true;
  }

  static async delete(id: string) {
    await db.collection("questions").doc(id).delete();

    return true;
  }
}
