import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { UseMutationResult, User } from "../../../types/db";
import { PostgrestError } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

export type PostUserResponse = Awaited<ReturnType<typeof postUser>>;
export type PostAvatarResponse = Awaited<ReturnType<typeof postAvatar>>;
export type SearchUsersResponse = Awaited<ReturnType<typeof searchUsers>>;

const postUser = async (user: User["Insert"]) => {
  const { data, error } = await supabase.from("user").upsert(user).select();
  if (error) {
    throw error;
  }
  return data;
};

const postAvatar = async ({
  base64,
  userId,
}: {
  base64: string;
  userId: string;
}) => {
  const filePath = `avatar/${userId}.png`;
  const { error } = await supabase.storage
    .from("image")
    .upload(filePath, decode(base64), {
      contentType: "image",
      upsert: true,
    });
  if (error) {
    throw error;
  }
  const { data } = supabase.storage.from("image").getPublicUrl(filePath);
  await postUser({ userId, avatarUrl: data.publicUrl });
};

const searchUsers = async ({
  userId,
  text,
}: {
  userId: string | undefined;
  text: string;
}) => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .neq("userId", userId)
    .ilike("displayName", `%${text}%`);
  if (error) {
    throw error;
  }
  return data;
};

export const usePostUser = ({
  onSuccess,
  onError,
}: UseMutationResult<PostUserResponse, PostgrestError>) =>
  useMutation({
    mutationFn: postUser,
    onSuccess,
    onError,
  });

export const usePostAvatar = ({
  onSuccess,
  onError,
}: UseMutationResult<PostAvatarResponse, Error>) =>
  useMutation({
    mutationFn: postAvatar,
    onSuccess,
    onError,
  });

export const useSearchUsers = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchUsersResponse, PostgrestError>) =>
  useMutation({
    mutationFn: searchUsers,
    onSuccess,
    onError,
  });
