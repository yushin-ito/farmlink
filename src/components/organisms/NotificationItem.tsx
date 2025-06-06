import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  Center,
  VStack,
  Box,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";

import { GetNotificationsResponse } from "../../hooks/notification/query";
import Avatar from "../molecules/Avatar";

type NotificationItemProps = {
  type: "rental" | "farm" | "chat" | "unknown";
  item: GetNotificationsResponse[number];
  onPress: () => void;
  onPressRight: () => void;
};

const NotificationItem = memo(
  ({ type, item, onPress, onPressRight }: NotificationItemProps) => {
    const { t } = useTranslation("setting");

    const bgColor = useColorModeValue("white", "#171717");
    const pressedColor = useColorModeValue("#f5f5f5", "#262626");
    const imageColor = useColorModeValue("muted.200", "muted.600");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.500", "muted.300");

    return (
      <Swipeable
        renderRightActions={() => (
          <Pressable
            onPress={onPressRight}
            _pressed={{
              opacity: 0.5,
            }}
          >
            <Center h="100%" w="24" bg="red.500">
              <Text color="white" bold fontSize="md">
                {t("delete")}
              </Text>
            </Center>
          </Pressable>
        )}
      >
        <TouchableHighlight
          onPress={onPress}
          style={{ backgroundColor: bgColor }}
          underlayColor={pressedColor}
        >
          <VStack alignItems="center">
            <HStack
              w="100%"
              pl="3"
              pr="6"
              py="3"
              alignItems="center"
              justifyContent="space-between"
            >
              {type === "rental" && (
                <HStack alignItems="center" space="3">
                  <HStack space="2">
                    <Box
                      size="2.5"
                      rounded="full"
                      bg={item.clicked ? "transparent" : "blue.500"}
                    />
                    <Center
                      size="12"
                      rounded="full"
                      bg="muted.200"
                      overflow="hidden"
                    >
                      {item.rental.imageUrls?.length ? (
                        <Image
                          style={{ width: 48, height: 48 }}
                          source={{
                            uri: item.rental.imageUrls[0],
                          }}
                        />
                      ) : (
                        <Icon
                          as={<Feather />}
                          name="image"
                          size="lg"
                          color={iconColor}
                        />
                      )}
                    </Center>
                  </HStack>
                  <VStack w="75%" space="1">
                    <Text numberOfLines={2} ellipsizeMode="tail" fontSize="14">
                      {t("liked", {
                        what: item.rental.name,
                        who: item.from.name,
                      })}
                    </Text>
                    <Text color={textColor} fontSize="xs">
                      {t("time", { date: item.createdAt })}
                    </Text>
                  </VStack>
                </HStack>
              )}
              {type === "farm" && (
                <HStack alignItems="center" space="3">
                  <HStack space="2">
                    <Box
                      size="2.5"
                      rounded="full"
                      bg={item.clicked ? "transparent" : "blue.500"}
                    />
                    <Center
                      size="12"
                      rounded="full"
                      bg={imageColor}
                      overflow="hidden"
                    >
                      {item.farm.imageUrls?.length ? (
                        <Image
                          style={{ width: 48, height: 48 }}
                          source={{
                            uri:
                              item.farm.imageUrls[0] +
                              "?=" +
                              item.farm.updatedAt,
                          }}
                        />
                      ) : (
                        <Icon
                          as={<Feather />}
                          name="image"
                          size="lg"
                          color={iconColor}
                        />
                      )}
                    </Center>
                  </HStack>
                  <VStack w="75%" space="1">
                    <Text numberOfLines={2} ellipsizeMode="tail" fontSize="14">
                      {t("liked", {
                        what: item.farm.name,
                        who: item.from.name,
                      })}
                    </Text>
                    <Text color={textColor} fontSize="xs">
                      {t("time", { date: item.createdAt })}
                    </Text>
                  </VStack>
                </HStack>
              )}
              {type === "chat" && (
                <HStack alignItems="center" space="3">
                  <HStack space="2">
                    <Box
                      size="2.5"
                      rounded="full"
                      bg={item.clicked ? "transparent" : "blue.500"}
                    />
                    <Avatar
                      size="md"
                      fontSize="2xl"
                      disabled
                      text={item.from.name?.charAt(0)}
                      uri={item.from.avatarUrl}
                      color={item.from.color}
                      updatedAt={item.from.updatedAt}
                    />
                  </HStack>
                  <VStack w="75%" space="1">
                    <Text numberOfLines={2} ellipsizeMode="tail" fontSize="14">
                      {item.from.name + t("send")}
                    </Text>
                    <Text color={textColor} fontSize="xs">
                      {t("time", { date: item.createdAt })}
                    </Text>
                  </VStack>
                </HStack>
              )}
              <Icon
                as={<Feather />}
                name="chevron-right"
                size="md"
                color={iconColor}
              />
            </HStack>
            <Divider w="90%" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default NotificationItem;
