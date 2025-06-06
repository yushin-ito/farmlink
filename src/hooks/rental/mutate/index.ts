import { useMutation } from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";

import { supabase } from "../../../supabase";
import { Rental, UseMutationResult } from "../../../types";

export type PostRentalResponse = Awaited<ReturnType<typeof postRental>>;
export type UpdateRentalResponse = Awaited<ReturnType<typeof updateRental>>;
export type PostRentalImageResponse = Awaited<
  ReturnType<typeof postRentalImage>
>;
export type DeleteRentalResponse = Awaited<ReturnType<typeof deleteRental>>;
export type SearchRentalsResponse = Awaited<ReturnType<typeof searchRentals>>;

const postRental = async (rental: Rental["Insert"]) => {
  const { data, error } = await supabase
    .from("rental")
    .insert(rental)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const updateRental = async (rental: Rental["Update"]) => {
  if (!rental.rentalId) {
    throw Error();
  }
  const { data, error } = await supabase
    .from("rental")
    .update(rental)
    .eq("rentalId", rental.rentalId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const postRentalImage = async (base64: string) => {
  const filePath = `rental/${Math.random()}.png`;

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

const deleteRental = async (rentalId: number) => {
  await supabase.from("like").delete().eq("rentalId", rentalId);
  await supabase.from("notification").delete().eq("rentalId", rentalId);
  const { data, error } = await supabase
    .from("rental")
    .delete()
    .eq("rentalId", rentalId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const searchRentals = async ({
  query,
  userId,
}: {
  query: string;
  userId: string | undefined;
}) => {
  const { data, error } = await supabase
    .from("rental")
    .select()
    .ilike("name", `%${query}%`);

  if (error) {
    throw error;
  }
  return data
    .map((item) => ({
      ...item,
      imageUrl: item.imageUrls && item.imageUrls[0],
    }))
    .filter((item) => !item.privated || item.ownerId === userId);
};

export const usePostRental = ({
  onSuccess,
  onError,
}: UseMutationResult<PostRentalResponse, Error>) =>
  useMutation({
    mutationFn: postRental,
    onSuccess,
    onError,
  });

export const useUpdateRental = ({
  onSuccess,
  onError,
}: UseMutationResult<UpdateRentalResponse, Error>) =>
  useMutation({
    mutationFn: updateRental,
    onSuccess,
    onError,
  });

export const usePostRentalImage = ({
  onSuccess,
  onError,
}: UseMutationResult<PostRentalImageResponse, Error>) =>
  useMutation({
    mutationFn: postRentalImage,
    onSuccess,
    onError,
  });

export const useDeleteRental = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteRentalResponse, Error>) =>
  useMutation({
    mutationFn: deleteRental,
    onSuccess,
    onError,
  });

export const useSearchRentals = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchRentalsResponse, Error>) =>
  useMutation({
    mutationFn: searchRentals,
    onSuccess,
    onError,
  });
