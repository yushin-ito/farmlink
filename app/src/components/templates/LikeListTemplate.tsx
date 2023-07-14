import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

import {
  Box,
  Heading,
  HStack,
  IconButton,
  Icon,
  FlatList,
  Text,
  Pressable,
  Spinner,
} from "native-base";
import { useTranslation } from "react-i18next";
import { GetUserLikesResponse } from "../../hooks/like/query";
import LikeItem from "../organisms/LikeItem";
import { RefreshControl } from "react-native";

type LikeListTemplateProps = {
  likes: GetUserLikesResponse | undefined;
  deleteFarmLike: (farmId: number) => Promise<void>;
  deleteRentalLike: (likeId: number) => Promise<void>;
  refetchLikes: () => Promise<void>;
  mapNavigationHandler: (
    latitude: number | null,
    longitude: number | null
  ) => Promise<void>;
  isLoadingLikes: boolean;
  isRefetchingLikes: boolean;
  goBackNavigationHandler: () => void;
};

const LikeListTemplate = ({
  likes,
  deleteRentalLike,
  deleteFarmLike,
  refetchLikes,
  isLoadingLikes,
  isRefetchingLikes,
  mapNavigationHandler,
  goBackNavigationHandler,
}: LikeListTemplateProps) => {
  const { t } = useTranslation("setting");
  const [type, setType] = useState<"farm" | "rental">("farm");

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
          variant="unstyled"
        />
        <Heading textAlign="center">{t("likeList")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" />}
          variant="unstyled"
        />
      </HStack>
      <Box flex={1}>
        <HStack my="2" ml="6" space="2">
          <Pressable onPress={() => setType("farm")}>
            <Box
              px="3"
              py="1"
              rounded="full"
              bg={type === "farm" ? "brand.600" : "muted.200"}
              alignItems="center"
            >
              <Text color={type === "farm" ? "white" : "black"}>
                {t("farm")}
              </Text>
            </Box>
          </Pressable>
          <Pressable onPress={() => setType("rental")}>
            <Box
              px="3"
              py="1"
              rounded="full"
              bg={type === "rental" ? "brand.600" : "muted.200"}
              alignItems="center"
            >
              <Text color={type === "rental" ? "white" : "black"}>
                {t("rental")}
              </Text>
            </Box>
          </Pressable>
        </HStack>
        {isLoadingLikes ? (
          <Spinner color="muted.400" />
        ) : type === "farm" ? (
          <FlatList
            data={likes?.filter((item) => item.farmId)}
            renderItem={({ item }) => (
              <LikeItem
                item={item}
                onPress={() =>
                  item.farm &&
                  mapNavigationHandler(item.farm.latitude, item.farm.longitude)
                }
                type="farm"
                onPressRight={() => item.farmId && deleteFarmLike(item.farmId)}
              />
            )}
            ListEmptyComponent={
              <Text
                bold
                lineHeight="2xl"
                fontSize="md"
                textAlign="center"
                color="muted.600"
              >
                {t("notExistFarmLike")}
              </Text>
            }
            keyExtractor={(item) => item.likeId.toString()}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingLikes}
                onRefresh={refetchLikes}
              />
            }
          />
        ) : (
          <FlatList
            data={likes?.filter((item) => item.rentalId)}
            renderItem={({ item }) => (
              <LikeItem
                item={item}
                onPress={() =>
                  item.rental &&
                  mapNavigationHandler(
                    item.rental.latitude,
                    item.rental.longitude
                  )
                }
                type="rental"
                onPressRight={() =>
                  item.rentalId && deleteRentalLike(item.rentalId)
                }
              />
            )}
            ListEmptyComponent={
              <Text
                bold
                lineHeight="2xl"
                fontSize="md"
                textAlign="center"
                color="muted.600"
              >
                {t("notExistRentalLike")}
              </Text>
            }
            keyExtractor={(item) => item.likeId.toString()}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingLikes}
                onRefresh={refetchLikes}
              />
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default LikeListTemplate;