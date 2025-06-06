import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { TaskType } from "../../types/TypesDB";

// Obtener tareas por ID de usuario
export const getTasksByUserId = async (userId: string): Promise<TaskType[]> => {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const tasks: TaskType[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title || "Sin título",
        description: data.description || "",
        status: data.status || "todo",
      };
    });

    return tasks;
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return [];
  }
};

