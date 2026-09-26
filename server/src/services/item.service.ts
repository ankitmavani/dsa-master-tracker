import { db } from "../config/firebase";
import { Item } from "../models/item.model";

export class ItemService {
  static async create(data: Omit<Item, "createdAt">) {
    await db
      .collection("items")
      .doc(data.id)
      .set({
        ...data,
        createdAt: new Date(),
      });

    return data;
  }

  static async findByDay(dayId: string) {
    const snapshot = await db
      .collection("items")
      .where("dayId", "==", dayId)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  static async update(id: string, data: Partial<Item>) {
    await db.collection("items").doc(id).update(data);

    return true;
  }

  static async delete(id: string) {
    await db.collection("items").doc(id).delete();

    return true;
  }

  static async updateFlags(id: string, flags: Item["flags"]) {
    await db.collection("items").doc(id).update({
      flags,
    });

    return true;
  }
}
