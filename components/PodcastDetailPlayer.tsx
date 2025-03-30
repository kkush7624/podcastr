"use client";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { useAudio } from "@/providers/AudioProvider";
import { PodcastDetailPlayerProps } from "@/types";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const PodcastDetailPlayer = ({
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
}: PodcastDetailPlayerProps) => {
  const router = useRouter();
  const { setAudio } = useAudio();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const deletePodcast = useMutation(api.podcast.deletePodcast);
  const updatePodcast = useMutation(api.podcast.updatePodcast);

  const handleDelete = async () => {
    try {
      await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      toast({
        title: "Podcast deleted",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting podcast", error);
      toast({
        title: "Error deleting podcast",
        variant: "destructive",
      });
    }
  };

  const handlePlay = () => {
    setAudio({
      title: podcastTitle,
      audioUrl,
      imageUrl,
      author,
      podcastId,
    });
  };

  const handleUpdate = () => {
    setIsUpdating(true); // Set state to true when update starts
    // Simulate API call or redirection here
    router.push(`/podcast/update/${podcastId}`);
    setIsUpdating(false); // Set state back to false once update is done
  };

  if (!imageUrl || !authorImageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {podcastTitle}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                router.push(`/profile/${authorId}`);
              }}
            >
              <Image
                src={authorImageUrl}
                width={30}
                height={30}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </article>

          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play podcast
          </Button>
        </div>
      </div>
      <div>
        {isOwner && (
          <div className="relative mt-2">
            <Image
              src="/icons/three-dots.svg"
              width={20}
              height={30}
              alt="Three dots icon"
              className="cursor-pointer"
              onClick={() => setIsDeleting((prev) => !prev)}
            />
            {isDeleting && (
              <div className="absolute -left-32 -top-2 z-10 flex flex-col w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-4 hover:shadow-lg transition-all duration-200">
                {/* Delete Button */}
                <div
                  className="flex items-center gap-2 rounded-md p-2 cursor-pointer hover:shadow-md hover:bg-red-500 transition-colors duration-200"
                  onClick={handleDelete}
                >
                  <Image
                    src="/icons/delete.svg"
                    width={16}
                    height={16}
                    alt="Delete icon"
                  />
                  <h2 className="text-16 font-normal text-white-1">Delete</h2>
                </div>
                <div
                  className="flex items-center gap-2 rounded-md p-2 cursor-pointer hover:shadow-md hover:bg-blue-500 transition-colors duration-200"
                  onClick={handleUpdate}
                >
                  <Image
                    src="/icons/edit.svg"
                    width={16}
                    height={16}
                    alt="Edit icon"
                  />
                  <h2 className="text-16 font-normal text-white-1">
                    {isUpdating ? "Updating..." : "Update"}{" "}
                    {/* Conditionally show update state */}
                  </h2>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastDetailPlayer;
