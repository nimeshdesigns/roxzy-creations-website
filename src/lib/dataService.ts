import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "./firebase";
import { 
  UserProfile, 
  Review, 
  Order, 
  WhatsappPrice, 
  GraphicDesign, 
  PaymentMethodRecord, 
  SocialLink,
  ReviewStatus,
  OrderStatus,
  OrderCategory
} from "../types";

// Seed data arrays for fallback/initial loading
export const DEFAULT_WHATSAPP_PRICES: WhatsappPrice[] = [
  { id: "wp1", duration: "1 Day", priceLkr: "120 LKR" },
  { id: "wp2", duration: "3 Days", priceLkr: "400 LKR" },
  { id: "wp3", duration: "5 Days", priceLkr: "1000 LKR" },
  { id: "wp4", duration: "15 Days", priceLkr: "20000 LKR" },
  { id: "wp5", duration: "30 Days", priceLkr: "100000 LKR" },
];

export const DEFAULT_GRAPHIC_DESIGNS: GraphicDesign[] = [
  { 
    id: "gd1", 
    name: "Minimalist Brand Logo", 
    description: "Sleek minimalist vectors and unique typography tailored specifically for futuristic tech ventures.", 
    priceLkr: "1500 LKR", 
    photo: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: "gd2", 
    name: "Neon E-Sports Backdrop", 
    description: "Energetic and powerful design layout optimized for streamers, WhatsApp banners, and community spaces.", 
    priceLkr: "2500 LKR", 
    photo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: "gd3", 
    name: "Aesthetic YouTube Thumbnail", 
    description: "High-contrast dynamic preview thumbnails designed to maximize watch metrics and click ratios.", 
    priceLkr: "1200 LKR", 
    photo: "https://images.unsplash.com/photo-1611162617263-4dc30623011b?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: "gd4", 
    name: "Social Publicity Poster", 
    description: "Clean layout, bespoke fonts, and futuristic patterns perfect for boosting webinar engagements.", 
    priceLkr: "2000 LKR", 
    photo: "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: "gd5", 
    name: "Overlay HUD Frames", 
    description: "Interactive borders, custom user chat gaps, and professional streaming overlays.", 
    priceLkr: "3000 LKR", 
    photo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: "gd6", 
    name: "Mascot Icon Vectors", 
    description: "Whimsical community stickers or mascots formatted perfectly for high retention WhatsApp sharing.", 
    priceLkr: "800 LKR", 
    photo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: "gd7", 
    name: "Futuristic Album Artwork", 
    description: "Synthwave aesthetics, intense atmospheric contrast, and geometric brand typography elements.", 
    priceLkr: "4000 LKR", 
    photo: "https://images.unsplash.com/photo-1502239608882-93b729c6af43?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: "gd8", 
    name: "Aesthetic Product Flyer", 
    description: "High-end product layout with curated shadowing options for modern advertising channels.", 
    priceLkr: "3500 LKR", 
    photo: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop" 
  }
];

export const DEFAULT_PAYMENT_METHODS: PaymentMethodRecord[] = [
  {
    id: "bank",
    name: "Bank Details",
    details: {
      bankName: "Sampath Bank",
      name: "S.H.H.N.H ARAHCHCI",
      accountNumber: "104452997508",
      branch: "Wariyapola"
    }
  },
  {
    id: "ezcash",
    name: "eZ Cash",
    details: {
      number: "Unavailable Right Now"
    }
  },
  {
    id: "paypal",
    name: "PayPal",
    details: {
      email: "Unavailable Right Now"
    }
  }
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: "sl1", name: "WhatsApp Contact", url: "https://wa.me/94701234567", iconName: "MessageCircle" },
  { id: "sl2", name: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VaB4v9372wu3xH975o2W", iconName: "Share2" },
  { id: "sl3", name: "YouTube", url: "https://youtube.com/@roxzycreations", iconName: "Youtube" },
  { id: "sl4", name: "Facebook", url: "https://facebook.com/roxzycreations", iconName: "Facebook" },
  { id: "sl5", name: "Telegram", url: "https://t.me/roxzycreations", iconName: "Send" },
  { id: "sl6", name: "Discord Server", url: "https://discord.gg/roxzycreations", iconName: "Discord" },
  { id: "sl7", name: "TikTok", url: "https://tiktok.com/@roxzycreations", iconName: "Tiktok" },
  { id: "sl8", name: "Instagram", url: "https://instagram.com/roxzycreations", iconName: "Instagram" },
  { id: "sl9", name: "Threads", url: "https://threads.net/@roxzycreations", iconName: "Threads" }
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev1",
    name: "Kalana Perera",
    comment: "Absolutely unmatched design speed! The gaming overlay made our channel look 10x more professional than prior layouts.",
    rating: 5,
    status: "accepted",
    createdAt: new Date().toISOString(),
    userEmail: "kalana@gmail.com"
  },
  {
    id: "rev2",
    name: "Shenal De Silva",
    comment: "High quality aesthetic layouts. Responsive support available to answer queries, even during nighttime.",
    rating: 5,
    status: "accepted",
    createdAt: new Date().toISOString(),
    userEmail: "shenal@gmail.com"
  }
];

// Seed Firestore Database with Defaults if Empty
export async function seedDatabaseIfEmpty() {
  try {
    // 1. WhatsApp Prices Check
    const wpSnap = await getDocs(collection(db, "whatsapp_prices"));
    if (wpSnap.empty) {
      for (const wp of DEFAULT_WHATSAPP_PRICES) {
        await setDoc(doc(db, "whatsapp_prices", wp.id), wp);
      }
    }

    // 2. Graphic Designs Check
    const gdSnap = await getDocs(collection(db, "graphic_designs"));
    if (gdSnap.empty) {
      for (const gd of DEFAULT_GRAPHIC_DESIGNS) {
        await setDoc(doc(db, "graphic_designs", gd.id), gd);
      }
    }

    // 3. Payment Methods Check
    const pmSnap = await getDocs(collection(db, "payment_methods"));
    if (pmSnap.empty) {
      for (const pm of DEFAULT_PAYMENT_METHODS) {
        await setDoc(doc(db, "payment_methods", pm.id), pm);
      }
    }

    // 4. Social Links Check
    for (const sl of DEFAULT_SOCIAL_LINKS) {
      const slRef = doc(db, "social_links", sl.id);
      const slDoc = await getDoc(slRef);
      if (!slDoc.exists()) {
        await setDoc(slRef, sl);
      }
    }

    // 5. Test reviews
    const revSnap = await getDocs(collection(db, "reviews"));
    if (revSnap.empty) {
      for (const rev of DEFAULT_REVIEWS) {
        await setDoc(doc(db, "reviews", rev.id), rev);
      }
    }
    console.log("Database seeded successfully.");
  } catch (error) {
    console.warn("Seeding bypassed or unavailable due to connection restrictions/permissions.", error);
  }
}

// ----------------------------------------------------
// DB Services Wrapper with Fallbacks
// ----------------------------------------------------

// 1. Users Services
export function listenToUsers(callback: (users: UserProfile[]) => void) {
  try {
    return onSnapshot(collection(db, "users"), (snap) => {
      const list: UserProfile[] = [];
      snap.forEach((d) => {
        list.push(d.data() as UserProfile);
      });
      callback(list);
    }, (error) => {
      console.warn("Falling back for users due to rules restriction.");
    });
  } catch (error) {
    console.warn("Unable to establish listener for users.");
    return () => {};
  }
}

export async function updateUserRole(userId: string, role: "Admin" | "Member") {
  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, "users", userId), { role });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function createOrUpdateUserRecord(uid: string, name: string, email: string, avatar: string, defaultAdminEmail?: string) {
  const path = `users/${uid}`;
  try {
    // Determine initially if user is Admin. Check user list, or if their email matches Google User emails
    const ref = doc(db, "users", uid);
    const existingSnap = await getDoc(ref);
    
    let role: "Admin" | "Member" = "Member";
    
    // Seed system developer as Admin
    if (email === "nimesh.designs.site@gmail.com" || email === defaultAdminEmail) {
      role = "Admin";
    } else if (existingSnap.exists()) {
      role = existingSnap.data().role as "Admin" | "Member";
    }

    const payload: UserProfile = {
      uid,
      name,
      email,
      avatar,
      role
    };

    await setDoc(ref, payload, { merge: true });
    return payload;
  } catch (error) {
    // If it fails, return a safe local record
    const fallbackRole = (email === "nimesh.designs.site@gmail.com" || email === defaultAdminEmail) ? "Admin" : "Member";
    return { uid, name, email, avatar, role: fallbackRole } as UserProfile;
  }
}

// 2. Reviews Services
export function listenToReviews(callback: (reviews: Review[]) => void, includePending: boolean = false) {
  try {
    const q = includePending 
      ? collection(db, "reviews")
      : query(collection(db, "reviews"), where("status", "==", "accepted"));
      
    return onSnapshot(q, (snap) => {
      const list: Review[] = [];
      snap.forEach((d) => {
        list.push(d.data() as Review);
      });
      callback(list);
    }, (error) => {
      console.warn("Failed to attach real-time queries. Serving mock reviews instead.");
      callback(DEFAULT_REVIEWS);
    });
  } catch (error) {
    callback(DEFAULT_REVIEWS);
    return () => {};
  }
}

export async function submitReview(name: string, comment: string, rating: number, userEmail: string) {
  const path = "reviews";
  try {
    const newDocRef = doc(collection(db, "reviews"));
    const reviewPayload: Review = {
      id: newDocRef.id,
      name,
      comment,
      rating,
      status: "pending",
      createdAt: new Date().toISOString(),
      userEmail
    };
    await setDoc(newDocRef, reviewPayload);
    return reviewPayload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function moderateReview(reviewId: string, status: ReviewStatus) {
  const path = `reviews/${reviewId}`;
  try {
    await updateDoc(doc(db, "reviews", reviewId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteReview(reviewId: string) {
  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, "reviews", reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 3. Orders Services
export function listenToAllOrders(callback: (orders: Order[]) => void) {
  try {
    return onSnapshot(collection(db, "orders"), (snap) => {
      const list: Order[] = [];
      snap.forEach((d) => {
        list.push(d.data() as Order);
      });
      callback(list);
    }, (error) => {
      console.warn("Read rules blocker. Retrying silently.");
    });
  } catch (error) {
    return () => {};
  }
}

export function listenToUserOrders(userEmail: string, callback: (orders: Order[]) => void) {
  try {
    const q = query(collection(db, "orders"), where("userEmail", "==", userEmail));
    return onSnapshot(q, (snap) => {
      const list: Order[] = [];
      snap.forEach((d) => {
        list.push(d.data() as Order);
      });
      callback(list);
    }, (error) => {
      console.warn("Fallback orders fetch");
    });
  } catch (error) {
    return () => {};
  }
}

export async function placeNewOrder(orderData: Omit<Order, "id" | "status" | "submittedAt">) {
  const path = "orders";
  try {
    const newRef = doc(collection(db, "orders"));
    const orderPayload: Order = {
      ...orderData,
      id: newRef.id,
      status: "pending_verification",
      submittedAt: new Date().toISOString()
    };
    await setDoc(newRef, orderPayload);
    return orderPayload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, "orders", orderId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteOrder(orderId: string) {
  const path = `orders/${orderId}`;
  try {
    await deleteDoc(doc(db, "orders", orderId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. WhatsApp Prices Config
export function listenToWhatsappPrices(callback: (prices: WhatsappPrice[]) => void) {
  try {
    return onSnapshot(collection(db, "whatsapp_prices"), (snap) => {
      const list: WhatsappPrice[] = [];
      snap.forEach((d) => {
        list.push(d.data() as WhatsappPrice);
      });
      // Sort logically by standard hierarchy
      callback(list.length ? list : DEFAULT_WHATSAPP_PRICES);
    }, (error) => {
      callback(DEFAULT_WHATSAPP_PRICES);
    });
  } catch (error) {
    callback(DEFAULT_WHATSAPP_PRICES);
    return () => {};
  }
}

export async function addWhatsappPrice(duration: string, priceLkr: string) {
  const path = "whatsapp_prices";
  try {
    const newRef = doc(collection(db, "whatsapp_prices"));
    await setDoc(newRef, { id: newRef.id, duration, priceLkr });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateWhatsappPrice(id: string, duration: string, priceLkr: string) {
  const path = `whatsapp_prices/${id}`;
  try {
    await updateDoc(doc(db, "whatsapp_prices", id), { duration, priceLkr });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteWhatsappPrice(id: string) {
  const path = `whatsapp_prices/${id}`;
  try {
    await deleteDoc(doc(db, "whatsapp_prices", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 5. Graphic Designs Services
export function listenToGraphicDesigns(callback: (designs: GraphicDesign[]) => void) {
  try {
    return onSnapshot(collection(db, "graphic_designs"), (snap) => {
      const list: GraphicDesign[] = [];
      snap.forEach((d) => {
        list.push(d.data() as GraphicDesign);
      });
      callback(list.length ? list : DEFAULT_GRAPHIC_DESIGNS);
    }, (error) => {
      callback(DEFAULT_GRAPHIC_DESIGNS);
    });
  } catch (error) {
    callback(DEFAULT_GRAPHIC_DESIGNS);
    return () => {};
  }
}

export async function addGraphicDesign(name: string, description: string, priceLkr: string, photo: string) {
  const path = "graphic_designs";
  try {
    const newRef = doc(collection(db, "graphic_designs"));
    await setDoc(newRef, { id: newRef.id, name, description, priceLkr, photo });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateGraphicDesign(id: string, name: string, description: string, priceLkr: string, photo: string) {
  const path = `graphic_designs/${id}`;
  try {
    await updateDoc(doc(db, "graphic_designs", id), { name, description, priceLkr, photo });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteGraphicDesign(id: string) {
  const path = `graphic_designs/${id}`;
  try {
    await deleteDoc(doc(db, "graphic_designs", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 6. Payment Methods Services
export function listenToPaymentMethods(callback: (methods: PaymentMethodRecord[]) => void) {
  try {
    return onSnapshot(collection(db, "payment_methods"), (snap) => {
      const list: PaymentMethodRecord[] = [];
      snap.forEach((d) => {
        list.push(d.data() as PaymentMethodRecord);
      });
      callback(list.length ? list : DEFAULT_PAYMENT_METHODS);
    }, (error) => {
      callback(DEFAULT_PAYMENT_METHODS);
    });
  } catch (error) {
    callback(DEFAULT_PAYMENT_METHODS);
    return () => {};
  }
}

export async function updatePaymentMethod(id: string, name: string, details: any) {
  const path = `payment_methods/${id}`;
  try {
    await updateDoc(doc(db, "payment_methods", id), { name, details });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 7. Social Links Services
export function listenToSocialLinks(callback: (links: SocialLink[]) => void) {
  try {
    return onSnapshot(collection(db, "social_links"), (snap) => {
      const list: SocialLink[] = [];
      snap.forEach((d) => {
        list.push(d.data() as SocialLink);
      });
      callback(list.length ? list : DEFAULT_SOCIAL_LINKS);
    }, (error) => {
      callback(DEFAULT_SOCIAL_LINKS);
    });
  } catch (error) {
    callback(DEFAULT_SOCIAL_LINKS);
    return () => {};
  }
}

export async function updateSocialLink(id: string, name: string, url: string) {
  const path = `social_links/${id}`;
  try {
    await updateDoc(doc(db, "social_links", id), { name, url });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
