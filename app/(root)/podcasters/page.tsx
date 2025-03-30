"use client";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import PodcasterProfileCard from "@/components/PodcasterProfileCard"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";

const Podcasters = () => {
  const router = useRouter();
  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);

  if (!topPodcasters) return <LoaderSpinner />;

  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasters</h1>
        <div className="podcast_grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topPodcasters?.map((podcaster) => (
            <PodcasterProfileCard
              key={podcaster._id}
              imgUrl={podcaster.imageUrl}
              title={podcaster.name}
              description={`${podcaster.totalPodcasts} podcasts`}
              podcastId={podcaster.clerkId}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Podcasters;
