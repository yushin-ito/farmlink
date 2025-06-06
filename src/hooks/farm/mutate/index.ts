import { useMutation } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";

import { supabase } from "../../../supabase";
import { Farm, UseMutationResult } from "../../../types";

export type PostFarmResponse = Awaited<ReturnType<typeof postFarm>>;
export type UpdateFarmResponse = Awaited<ReturnType<typeof updateFarm>>;
export type PostFarmImageResponse = Awaited<ReturnType<typeof postFarmImage>>;
export type DeleteFarmResponse = Awaited<ReturnType<typeof deleteFarm>>;
export type SearchFarmsResponse = Awaited<ReturnType<typeof searchFarms>>;

const postFarm = async (farm: Farm["Insert"]) => {
  const { data, error } = await supabase
    .from("farm")
    .insert(farm)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const updateFarm = async (farm: Farm["Update"]) => {
  if (!farm.farmId) {
    throw Error();
  }

  const { data, error } = await supabase
    .from("farm")
    .update(farm)
    .eq("farmId", farm.farmId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const postFarmImage = async (base64: string) => {
  const filePath = `farm/${Math.random()}.png`;

  const { data, error } = await supabase.storage
    .from("image")
    .upload(filePath, decode(base64), {
      contentType: "image",
      upsert: true,
    });

  if (error) {
    throw error;
  }
  return data;
};

const deleteFarm = async (farmId: number) => {
  await supabase.from("record").delete().eq("farmId", farmId);
  await supabase.from("like").delete().eq("farmId", farmId);
  await supabase.from("notification").delete().eq("farmId", farmId);
  const { data, error } = await supabase
    .from("farm")
    .delete()
    .eq("farmId", farmId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const searchFarms = async ({
  query,
  userId,
}: {
  query: string;
  userId: string | undefined;
}) => {
  const { data, error } = await supabase
    .from("farm")
    .select("*, device(imageUrl)")
    .ilike("name", `%${query}%`)
    .returns<(Farm["Row"] & { device: { imageUrl: string } })[]>();

  if (error) {
    throw error;
  }
  return data
    .map((item) => ({
      ...item,
      imageUrl: item.device.imageUrl,
    }))
    .filter((item) => !item.privated || item.ownerId === userId);
};

export const usePostFarm = ({
  onSuccess,
  onError,
}: UseMutationResult<PostFarmResponse, Error>) =>
  useMutation({
    mutationFn: postFarm,
    onSuccess,
    onError,
  });

export const useUpdateFarm = ({
  onSuccess,
  onError,
}: UseMutationResult<UpdateFarmResponse, Error>) =>
  useMutation({
    mutationFn: updateFarm,
    onSuccess,
    onError,
  });

export const usePostFarmImage = ({
  onSuccess,
  onError,
}: UseMutationResult<PostFarmImageResponse, Error>) =>
  useMutation({
    mutationFn: postFarmImage,
    onSuccess,
    onError,
  });

export const useDeleteFarm = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteFarmResponse, Error>) =>
  useMutation({
    mutationFn: deleteFarm,
    onSuccess,
    onError,
  });

export const useSearchFarms = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchFarmsResponse, Error>) =>
  useMutation({
    mutationFn: searchFarms,
    onSuccess,
    onError,
  });
