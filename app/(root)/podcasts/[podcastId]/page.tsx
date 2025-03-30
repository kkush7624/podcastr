"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";

const PodcastDetails = ({
  params: { podcastId },
}: {
  params: { podcastId: Id<"podcasts"> };
}) => {
  const { user } = useUser();

  const podcast = useQuery(api.podcast.getPodcastById, { podcastId });

  const similarPodcasts = useQuery(api.podcast.getPodcastByVoiceType, {
    podcastId,
  });

  const isOwner = user?.id === podcast?.authorId;

  if (!similarPodcasts || !podcast) return <LoaderSpinner />;

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currenty Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
        </figure>
      </header>

      <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        {...podcast}
      />

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 pt-4">
          <h1 className="text-18 font-bold text-white-1">Description</h1>
          <p className="pb-0 text-16 font-medium text-white-2">
            {podcast?.podcastDescription}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <Textarea
            className="text-16 font-medium text-white-2 bg-[#101114] focus:bg-[#101114] focus:outline-none resize-none max-h-60 overflow-y-auto"
            style={{ height: "auto", minHeight: "100px", maxHeight: "240px" }}
            value={podcast?.voicePrompt || ""}
            readOnly
          />
        </div>
        {isOwner ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
            <p className="text-16 font-medium text-white-2">
              {podcast?.imagePrompt}
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>

        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts?.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl as string}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default PodcastDetails;
