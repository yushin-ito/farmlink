import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Database } from "./schema";

export type Locale = "en" | "ja";

export type Scene = "near" | "newest" | "popular";

export type Order = "asc" | "desc";

export type Weather = "sunny" | "cloudy" | "rainy" | "snowy";

export type Rate = "all" | "year" | "month" | "week" | "day" | "once";

export type Equipment = "water" | "parking" | "hut" | "tool";

export type Payment = "destination" | "subscription";

export type Crop =
  | "tomato"
  | "cucumber"
  | "pumpkin"
  | "corn"
  | "potato"
  | "carrot"
  | "onion";

export type Category =
  | "all"
  | "joining"
  | "none"
  | "veggie"
  | "fruit"
  | "compost"
  | "ill";

export type Region = {
  regionId: number;
  latitude: number;
  longitude: number;
};

export type UseQueryResult<T1, T2> = {
  onSuccess?: (response: T1) => void;
  onError?: (error: T2) => void;
};

export type UseMutationResult<T1, T2> = {
  onSuccess?: (response: T1) => void;
  onError?: (error: T2) => void;
};

export type User = Database["public"]["Tables"]["user"];
export type Chat = Database["public"]["Tables"]["chat"];
export type Community = Database["public"]["Tables"]["community"];
export type Farm = Database["public"]["Tables"]["farm"];
export type Talk = Database["public"]["Tables"]["talk"];
export type Rental = Database["public"]["Tables"]["rental"];
export type Like = Database["public"]["Tables"]["like"];
export type Record = Database["public"]["Tables"]["record"];
export type Notification = Database["public"]["Tables"]["notification"];

export type RootStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList> | undefined;
  TabNavigator: NavigatorScreenParams<TabParamList> | undefined;
  Walkthrough: undefined;
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
  ImagePreview: {
    title: string;
    imageUrl: string;
    chatId?: number;
    talkId?: number;
  };
  FarmDetail: { farmId: number };
  RentalDetail: { rentalId: number };
  EditFarm: { farmId: number };
  EditRental: { rentalId: number };
  EditRecord: { recordId: number };
};

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  MapNavigator: NavigatorScreenParams<MapStackParamList>;
  CommunityNavigator: NavigatorScreenParams<CommunityStackParamList>;
  FarmNavigator: NavigatorScreenParams<FarmStackParamList>;
  TalkNavigator: NavigatorScreenParams<TalkStackParamList>;
  SettingNavigator: NavigatorScreenParams<SettingStackParamList>;
};

export type MapStackParamList = {
  Map: {
    regionId: number;
    latitude: number;
    longitude: number;
    type: "rental" | "farm";
  };
  SearchMap: { type: "rental" | "farm" };
  RentalGrid?: {
    option?: {
      fee?: { min: string; max: string };
      area?: { min: string; max: string };
      rate?: Rate;
      equipment?: Equipment[];
      prefecture?: string;
      city?: string;
    };
  };
  FilterRental: undefined;
  PostRental: undefined;
};

export type CommunityStackParamList = {
  CommunityList: undefined;
  CommunityChat: { communityId: number };
  PostCommunity: undefined;
  SearchCommunity: undefined;
};

export type FarmStackParamList = {
  Record: undefined;
  RecordList: { farmId: number };
  PostFarm: undefined;
  PostRecord: { farmId: number };
};

export type TalkStackParamList = {
  TalkList: undefined;
  TalkChat: { talkId: number };
  PostTalk: undefined;
  SearchTalk: undefined;
};

export type SettingStackParamList = {
  Setting: undefined;
  RentalList: undefined;
  PostRental: undefined;
  EditProfile: undefined;
  LikeList: undefined;
  Payment: undefined;
  Notification: undefined;
  Environment: undefined;
  TermsList: undefined;
};

export type RootStackScreenProps = NativeStackScreenProps<RootStackParamList>;

export type AuthStackScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MapStackScreenProps<Screen extends keyof MapStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MapStackParamList, Screen>,
    CompositeScreenProps<
      BottomTabScreenProps<TabParamList>,
      NativeStackScreenProps<RootStackParamList>
    >
  >;

export type CommunityStackScreenProps<
  Screen extends keyof CommunityStackParamList
> = CompositeScreenProps<
  BottomTabScreenProps<CommunityStackParamList, Screen>,
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export type FarmStackScreenProps<Screen extends keyof FarmStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<FarmStackParamList, Screen>,
    CompositeScreenProps<
      BottomTabScreenProps<TabParamList>,
      NativeStackScreenProps<RootStackParamList>
    >
  >;

export type TalkStackScreenProps<Screen extends keyof TalkStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TalkStackParamList, Screen>,
    CompositeScreenProps<
      BottomTabScreenProps<TabParamList>,
      NativeStackScreenProps<RootStackParamList>
    >
  >;

export type SettingStackScreenProps<
  Screen extends keyof SettingStackParamList
> = CompositeScreenProps<
  BottomTabScreenProps<SettingStackParamList, Screen>,
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;
