import { doc, setDoc, getDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SpotStats = {
  scanCount: number;
  visitCount: number;
};

export async function incrementScanCount(spotId: string): Promise<void> {
  await setDoc(
    doc(db, "spotStats", spotId),
    { scanCount: increment(1) },
    { merge: true }
  );
}

export async function incrementVisitCount(spotId: string): Promise<void> {
  await setDoc(
    doc(db, "spotStats", spotId),
    { visitCount: increment(1) },
    { merge: true }
  );
}

export async function getSpotStats(spotId: string): Promise<SpotStats> {
  const snap = await getDoc(doc(db, "spotStats", spotId));
  if (!snap.exists()) return { scanCount: 0, visitCount: 0 };
  const data = snap.data();
  return {
    scanCount: data.scanCount ?? 0,
    visitCount: data.visitCount ?? 0,
  };
}

export async function getAllSpotStats(): Promise<Record<string, SpotStats>> {
  const { getDocs, collection } = await import("firebase/firestore");
  const snap = await getDocs(collection(db, "spotStats"));
  const result: Record<string, SpotStats> = {};
  snap.docs.forEach((d) => {
    result[d.id] = {
      scanCount: d.data().scanCount ?? 0,
      visitCount: d.data().visitCount ?? 0,
    };
  });
  return result;
}
