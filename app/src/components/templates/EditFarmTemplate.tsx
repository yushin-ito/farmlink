import React, { useEffect, useRef, useState } from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import {
  Button,
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  HStack,
  IconButton,
  Icon,
  Switch,
  Spinner,
  Center,
  useColorModeValue,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import MapView, { Marker } from "react-native-maps";
import { useTranslation } from "react-i18next";
import Input from "../molecules/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SearchDeviceResponse } from "../../hooks/device/mutate";
import { LocationGeocodedAddress } from "expo-location";
import { GetFarmResponse } from "../../hooks/farm/query";

type EditFarmTemplateProps = {
  farm: GetFarmResponse | null | undefined;
  searchResult: SearchDeviceResponse[0] | undefined;
  address: LocationGeocodedAddress | undefined;
  getAddress: (latitude: number, longitude: number) => Promise<void>;
  postFarm: (
    name: string,
    deviceId: string,
    description: string,
    privated: boolean
  ) => Promise<void>;
  searchDevice: (query: string) => Promise<void>;
  isLoadingFarm: boolean;
  isLoadingPostFarm: boolean;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  name: string;
  deviceId: string;
  description: string;
};

const EditFarmTemplate = ({
  farm,
  address,
  getAddress,
  searchResult,
  postFarm,
  searchDevice,
  isLoadingFarm,
  isLoadingPostFarm,
  goBackNavigationHandler,
}: EditFarmTemplateProps) => {
  const { t } = useTranslation("farm");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const [privated, setPrivated] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (farm) {
      farm.name && setValue("name", farm.name);
      farm.deviceId && setValue("deviceId", farm.deviceId);
      farm.deviceId && searchDevice(farm.deviceId);
      farm.description && setValue("description", farm.description);
      setPrivated(farm.privated);
    }
  }, [farm]);

  useEffect(() => {
    if (mapRef.current && farm?.latitude && farm.longitude) {
      mapRef.current.animateToRegion({
        latitude: farm.latitude,
        longitude: farm.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
      getAddress(farm.latitude, farm.longitude);
    }
  }, [mapRef.current, farm]);

  if (isLoadingFarm) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
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
        <Heading textAlign="center">{t("editFarm")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box flex={1} pb="16" justifyContent="space-between">
          <VStack px="10" space="6">
            <FormControl isRequired isInvalid={"name" in errors}>
              <FormControl.Label>{t("farmName")}</FormControl.Label>
              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        returnKeyType="done"
                        InputRightElement={
                          <IconButton
                            onPress={() => setValue("name", "")}
                            icon={
                              <Icon
                                as={<Feather name="x" />}
                                size="4"
                                color="muted.400"
                              />
                            }
                            variant="unstyled"
                            _pressed={{
                              opacity: 0.5,
                            }}
                          />
                        }
                        value={value}
                        onChangeText={onChange}
                      />
                      <HStack mt="1" justifyContent="space-between">
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon as={<Feather name="alert-circle" />} />
                          }
                        >
                          {errors.name && <Text>{errors.name.message}</Text>}
                        </FormControl.ErrorMessage>
                        <Text color={textColor}>{value?.length ?? 0} / 20</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  required: t("farmNameRequired"),
                  maxLength: {
                    value: 20,
                    message: t("farmNameMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl isRequired isInvalid={"deviceId" in errors}>
              <FormControl.Label>{t("deviceId")}</FormControl.Label>
              <Controller
                name="deviceId"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Input
                      returnKeyType="done"
                      InputRightElement={
                        <IconButton
                          onPress={() => setValue("deviceId", "")}
                          icon={
                            <Icon
                              as={<Feather name="x" />}
                              size="4"
                              color="muted.400"
                            />
                          }
                          variant="unstyled"
                          _pressed={{
                            opacity: 0.5,
                          }}
                        />
                      }
                      value={value}
                      onChangeText={async (text) => {
                        onChange(text);
                        await searchDevice(text);
                      }}
                    />
                  );
                }}
                rules={{
                  validate: () =>
                    searchResult ? undefined : t("invalidDeviceId"),
                }}
              />
              <FormControl.ErrorMessage
                leftIcon={<Icon as={<Feather name="alert-circle" />} />}
              >
                {errors.deviceId && <Text>{errors.deviceId.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
            <HStack mt="4" alignItems="center" justifyContent="space-between">
              <Text fontSize="md" bold color={textColor}>
                {t("doPublic")}
              </Text>
              <Switch
                defaultIsChecked={!farm?.privated}
                colorScheme="brand"
                onValueChange={async (value) => {
                  setPrivated(!value);
                }}
              />
            </HStack>
            {!privated && (
              <VStack mt="6" space="6">
                <FormControl isRequired isInvalid={"description" in errors}>
                  <FormControl.Label>{t("description")}</FormControl.Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <VStack>
                          <Input
                            h="48"
                            multiline
                            value={value}
                            onChangeText={onChange}
                          />
                          <HStack mt="1" justifyContent="space-between">
                            <FormControl.ErrorMessage
                              leftIcon={
                                <Icon as={<Feather name="alert-circle" />} />
                              }
                            >
                              {errors.description && (
                                <Text>{errors.description.message}</Text>
                              )}
                            </FormControl.ErrorMessage>
                            <Text color={textColor}>
                              {value?.length ?? 0} / 100
                            </Text>
                          </HStack>
                        </VStack>
                      );
                    }}
                    rules={{
                      required: !privated
                        ? t("descriptionRequired")
                        : undefined,
                      maxLength: {
                        value: 100,
                        message: t("descriptionMaxLength"),
                      },
                    }}
                  />
                </FormControl>
                <VStack space="1">
                  <Text bold color={textColor} fontSize="md">
                    {t("location")}
                  </Text>
                  <MapView
                    ref={mapRef}
                    userInterfaceStyle={useColorModeValue("light", "dark")}
                    showsCompass={false}
                    style={{
                      width: "100%",
                      height: 160,
                      borderRadius: 12,
                    }}
                  >
                    {farm?.latitude && farm?.longitude && (
                      <Marker
                        coordinate={{
                          latitude: farm.latitude,
                          longitude: farm.longitude,
                        }}
                      >
                        <VStack alignItems="center">
                          <Text bold fontSize="2xs">
                            {farm.name}
                          </Text>
                          <Icon
                            as={<MaterialIcons />}
                            name="location-pin"
                            size="xl"
                            color="brand.600"
                          />
                        </VStack>
                      </Marker>
                    )}
                  </MapView>
                  {address && (
                    <Text color={textColor}>{`${t("address")}: ${address.city}${
                      address.name
                    }`}</Text>
                  )}
                </VStack>
              </VStack>
            )}
          </VStack>
          <Button
            mt="16"
            mx="10"
            size="lg"
            rounded="xl"
            colorScheme="brand"
            isLoading={isLoadingPostFarm}
            onPress={handleSubmit(async (data) => {
              await postFarm(
                data.name,
                data.deviceId,
                data.description,
                privated
              );
            })}
          >
            <Text bold fontSize="md" color="white">
              {t("save")}
            </Text>
          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default EditFarmTemplate;
