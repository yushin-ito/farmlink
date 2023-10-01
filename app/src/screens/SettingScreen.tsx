import React, { useCallback } from "react";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useSignOut } from "../hooks/auth/mutate";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import SettingTemplate from "../components/templates/SettingTemplate";
import useImage from "../hooks/sdk/useImage";
import { usePostAvatar, usePostUser } from "../hooks/user/mutate";
import { SettingStackScreenProps } from "../types";
import { supabase } from "../supabase";

const SettingScreen = ({ navigation }: SettingStackScreenProps<"Setting">) => {
  const toast = useToast();
  const { t } = useTranslation("setting");
  const { session } = useAuth();
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch,
  } = useQueryUser(session?.user.id);

  const { mutateAsync: mutateAsyncSignOut, isLoading: isLoadingSignOut } =
    useSignOut({
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("signoutError")}
          />
        );
      },
    });

  const { mutateAsync: mutateAsyncPostUser, isLoading: isLoadingPostUser } =
    usePostUser({
      onSuccess: async () => {
        await refetch();
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

  const { mutateAsync: mutateAsyncPostAvatar, isLoading: isLoadingPostAvatar } =
    usePostAvatar({
      onSuccess: async ({ path }) => {
        const { data } = supabase.storage.from("image").getPublicUrl(path);
        session?.user &&
          mutateAsyncPostUser({
            userId: session.user.id,
            avatarUrl: data.publicUrl,
          });
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

  const { pickImageByCamera, pickImageByLibrary } = useImage({
    onSuccess: async ({ base64 }) => {
      if (session?.user && base64) {
        await mutateAsyncPostAvatar(base64);
      }
    },
    onDisable: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("permitRequestCam")}
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

  const deleteAvatar = useCallback(async () => {
    session?.user &&
      (await mutateAsyncPostUser({ userId: session.user.id, avatarUrl: null }));
  }, [session?.user]);

  const signOut = useCallback(async () => {
    await mutateAsyncSignOut();
  }, []);

  const postProfileNavigationHandler = useCallback(() => {
    navigation.navigate("PostProfile");
  }, []);

  const postRentalNavigationHandler = useCallback(() => {
    navigation.navigate("PostRental");
  }, []);

  const rentalListNavigationHandler = useCallback(() => {
    navigation.navigate("RentalList");
  }, []);

  const likeListNavigationHandler = useCallback(() => {
    navigation.navigate("LikeList");
  }, []);

  return (
    <SettingTemplate
      user={user}
      isLoadingAvatar={
        isLoadingUser || isLoadingPostUser || isLoadingPostAvatar
      }
      isLoadingSignOut={isLoadingSignOut}
      signOut={signOut}
      pickImageByCamera={pickImageByCamera}
      pickImageByLibrary={pickImageByLibrary}
      deleteAvatar={deleteAvatar}
      postRentalNavigationHandler={postRentalNavigationHandler}
      postProfileNavigationHandler={postProfileNavigationHandler}
      rentalListNavigationHandler={rentalListNavigationHandler}
      likeListNavigationHandler={likeListNavigationHandler}
    />
  );
};

export default SettingScreen;
