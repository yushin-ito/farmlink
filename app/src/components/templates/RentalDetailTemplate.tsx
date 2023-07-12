import React, { useEffect, useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";

import {
  Box,
  HStack,
  IconButton,
  Icon,
  FlatList,
  VStack,
  Heading,
  ScrollView,
  Button,
  Text,
} from "native-base";
import { Image } from "expo-image";
import { GetRentalResponse } from "../../hooks/rental/query";
import { Alert, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { LocationGeocodedAddress } from "expo-location";
import { GetRentalLikeResponse } from "../../hooks/like/query";

type RentalDetailTemplateProps = {
  owned: boolean;
  isLike: boolean;
  likes: GetRentalLikeResponse | undefined;
  rental: GetRentalResponse | undefined;
  address: LocationGeocodedAddress | undefined;
  isLoadingPostTalk: boolean;
  isLoadingLike: boolean;
  postLike: () => Promise<void>;
  deleteLike: () => Promise<void>;
  talkChatNavigationHandler: () => void;
  goBackNavigationHandler: () => void;
};

const RentalDetailTemplate = ({
  isLike,
  likes,
  owned,
  rental,
  address,
  isLoadingPostTalk,
  isLoadingLike,
  postLike,
  deleteLike,
  talkChatNavigationHandler,
  goBackNavigationHandler,
}: RentalDetailTemplateProps) => {
  const { t } = useTranslation("map");
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(isLike);

  useEffect(() => {
    liked ? postLike() : deleteLike();
  }, [liked]);

  return (
    <Box flex={1} safeAreaTop>
      <HStack
        mb="2"
        pl="1"
        pr="3"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather />} name="chevron-left" size="2xl" />}
          variant="unstyled"
        />
        <IconButton
          onPress={() => Alert.alert(t("dev"))}
          icon={<Icon as={<Feather />} name="share" size="lg" />}
          variant="unstyled"
        />
      </HStack>
      <ScrollView>
        <VStack space="2">
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled
            data={rental?.imageUrls}
            renderItem={({ item }) => (
              <Box w={width} h="240" bg="muted.100">
                <Image
                  source={{ uri: item }}
                  style={{ flex: 1 }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />
              </Box>
            )}
            onMomentumScrollEnd={(event) => {
              const currentIndex = Math.floor(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width
              );
              setCurrentIndex(currentIndex);
            }}
          />
          <HStack w="100%" alignItems="center" justifyContent="center">
            {rental?.imageUrls?.map((_item, index) => (
              <Box
                key={index}
                mr="1"
                rounded="full"
                size={Number(index) === currentIndex ? "1.5" : "1"}
                bg={Number(index) === currentIndex ? "info.500" : "muted.400"}
              />
            ))}
          </HStack>
        </VStack>
        <VStack mt="2" px="6">
          <HStack alignItems="center" justifyContent="space-between">
            <VStack>
              <Heading numberOfLines={2} ellipsizeMode="tail">
                {rental?.name}
              </Heading>
              <Text>
                {address && (
                  <Text color="muted.600">{`${address.city} ${address.name}`}</Text>
                )}
              </Text>
            </VStack>
            <VStack alignItems="center" mr="3">
              <Icon as={<AntDesign />} name="hearto" size="md" color="black" />
              <Text>{likes?.length ?? 0}</Text>
            </VStack>
          </HStack>

          <HStack mt="6" alignItems="center" justifyContent="space-between">
            <VStack w="24">
              <Text color="muted.600">{t("area")}</Text>
              <Text bold fontSize="md">
                {rental?.area ? rental.area : t("unknown")}
              </Text>
            </VStack>
            <VStack w="24">
              <Text color="muted.600">{t("equipment")}</Text>
              <Text bold fontSize="md">
                {rental?.equipment ? rental.equipment : t("unknown")}
              </Text>
            </VStack>
            <VStack w="24">
              <Text color="muted.600">{t("fee")}</Text>
              <Text bold fontSize="md">
                {rental?.fee ? rental.fee : t("unknown")}
              </Text>
            </VStack>
          </HStack>
          <VStack mt="8">
            <Text color="muted.600">{t("description")}</Text>
            <Text bold fontSize="md">
              {rental?.description}
            </Text>
          </VStack>
        </VStack>
      </ScrollView>
      <HStack
        w="100%"
        pt="2"
        pb="8"
        px="6"
        space="2"
        shadow="2"
        borderTopRadius="3xl"
        bg="white"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          icon={
            <Icon
              as={<AntDesign />}
              name="heart"
              size="md"
              color={liked ? "red.300" : "muted.300"}
            />
          }
          variant="unstyled"
          borderWidth="1"
          rounded="lg"
          p="2"
          borderColor="muted.300"
          onPress={() => setLiked(!liked)}
          isDisabled={isLoadingLike}
        />
        <Button
          px="9"
          colorScheme="brand"
          rounded="lg"
          isLoading={isLoadingPostTalk}
          onPress={() =>
            owned ? Alert.alert(t("dev")) : talkChatNavigationHandler()
          }
        >
          <Text bold fontSize="md" color="white">
            {owned ? t("edit") : t("chat")}
          </Text>
        </Button>
      </HStack>
    </Box>
  );
};

export default RentalDetailTemplate;
