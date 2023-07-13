import React, { useCallback, useState } from "react";
import LikeListTemplate from "../components/templates/LikeListTemplate";
import { SettingStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUserLikes } from "../hooks/like/query";
import { showAlert, wait } from "../functions";
import { useDeleteFarmLike, useDeleteRentalLike } from "../hooks/like/mutate";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";

const LikeListScreen = ({
  navigation,
}: SettingStackScreenProps<"LikeList">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const { session } = useAuth();
  const {
    data: likes,
    refetch,
    isLoading: isLoadingLikes,
  } = useQueryUserLikes(session?.user.id);
  const [isRefetchingLikes, setIsRefetchingRentals] = useState(false);

  const { mutateAsync: mutateAsyncDeleteFarmLike } = useDeleteFarmLike({
    onSuccess: async () => {
      await refetch();
    },
    onError: () => {
      navigation.goBack();
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

  const { mutateAsync: mutateAsyncDeleteRentalLike } = useDeleteRentalLike({
    onSuccess: async () => {
      await refetch();
    },
    onError: () => {
      navigation.goBack();
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

  const deleteFarmLike = useCallback(async (farmId: number) => {
    await mutateAsyncDeleteFarmLike(farmId);
  }, []);

  const deleteRentalLike = useCallback(async (rentalId: number) => {
    await mutateAsyncDeleteRentalLike(rentalId);
  }, []);

  const refetchLikes = useCallback(async () => {
    setIsRefetchingRentals(true);
    await refetch();
    setIsRefetchingRentals(false);
  }, []);

  const mapNavigationHandler = useCallback(
    async (latitude: number | null, longitude: number | null) => {
      navigation.goBack();
      await wait(0.1); // 800ms
      navigation.navigate("TabNavigator", {
        screen: "MapNavigator",
        params: {
          screen: "Map",
          params: { latitude, longitude },
        },
      });
    },
    []
  );
  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <LikeListTemplate
      likes={likes}
      deleteFarmLike={deleteFarmLike}
      deleteRentalLike={deleteRentalLike}
      refetchLikes={refetchLikes}
      isLoadingLikes={isLoadingLikes}
      isRefetchingLikes={isRefetchingLikes}
      mapNavigationHandler={mapNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default LikeListScreen;
