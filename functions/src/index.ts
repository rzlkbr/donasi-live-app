// File: functions/src/index.ts (Versi 2 - Corrected)

// Impor modular dari Firebase Functions v2
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

// Impor modular dari Firebase Admin SDK
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Inisialisasi Firebase Admin SDK sekali saja
initializeApp();
const db = getFirestore();

/**
 * Trigger ini (v2) akan berjalan setiap kali ada dokumen BARU dibuat
 * di dalam koleksi 'donations'.
 * Opsi seperti 'region' dan 'document' didefinisikan dalam objek pertama.
 */
export const aggregateDonations = onDocumentCreated(
  {
    document: "donations/{donationId}",
    region: "asia-southeast2",
    retry: true,
  },

  async (event) => {
    // Mulai logging menggunakan logger v2
    logger.info("aggregateDonations function triggered", {
      documentId: event.params.donationId,
    });

    // 1. Dapatkan data dari snapshot event. Di v2, snapshot ada di event.data
    const snap = event.data;
    if (!snap) {
      logger.warn("No data associated with the event.");
      return;
    }

    const donationData = snap.data();
    const { groupId, amount } = donationData;
    const donationId = event.params.donationId;

    // Validasi data (hindari logging PII)
    if (
      typeof groupId !== "string" ||
      groupId.trim().length === 0 ||
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      logger.error(
        "Invalid donation data: missing/invalid groupId or amount.",
        {
          documentId: donationId,
          groupId: groupId ?? null,
          amountType: typeof amount,
        }
      );
      return;
    }

    // Idempotency: gunakan collection 'processedDonations' untuk deduplication
    const processedRef = db.collection("processedDonations").doc(donationId);
    const processedSnap = await processedRef.get();
    if (processedSnap.exists) {
      logger.info({
        operation: "aggregateDonation",
        donationId,
        status: "already processed"
      });
      return;
    }

    // 2. Dapatkan referensi ke dokumen kelompok yang sesuai
    const groupRef = db.collection("groups").doc(groupId);

    try {
      // 3. Update dokumen kelompok secara atomik (buat jika belum ada)
      await groupRef.set(
        {
          totalDonations: FieldValue.increment(amount),
          donationCount: FieldValue.increment(1),
          lastUpdated: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      // Tandai donationId sudah diproses (idempotency)
      await processedRef.set({ processed: true, timestamp: FieldValue.serverTimestamp() });
      logger.info(`Successfully aggregated ${amount} to group ${groupId}.`);
    } catch (error) {
      logger.error({
        operation: "aggregateDonation",
        groupId,
        amount,
        donationId,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
);