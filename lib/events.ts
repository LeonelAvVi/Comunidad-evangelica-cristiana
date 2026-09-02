import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { DEMO_EVENTS } from "./demo-events";
import { getFirebaseDb, getFirebaseStorage, isFirebaseConfigured } from "./firebase";
import { isUpcoming } from "./format";
import { isSectorId } from "./sectors";
import type { ChurchEvent, EventInput, SectorId } from "./types";

const COLLECTION = "events";

function mapDoc(
  id: string,
  data: Record<string, unknown>,
): ChurchEvent | null {
  const title = typeof data.title === "string" ? data.title : "";
  const description = typeof data.description === "string" ? data.description : "";
  const location = typeof data.location === "string" ? data.location : "";
  const sector = typeof data.sector === "string" && isSectorId(data.sector) ? data.sector : null;
  const imageUrl = typeof data.imageUrl === "string" ? data.imageUrl : null;

  let startsAt = "";
  if (data.startsAt instanceof Timestamp) {
    startsAt = data.startsAt.toDate().toISOString();
  } else if (typeof data.startsAt === "string") {
    startsAt = data.startsAt;
  }

  if (!title || !sector || !startsAt) return null;

  return { id, title, description, location, sector, startsAt, imageUrl };
}

function sortByDate(events: ChurchEvent[]): ChurchEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export function subscribeEvents(
  onChange: (events: ChurchEvent[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  if (!isFirebaseConfigured()) {
    onChange(sortByDate(DEMO_EVENTS));
    return () => undefined;
  }

  const q = query(collection(getFirebaseDb(), COLLECTION), orderBy("startsAt", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      const events = snap.docs
        .map((item) => mapDoc(item.id, item.data() as Record<string, unknown>))
        .filter((event): event is ChurchEvent => event !== null);
      onChange(events);
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function getEventById(id: string): Promise<ChurchEvent | null> {
  if (!isFirebaseConfigured()) {
    return DEMO_EVENTS.find((event) => event.id === id) ?? null;
  }
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  return mapDoc(snap.id, snap.data() as Record<string, unknown>);
}

export function upcomingEvents(
  events: ChurchEvent[],
  sector?: SectorId,
): ChurchEvent[] {
  return events.filter((event) => {
    if (!isUpcoming(event.startsAt)) return false;
    if (sector && event.sector !== sector) return false;
    return true;
  });
}

export async function createEvent(input: EventInput): Promise<string> {
  const payload = {
    title: input.title.trim(),
    description: input.description.trim(),
    location: input.location.trim(),
    sector: input.sector,
    imageUrl: input.imageUrl,
    startsAt: Timestamp.fromDate(new Date(input.startsAt)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const refDoc = await addDoc(collection(getFirebaseDb(), COLLECTION), payload);
  return refDoc.id;
}

export async function updateEvent(id: string, input: EventInput): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTION, id), {
    title: input.title.trim(),
    description: input.description.trim(),
    location: input.location.trim(),
    sector: input.sector,
    imageUrl: input.imageUrl,
    startsAt: Timestamp.fromDate(new Date(input.startsAt)),
    updatedAt: serverTimestamp(),
  });
}

export async function removeEvent(id: string, imageUrl?: string | null): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), COLLECTION, id));
  if (imageUrl) {
    try {
      await deleteObject(ref(getFirebaseStorage(), imageUrl));
    } catch {
      // The stored value is a download URL, not a storage path. Best-effort path delete below.
    }
  }
}

export async function uploadEventImage(file: File, eventKey: string): Promise<string> {
  const safeName = file.name.replace(/[^\w.\-]+/g, "-").toLowerCase();
  const path = `events/${eventKey}/${Date.now()}-${safeName}`;
  const storageRef = ref(getFirebaseStorage(), path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
