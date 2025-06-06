import { useMutation } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import { Community, UseMutationResult } from "../../../types";

export type PostCommunityResponse = Awaited<ReturnType<typeof postCommunity>>;
export type UpdateCommunityResponse = Awaited<
  ReturnType<typeof updateCommunity>
>;
export type DeleteCommunityResponse = Awaited<
  ReturnType<typeof deleteCommunity>
>;
export type SearchCommunitiesResponse = Awaited<
  ReturnType<typeof searchCommunities>
>;

const postCommunity = async (community: Community["Insert"]) => {
  const { data, error } = await supabase
    .from("community")
    .insert(community)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

const updateCommunity = async (community: Community["Update"]) => {
  if (!community.communityId) {
    return;
  }

  const { data, error } = await supabase
    .from("community")
    .update(community)
    .eq("communityId", community.communityId)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

const deleteCommunity = async (communityId: number) => {
  await supabase.from("chat").delete().eq("communityId", communityId);
  await supabase.from("notification").delete().eq("communityId", communityId);
  const { data, error } = await supabase
    .from("community")
    .delete()
    .eq("communityId", communityId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const searchCommunities = async ({
  query,
  userId,
}: {
  query: string;
  userId: string | undefined;
}) => {
  const { data, error } = await supabase
    .from("community")
    .select()
    .ilike("name", `%${query}%`)
    .neq("ownerId", userId)
    .not("memberIds", "cs", `{"${userId}"}`)
    .order("updatedAt", { ascending: false });

  if (error) {
    throw error;
  }
  return data;
};

export const usePostCommunity = ({
  onSuccess,
  onError,
}: UseMutationResult<PostCommunityResponse, Error>) =>
  useMutation({
    mutationFn: postCommunity,
    onSuccess,
    onError,
  });

export const useUpdateCommunity = ({
  onSuccess,
  onError,
}: UseMutationResult<UpdateCommunityResponse, Error>) =>
  useMutation({
    mutationFn: updateCommunity,
    onSuccess,
    onError,
  });

export const useDeleteCommunity = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteCommunityResponse, Error>) =>
  useMutation({
    mutationFn: deleteCommunity,
    onSuccess,
    onError,
  });

export const useSearchCommunities = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchCommunitiesResponse, Error>) =>
  useMutation({
    mutationFn: searchCommunities,
    onSuccess,
    onError,
  });
