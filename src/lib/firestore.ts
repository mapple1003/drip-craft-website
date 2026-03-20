import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ProductDoc, SiteContentHero, SiteContentStory, SiteContentContact, ContactDoc } from "@/types/admin";

// --- Products ---

export async function getProducts(): Promise<ProductDoc[]> {
  const q = query(collection(db, "products"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductDoc, "id" | "createdAt" | "updatedAt">),
    createdAt: (d.data().createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (d.data().updatedAt as Timestamp)?.toDate() ?? new Date(),
  }));
}

export async function createProduct(
  data: Omit<ProductDoc, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "products"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<ProductDoc, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  await updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

// --- Site Content ---

export async function getSiteContent<T>(section: "hero" | "story" | "contact"): Promise<T | null> {
  const snap = await getDoc(doc(db, "siteContent", section));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  } as T;
}

export async function setSiteContent(
  section: "hero" | "story" | "contact",
  data: Record<string, unknown>
): Promise<void> {
  await setDoc(
    doc(db, "siteContent", section),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

// --- Contacts ---

export async function getContacts(): Promise<ContactDoc[]> {
  const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    name: d.data().name as string,
    email: d.data().email as string,
    message: d.data().message as string,
    createdAt: (d.data().createdAt as Timestamp)?.toDate() ?? new Date(),
  }));
}
