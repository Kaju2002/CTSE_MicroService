"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getAuthTokenFromCookie } from "@/lib/authClient";
import { getEventServiceUrl } from "@/lib/eventClient";

type EventStatus = "active" | "cancelled" | "completed";

type EventDetail = {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  status?: EventStatus;
  tags?: string[];
  coverImage?: string;
  galleryImages?: string[];
};

function toDateTimeLocal(value: string) {
  const d = new Date(value);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState<EventStatus>("active");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState("");

  useEffect(() => {
    async function loadEvent() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`${getEventServiceUrl()}/events/${id}`);
        const data = (await res.json().catch(() => ({}))) as EventDetail & { message?: string };
        if (!res.ok) {
          setError(data.message || "Failed to fetch event.");
          return;
        }
        setTitle(data.title || "");
        setDescription(data.description || "");
        setLocation(data.location || "");
        setStart(toDateTimeLocal(data.start));
        setEnd(toDateTimeLocal(data.end));
        setStatus(data.status || "active");
        setTags((data.tags || []).join(", "));
        setCoverImage(data.coverImage || "");
        setGalleryImages((data.galleryImages || []).join(", "));
      } catch {
        setError("Something went wrong while fetching event.");
      } finally {
        setLoading(false);
      }
    }
    void loadEvent();
  }, [id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id || saving) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = getAuthTokenFromCookie();
      if (!token) {
        setError("You are not signed in.");
        return;
      }

      const payload = {
        title,
        description,
        location,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        status,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        coverImage,
        galleryImages: galleryImages
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean),
      };

      const res = await fetch(`${getEventServiceUrl()}/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setError(data.message || "Failed to update event.");
        return;
      }
      setSuccess("Event updated successfully.");
      setTimeout(() => router.push(`/event-management/view-events/${id}`), 800);
    } catch {
      setError("Something went wrong while updating event.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-500 dark:text-gray-400">Loading event...</p>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Edit Event
        </h3>
        <Link href={`/event-management/view-events/${id}`} className="rounded-lg border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
          Back
        </Link>
      </div>

      <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <textarea className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2 dark:border-gray-700 dark:bg-gray-900" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        <input type="datetime-local" className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value={start} onChange={(e) => setStart(e.target.value)} required />
        <input type="datetime-local" className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value={end} onChange={(e) => setEnd(e.target.value)} required />
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value={status} onChange={(e) => setStatus(e.target.value as EventStatus)}>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Cover Image URL" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
        <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Gallery Image URLs (comma separated)" value={galleryImages} onChange={(e) => setGalleryImages(e.target.value)} />

        {error && <p className="text-sm text-error-500 md:col-span-2">{error}</p>}
        {success && <p className="text-sm text-success-600 md:col-span-2">{success}</p>}

        <button type="submit" disabled={saving} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60">
          {saving ? "Saving..." : "Update Event"}
        </button>
      </form>
    </div>
  );
}

