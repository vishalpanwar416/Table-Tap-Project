// OrderService.js
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

export async function createOrder(userId, items, total) {
  const orderId = uuidv4();
  const orderRef = await addDoc(collection(db, "orders"), {
    orderId,
    userId,
    items,
    total,
    status: "pending",
    createdAt: serverTimestamp()
  });
  return orderId;
}

export async function getOrder(orderId) {
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);
  return orderSnap.exists() ? orderSnap.data() : null;
}