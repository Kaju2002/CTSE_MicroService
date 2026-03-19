"use client";

import React, { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthTokenFromCookie } from "@/lib/authClient";
import { getEventServiceUrl } from "@/lib/eventClient";

type EventStatus = "active" | "cancelled" | "completed";
type SeatType = "VIP" | "Regular" | "Balcony" | "Economy";

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState<EventStatus>("active");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState("");
  const [isSeated, setIsSeated] = useState(true);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [seatType, setSeatType] = useState<SeatType>("Regular");
  const [seatPrice, setSeatPrice] = useState(2000);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const parsedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags],
  );

  const parsedGallery = useMemo(
    () =>
      galleryImages
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean),
    [galleryImages],
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setSuccess(null);

    try {
      setIsSubmitting(true);
      const token = getAuthTokenFromCookie();
      if (!token) {
        setError("You are not signed in.");
        return;
      }

      const payload: Record<string, unknown> = {
        title,
        description,
        location,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        status,
        tags: parsedTags,
        isSeated,
        coverImage: coverImage || undefined,
        galleryImages: parsedGallery,
      };

      if (isSeated) {
        payload.rows = rows;
        payload.cols = cols;
        payload.seatType = seatType;
        payload.seatPrice = seatPrice;
      }

      const res = await fetch(`${getEventServiceUrl()}/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
      };
      if (!res.ok) {
        setError(data.message || "Failed to create event.");
        return;
      }

      setSuccess("Event created successfully.");
      setTimeout(() => {
        router.push("/event-management/view-events");
      }, 600);
    } catch {
      setError("Something went wrong while creating the event.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Create Event
      </h3>

      <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Title</label>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Location</label>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-gray-500">Description</label>
          <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Start</label>
          <input type="datetime-local" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value={start} onChange={(e) => setStart(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">End</label>
          <input type="datetime-local" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Status</label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value={status} onChange={(e) => setStatus(e.target.value as EventStatus)}>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Tags</label>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Comma separated tags" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Cover Image URL</label>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="https://..." value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Gallery Image URLs</label>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Comma separated image URLs" value={galleryImages} onChange={(e) => setGalleryImages(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={isSeated} onChange={(e) => setIsSeated(e.target.checked)} />
            Seated Event
          </label>
        </div>

        {isSeated && (
          <>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Rows</label>
              <input type="number" min={1} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Rows" value={rows} onChange={(e) => setRows(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Columns</label>
              <input type="number" min={1} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Columns" value={cols} onChange={(e) => setCols(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Seat Type</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value={seatType} onChange={(e) => setSeatType(e.target.value as SeatType)}>
                <option value="VIP">VIP</option>
                <option value="Regular">Regular</option>
                <option value="Balcony">Balcony</option>
                <option value="Economy">Economy</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Seat Price</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Seat Price" value={seatPrice} onChange={(e) => setSeatPrice(Number(e.target.value))} />
            </div>
          </>
        )}

        {error && <p className="text-sm text-error-500 md:col-span-2">{error}</p>}
        {success && <p className="text-sm text-success-600 md:col-span-2">{success}</p>}

        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60">
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

