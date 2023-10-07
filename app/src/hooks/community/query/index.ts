import { supabase } from "../../../supabase";
import { useInfiniteQuery } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";
import { Category } from "../../../functions";

export type GetCommunitiesResponse = Awaited<ReturnType<typeof getCommunities>>;

const getCommunities = async (
  category: Category,
  from: number,
  to: number,
  userId: string | undefined
) => {
  if (category === "all") {
    const { data, error } = await supabase
      .from("community")
      .select("*")
      .order("createdAt", { ascending: false })
      .range(from, to);
    if (error) {
      throw error;
    }

    return data;
  } else if (category === "joined") {
    const { data, error } = await supabase
      .from("community")
      .select("*")
      .contains("memberIds", [userId])
      .order("createdAt", { ascending: false })
      .range(from, to);
    if (error) {
      throw error;
    }

    return data;
  } else {
    const { data, error } = await supabase
      .from("community")
      .select("*")
      .eq("category", category)
      .order("createdAt", { ascending: false })
      .range(from, to);
    if (error) {
      throw error;
    }

    return data;
  }
};

export const useInfiniteQueryCommunities = (
  category: Category,
  userId: string | undefined
) => {
  const PAGE_COUNT = 15;
  const query = useInfiniteQuery<GetCommunitiesResponse, PostgrestError>({
    queryKey: ["community", category],
    queryFn: async ({ pageParam = 0 }) => {
      return await getCommunities(
        category,
        pageParam,
        pageParam + PAGE_COUNT - 1,
        userId
      );
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.length === PAGE_COUNT) {
        return pages.map((page) => page).flat().length;
      }
    },
  });

  const data = useMemo(
    () =>
      query.data?.pages
        .flatMap((page) => page)
        .filter((page): page is NonNullable<typeof page> => page !== null),
    [query.data]
  );

  return { ...query, data };
};
