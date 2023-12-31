import React, { memo, useRef } from "react";

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Box,
  Center,
  Divider,
  HStack,
  Pressable,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";

import { GetUserFarmsResponse } from "../../hooks/farm/query";

type FarmListItemProps = {
  item: GetUserFarmsResponse[number];
  onPress: () => void;
  onPressLeft: () => void;
  onPressRight: () => void;
};

const FarmListItem = memo(
  ({ item, onPress, onPressRight, onPressLeft }: FarmListItemProps) => {
    const { t } = useTranslation("farm");
    
    const bgColor = useColorModeValue("white", "#171717");
    const pressedColor = useColorModeValue("#f5f5f5", "#262626");
    const imageColor = useColorModeValue("muted.200", "muted.600");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.600", "muted.100");

    const swipeableRef = useRef<Swipeable>(null);

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => (
          <HStack>
            <Pressable
              onPress={() => {
                onPressLeft();
                swipeableRef.current?.close();
              }}
              _pressed={{
                opacity: 0.5,
              }}
            >
              <Center h="100%" w="24" bg="blue.500">
                <Text color="white" bold fontSize="md">
                  {item.privated ? t("public") : t("private")}
                </Text>
              </Center>
            </Pressable>
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
          </HStack>
        )}
      >
        <TouchableHighlight
          onPress={onPress}
          style={{ backgroundColor: bgColor }}
          underlayColor={pressedColor}
        >
          <VStack>
            <HStack h="20" px="9" py="3">
              <Box w="20%">
                <Center
                  size="12"
                  rounded="md"
                  bg={imageColor}
                  overflow="hidden"
                >
                  {item.device?.imageUrl ? (
                    <Image
                      style={{ width: 48, height: 48 }}
                      source={{
                        uri:
                          item.device.imageUrl + "?=" + item.device.updatedAt,
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
              </Box>
              <HStack w="80%" pr="4" space="2">
                <VStack w="40%" space="1">
                  <Text bold fontSize="md">
                    {item.name}
                  </Text>
                  <Text
                    color={textColor}
                    fontSize="xs"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                </VStack>
                <HStack mt="1" space="6" justifyContent="center">
                  <VStack>
                    <Text color="muted.400" bold fontSize="xs">
                      {t("temperture")}
                    </Text>
                    <Text color={textColor} bold fontSize="sm">
                      {item?.device?.temperture
                        ? Math.floor(item.device.temperture) + "℃"
                        : t("unknown")}
                    </Text>
                  </VStack>
                  <VStack>
                    <Text color="muted.400" bold fontSize="xs">
                      {t("humidity")}
                    </Text>
                    <Text color={textColor} bold fontSize="sm">
                      {item?.device?.humidity
                        ? Math.floor(item.device.humidity) + "%"
                        : t("unknown")}
                    </Text>
                  </VStack>
                  <VStack>
                    <Text color="muted.400" bold fontSize="xs">
                      {t("moisture")}
                    </Text>
                    <Text color={textColor} bold fontSize="sm">
                      {item?.device?.moisture
                        ? item.device.moisture
                        : t("unknown")}
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
            </HStack>
            <Divider w="80%" alignSelf="center" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default FarmListItem;
