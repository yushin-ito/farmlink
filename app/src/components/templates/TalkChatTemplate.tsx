import {
  Box,
  Center,
  FlatList,
  HStack,
  Heading,
  Icon,
  IconButton,
  KeyboardAvoidingView,
  Menu,
  Spinner,
  Text,
  useColorModeValue,
  useDisclose,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform } from "react-native";
import ChatItem from "../organisms/ChatItem";
import ChatBar from "../organisms/ChatBar";
import { GetUserResponse } from "../../hooks/user/query";
import ChatActionSheet from "../organisms/ChatActionSheet";
import { useTranslation } from "react-i18next";
import { GetTalkChatsResponse } from "../../hooks/chat/query";
import { Locale } from "../../types";

type ChatTemplateProps = {
  locale: Locale | null;
  title: string | null | undefined;
  user: GetUserResponse | null | undefined;
  chats: GetTalkChatsResponse | undefined;
  isLoading: boolean;
  isLoadingPostChat: boolean;
  hasMore: boolean | undefined;
  onSend: (message: string) => Promise<void>;
  deleteRoom: () => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;
  pickChatImageByCamera: () => Promise<void>;
  pickChatImageByLibrary: () => Promise<void>;
  readMore: () => void;
  imagePreviewNavigationHandler: (imageUrl: string, chatId?: number) => void;
  goBackNavigationHandler: () => void;
};

const ChatTemplate = ({
  locale,
  title,
  user,
  chats,
  isLoading,
  isLoadingPostChat,
  hasMore,
  onSend,
  deleteRoom,
  deleteChat,
  pickChatImageByCamera,
  pickChatImageByLibrary,
  readMore,
  imagePreviewNavigationHandler,
  goBackNavigationHandler,
}: ChatTemplateProps) => {
  const { t } = useTranslation(["chat", "talk"]);
  const bgColor = useColorModeValue("muted.100", "muted.800");
  const menuColor = useColorModeValue("white", "muted.700");
  const pressedColor = useColorModeValue("muted.100", "muted.900");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const {
    isOpen: isChatActionSheetOpen,
    onOpen: onChatActionSheetOpen,
    onClose: onChatActionSheetClose,
  } = useDisclose();
  const [chatId, setChatId] = useState<number | null>(null);

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box flex={1} safeAreaTop>
        <ChatActionSheet
          isOpen={isChatActionSheetOpen}
          onClose={onChatActionSheetClose}
          deleteChat={async () =>
            Alert.alert(t("chat:deleteChat"), t("chat:askDeleteChat"), [
              {
                text: t("cancel"),
                style: "cancel",
              },
              {
                text: t("chat:delete"),
                onPress: () => chatId && deleteChat(chatId),
                style: "destructive",
              },
            ])
          }
        />
        <HStack
          pt="1"
          pb="2"
          px="2"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center">
            <IconButton
              onPress={goBackNavigationHandler}
              icon={
                <Icon
                  as={<Feather name="chevron-left" />}
                  size="2xl"
                  color={iconColor}
                />
              }
              variant="unstyled"
            />
            <Heading fontSize="xl">{title}</Heading>
          </HStack>
          <Menu
            mr="6"
            shadow="3"
            rounded="lg"
            bg={menuColor}
            trigger={(props) => (
              <IconButton
                icon={
                  <Icon
                    as={<Feather />}
                    name="align-justify"
                    size="md"
                    mr="3"
                    color={iconColor}
                  />
                }
                variant="unstyled"
                _pressed={{
                  opacity: 0.5,
                }}
                {...props}
              />
            )}
          >
            <Menu.Item
              pl="1"
              onPress={() =>
                Alert.alert(t("talk:deleteTalk"), t("talk:askDeleteTalk"), [
                  {
                    text: t("talk:cancel"),
                    style: "cancel",
                  },
                  {
                    text: t("talk:delete"),
                    onPress: async () => await deleteRoom(),
                    style: "destructive",
                  },
                ])
              }
              _pressed={{ bg: pressedColor }}
            >
              <Text fontSize="md">{t("talk:deleteTalk")}</Text>
            </Menu.Item>
          </Menu>
        </HStack>
        {isLoading ? (
          <Center flex={1} bg={bgColor}>
            <Spinner color="muted.400" />
          </Center>
        ) : (
          <FlatList
            px="5"
            bg={bgColor}
            inverted
            data={chats}
            onEndReached={readMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              <Center>{hasMore && <Spinner color="muted.400" />}</Center>
            }
            renderItem={({ item }) => (
              <ChatItem
                item={item}
                authored={item.authorId === user?.userId}
                locale={locale}
                onLongPress={() => {
                  onChatActionSheetOpen();
                  setChatId(item.chatId);
                }}
                imagePreviewNavigationHandler={imagePreviewNavigationHandler}
              />
            )}
            keyExtractor={(item) => item.chatId.toString()}
          />
        )}
        <ChatBar
          onSend={onSend}
          isLoading={isLoadingPostChat}
          pickImageByCamera={pickChatImageByCamera}
          pickImageByLibrary={pickChatImageByLibrary}
        />
      </Box>
    </KeyboardAvoidingView>
  );
};

export default ChatTemplate;
