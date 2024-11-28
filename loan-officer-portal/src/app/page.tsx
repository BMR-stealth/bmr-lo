"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService, type Bid, type Lead } from "@/services/api";
import { Header } from "@/components/dashboard/header";

export default function Home() {
  const { data: bids } = useQuery<Bid[]>({
    queryKey: ["bids"],
    queryFn: apiService.getMyBids,
  });

  const { data: leads } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: apiService.getMyLeads,
  });

  const activeBids = bids?.filter((bid) => bid.status === "active") ?? [];
  const pendingLeads = leads?.filter((lead) => lead.status === "new") ?? [];
  const totalBidAmount = activeBids.reduce((sum, bid) => sum + bid.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Welcome to Loan Officer Portal</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <h3 className="font-semibold">Active Bids</h3>
              <p className="text-2xl font-bold">{activeBids.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <h3 className="font-semibold">Pending Leads</h3>
              <p className="text-2xl font-bold">{pendingLeads.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <h3 className="font-semibold">Total Bid Volume</h3>
              <p className="text-2xl font-bold">${(totalBidAmount / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
