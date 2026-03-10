"use client";

import React, { useEffect, useState } from "react";
import { getAuthTokenFromCookie, getUserServiceUrl } from "@/lib/authClient";
import Link from "next/link";
import { GroupIcon } from "@/icons";

export function TotalUsersCard() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTotalUsers() {
      try {
        const token = getAuthTokenFromCookie();
        if (!token) {
          setError("You are not signed in.");
          setLoading(false);
          return;
        }
        const baseUrl = getUserServiceUrl();
        const res = await fetch(`${baseUrl}/users?page=1&limit=1`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = (await res.json().catch(() => ({}))) as {
          total?: number;
          message?: string;
        };

        if (!res.ok) {
          setError(data.message || "Unable to load total users.");
          setLoading(false);
          return;
        }

        setTotalUsers(typeof data.total === "number" ? data.total : 0);
        setLoading(false);
      } catch {
        setError("Something went wrong while loading total users.");
        setLoading(false);
      }
    }

    void fetchTotalUsers();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        System Overview
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Key numbers from your application.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 dark:border-white/[0.05] dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
              <GroupIcon className="h-6 w-6" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Total Users
            </p>
          </div>
          {loading && (
            <div className="mt-4 h-7 w-16 rounded-lg bg-gray-200 animate-pulse dark:bg-white/10" />
          )}
          {!loading && error && (
            <p className="mt-4 text-sm text-error-500">{error}</p>
          )}
          {!loading && !error && (
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">
              {totalUsers ?? 0}
            </p>
          )}
          <Link href="/app-users" className="mt-4 inline-block text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
            View All Users
          </Link>
        </div>
      </div>
    </div>
  );
}

