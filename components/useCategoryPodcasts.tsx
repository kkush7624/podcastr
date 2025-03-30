import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const useCategoryPodcasts = (categoryType: string) => {
  return useQuery(api.podcast.getPodcastByCategoryType, { categoryType });
};

export default useCategoryPodcasts;
