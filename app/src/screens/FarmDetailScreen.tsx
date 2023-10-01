import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import FarmDetailTemplate from "../components/templates/FarmDetailTemplate";
import { FarmStackParamList, FarmStackScreenProps } from "../types";
import { useCallback } from "react";
import { useQueryFarm } from "../hooks/farm/query";
import { useQueryFarmLikes } from "../hooks/like/query";
import { showAlert, wait } from "../functions";
import { usePostFarmLike, useDeleteFarmLike } from "../hooks/like/mutate";
import useLocation from "../hooks/sdk/useLocation";
import { usePostTalk } from "../hooks/talk/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useQueryTalks } from "../hooks/talk/query";

const FarmDetailScreen = ({
  navigation,
}: FarmStackScreenProps<"FarmDetail">) => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const { params } = useRoute<RouteProp<FarmStackParamList, "FarmDetail">>();
  const {
    data: farm,
    refetch: refetchFarm,
    isLoading: isLoadingFarm,
  } = useQueryFarm(params.farmId);
  const { session } = useAuth();
  const { data: talks, refetch: refetchTalks } = useQueryTalks(
    session?.user.id
  );
  const {
    data: likes,
    refetch: refetchLikes,
    isLoading: isLoadingLikes,
  } = useQueryFarmLikes(params.farmId);
  const [isRefetchingFarm, setIsRefetchingFarm] = useState(false);
  const liked =
    likes?.some(
      (item) =>
        item.userId === session?.user.id && item.farmId === params.farmId
    ) ?? false;

  useEffect(() => {
    if (farm) {
      farm.latitude &&
        farm.longitude &&
        getAddress(farm.latitude, farm.longitude);
    }
  }, [farm]);

  const refetch = useCallback(async () => {
    setIsRefetchingFarm(true);
    await refetchFarm();
    await refetchLikes();
    setIsRefetchingFarm(false);
  }, []);

  const { mutateAsync: mutateAsyncPostLike, isLoading: isLoadingPostLike } =
    usePostFarmLike({
      onSuccess: async () => {
        await refetchLikes();
      },
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("error")}
          />
        );
      },
    });

  const { mutateAsync: mutateAsyncDeleteLike, isLoading: isLoadingDeleteLike } =
    useDeleteFarmLike({
      onSuccess: async () => {
        await refetchLikes();
      },
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("error")}
          />
        );
      },
    });

  const { address, getAddress, isLoadingAddress } = useLocation({
    onDisable: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("permitRequestGPS")}
        />
      );
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  const { mutateAsync: mutateAsyncPostTalk, isLoading: isLoadingPostTalk } =
    usePostTalk({
      onSuccess: async () => {
        const { data } = await refetchTalks();
        const talk = data?.find((item) => item.to.userId === farm?.ownerId);
        if (talk) {
          navigation.navigate("TabNavigator", {
            screen: "TalkNavigator",
            params: {
              screen: "TalkList",
            },
          });
          await wait(0.1);
          navigation.navigate("TabNavigator", {
            screen: "TalkNavigator",
            params: {
              screen: "TalkChat",
              params: {
                talkId: talk.talkId,
                token: talk.to.token,
                name: talk.to.name,
              },
            },
          });
        }
      },
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("error")}
          />
        );
      },
    });

  const talkChatNavigationHandler = useCallback(async () => {
    const talk = talks?.find((item) => item.to.userId === farm?.ownerId);
    if (talk) {
      navigation.navigate("TabNavigator", {
        screen: "TalkNavigator",
        params: {
          screen: "TalkList",
        },
      });
      await wait(0.1);
      navigation.navigate("TabNavigator", {
        screen: "TalkNavigator",
        params: {
          screen: "TalkChat",
          params: {
            talkId: talk.talkId,
            token: talk.to.token,
            name: talk.to.name,
          },
        },
      });
    } else if (session && farm) {
      await mutateAsyncPostTalk({
        senderId: session.user.id,
        recieverId: farm.ownerId,
      });
    } else {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    }
  }, [talks, session, farm]);

  const postLike = useCallback(async () => {
    if (session) {
      await mutateAsyncPostLike({
        userId: session.user.id,
        farmId: params.farmId,
      });
    }
  }, [session]);

  const deleteLike = useCallback(async () => {
    await mutateAsyncDeleteLike(params.farmId);
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <FarmDetailTemplate
      owned={session?.user.id === farm?.ownerId}
      liked={liked}
      likes={likes}
      farm={farm}
      address={address}
      postLike={postLike}
      deleteLike={deleteLike}
      refetch={refetch}
      isLoading={isLoadingFarm || isLoadingLikes || isLoadingAddress}
      isLoadingPostTalk={isLoadingPostTalk}
      isLoadingPostLike={isLoadingPostLike}
      isLoadingDeleteLike={isLoadingDeleteLike}
      isRefetching={isRefetchingFarm}
      goBackNavigationHandler={goBackNavigationHandler}
      talkChatNavigationHandler={talkChatNavigationHandler}
    />
  );
};

export default FarmDetailScreen;
