"use client";

import { SearchBar } from "@/components/search/search-bar";
import { TrendingList } from "@/components/search/trending-list";
import { WhoToFollow } from "@/components/search/who-to-follow";

export function RightSidebar() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-4 py-3">
      <SearchBar />
      <TrendingList />
      <WhoToFollow />
    </div>
  );
}
