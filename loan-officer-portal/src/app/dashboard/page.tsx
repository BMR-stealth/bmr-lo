"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { formatDistance } from "date-fns";

export default function DashboardPage() {
  const { data: bids } = useQuery({
    queryKey: ["bids"],
    queryFn: apiService.getMyBids,
  });

  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: apiService.getMyLeads,
  });

  const activeBids = bids?.filter((bid) => bid.status === "active") ?? [];
  const wonBids = bids?.filter((bid) => bid.status === "won") ?? [];
  const newLeads = leads?.filter((lead) => lead.status === "new") ?? [];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Active Bids
            </p>
            <p className="text-2xl font-bold">{activeBids.length}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Won Bids
            </p>
            <p className="text-2xl font-bold">{wonBids.length}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              New Leads
            </p>
            <p className="text-2xl font-bold">{newLeads.length}</p>
          </div>
        </div>
      </div>

      {leads && leads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Leads</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Lead #{lead.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistance(new Date(lead.created_at), new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-sm ${
                      lead.status === "qualified"
                        ? "text-green-500"
                        : lead.status === "lost"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
