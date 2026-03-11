import { useQuery } from "@apollo/client/react";
import { GET_USER_BY_ID_QUERY } from "./graphql";
import { GetUserByIdResponse } from "./types";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useProfileUser() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const { user, profileUserId, isOwnProfile } = useIsOwnProfile();

  const { data, loading } = useQuery<GetUserByIdResponse>(
    GET_USER_BY_ID_QUERY,
    {
      variables: { userId: profileUserId },
      skip: isOwnProfile || !profileUserId || !user,
    }
  );

  const profileUser = isOwnProfile ? user : data?.user;

  return {
    isClient,
    profileUser,
    isOwnProfile,
    loading,
  };
}