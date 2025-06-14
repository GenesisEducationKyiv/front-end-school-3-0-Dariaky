import { z } from 'zod';

export const TrackSortSchema = z.enum(['title', 'artist', 'album', 'createdAt']);

export const TrackOrderSchema = z.enum(['asc', 'desc']);

export const TrackCollectionMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const TrackSearchItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string().optional(),
  genres: z.array(z.string()),
  slug: z.string(),
  coverImage: z.string().optional(),
  audioFile: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TrackCreateRequestSchema = z.object({
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  genres: z.array(z.string()),
  coverImage: z.string(),
});

export const TrackCollectionResponseSchema = z.object({
  data: z.array(TrackSearchItemSchema),
  meta: TrackCollectionMetaSchema,
});

export const TrackParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  sort: TrackSortSchema.optional(),
  order: TrackOrderSchema.optional(),
  search: z.string().optional(),
  genre: z.string().optional(),
  artist: z.string().optional(),
});

export const TracksDeleteResponseSchema = z.object({
  success: z.array(z.string()),
  failed: z.array(z.string()),
});

export type TrackSort = z.infer<typeof TrackSortSchema>;
export type TrackOrder = z.infer<typeof TrackOrderSchema>;
export type TrackCollectionMeta = z.infer<typeof TrackCollectionMetaSchema>;
export type TrackCreateRequest = z.infer<typeof TrackCreateRequestSchema>;
export type TrackSearchItem = z.infer<typeof TrackSearchItemSchema>;
export type TrackCollectionResponse = z.infer<typeof TrackCollectionResponseSchema>;
export type TrackParams = z.infer<typeof TrackParamsSchema>;
export type TracksDeleteResponse = z.infer<typeof TracksDeleteResponseSchema>;
