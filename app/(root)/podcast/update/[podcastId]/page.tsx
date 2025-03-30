"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastForm from "@/components/PodcastForm";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

const UpdatePodcast = ({
  params: { podcastId },
}: {
  params: { podcastId: Id<"podcasts"> };
}) => {
  const { user } = useUser();

  // Fetch podcast data using useQuery
  const podcast = useQuery(api.podcast.getPodcastById, { podcastId });

  // Loading state
  if (podcast === undefined) return <LoaderSpinner />;

  // Error state handling
  if (podcast === null) {
    return (
      <EmptyState
        title="Podcast not found. Please check the ID."
        buttonText="Try Again"
      />
    );
  }

  // Check if the user is the owner of the podcast
  const isOwner = user?.id === podcast.authorId;

  return (
    <section className="flex w-full flex-col">
      {isOwner ? (
        <PodcastForm
          existingData={{
            podcastId: podcast._id, // Map _id to podcastId
            audioUrl: podcast.audioUrl || "",
            imageUrl: podcast.imageUrl || "",
            podcastTitle: podcast.podcastTitle || "",
            podcastDescription: podcast.podcastDescription || "",
            voicePrompt: podcast.voicePrompt || "",
            imagePrompt: podcast.imagePrompt || "",
            voiceType: podcast.voiceType || "",
            categoryType: podcast.categoryType || "",
            views: podcast.views,
            audioDuration: podcast.audioDuration || 0,
            audioStorageId: podcast.audioStorageId || undefined, // Add audioStorageId
            imageStorageId: podcast.imageStorageId || undefined, // Add imageStorageId
          }}
        />
      ) : (
        <p className="text-red-500">
          You do not have permission to update this podcast.
        </p>
      )}
    </section>
  );
};

export default UpdatePodcast;
