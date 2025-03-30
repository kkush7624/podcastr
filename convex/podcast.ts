import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Define the interface for updates
interface PodcastUpdate {
  podcastTitle?: string;
  podcastDescription?: string;
  audioUrl?: string;
  imageUrl?: string;
  voicePrompt?: string;
  imagePrompt?: string;
  voiceType?: string;
  categoryType?: string;
  views?: number;
  audioDuration?: number;
  audioStorageId?: Id<"_storage">; // Change to Id type
  imageStorageId?: Id<"_storage">; // Change to Id type
}

// create podcast mutation
export const createPodcast = mutation({
  args: {
    audioStorageId: v.id("_storage"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    categoryType: v.string(),
    views: v.number(),
    audioDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("podcasts", {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      podcastTitle: args.podcastTitle,
      podcastDescription: args.podcastDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: args.voiceType,
      categoryType: args.categoryType,
      views: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
    });
  },
});

export const updatePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    categoryType: v.string(),
    views: v.number(),
    audioDuration: v.number(),
    audioStorageId: v.id("_storage"), // Make optional
    imageStorageId: v.id("_storage"), // Make optional
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    const updates: PodcastUpdate = {};

    // Only add fields that are present in args
    if (args.podcastTitle) updates.podcastTitle = args.podcastTitle;
    if (args.podcastDescription)
      updates.podcastDescription = args.podcastDescription;
    if (args.audioUrl) updates.audioUrl = args.audioUrl;
    if (args.imageUrl) updates.imageUrl = args.imageUrl;
    if (args.voicePrompt) updates.voicePrompt = args.voicePrompt;
    if (args.imagePrompt) updates.imagePrompt = args.imagePrompt;
    if (args.voiceType) updates.voiceType = args.voiceType;
    if (args.categoryType) updates.categoryType = args.categoryType;
    if (args.views !== undefined) updates.views = args.views; // allow for setting views to 0
    if (args.audioDuration) updates.audioDuration = args.audioDuration;
    updates.audioStorageId = args.audioStorageId as Id<"_storage">; // Casting or ensure it's the correct type
    updates.imageStorageId = args.imageStorageId as Id<"_storage">;

    // Update the podcast in the database
    return await ctx.db.patch(args.podcastId, updates);
  },
});

// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// this query will get all the podcasts based on the voiceType of the podcast , which we are showing in the Similar Podcasts section.
export const getPodcastByVoiceType = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    return await ctx.db
      .query("podcasts")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), podcast?.voiceType),
          q.neq(q.field("_id"), args.podcastId)
        )
      )
      .collect();
  },
});

// this query will get all the podcasts.
export const getAllPodcasts = query({
  handler: async (ctx) => {
    return await ctx.db.query("podcasts").order("desc").collect();
  },
});

// this query will get the podcast by the podcastId.
export const getPodcastById = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.podcastId);
  },
});

// this query will get the podcast by the categoryType.
export const getPodcastByCategoryType = query({
  args: {
    categoryType: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("categoryType"), args.categoryType))
      .collect();
    return { podcasts };
  },
});

// this query will get the podcasts based on the views of the podcast , which we are showing in the Trending Podcasts section.
export const getTrendingPodcasts = query({
  handler: async (ctx) => {
    const podcast = await ctx.db.query("podcasts").collect();

    return podcast.sort((a, b) => b.views - a.views).slice(0, 8);
  },
});

// this query will get the podcast by the authorId.
export const getPodcastByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = podcasts.reduce(
      (sum, podcast) => sum + podcast.views,
      0
    );

    return { podcasts, listeners: totalListeners };
  },
});

// this query will get the podcast by the search query.
export const getPodcastBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("podcasts").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_title", (q) =>
        q.search("podcastTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("podcasts")
      .withSearchIndex("search_body", (q) =>
        q.search("podcastDescription" || "podcastTitle", args.search)
      )
      .take(10);
  },
});

// this mutation will update the views of the podcast.
export const updatePodcastViews = mutation({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    return await ctx.db.patch(args.podcastId, {
      views: podcast.views + 1,
    });
  },
});

// this mutation will delete the podcast.
export const deletePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.podcastId);
  },
});

// this query will get all the podcasts created by the authenticated user.
export const getUserPodcasts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("User Identity:", identity); // Log the identity for debugging

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    // Fetch the user by fullName instead of email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email)) // Assuming fullName is accessible
      .collect();
    console.log("Users Found:", user); // Log the user results for debugging

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    // Fetch podcasts based on the user's ID
    return await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("user"), user[0]._id)) // Assuming `user` field in podcasts references the user's ID
      .collect();
  },
});
