"use client";

import { useQuery } from "@apollo/client/react";
import { GET_USER_CVS_QUERY } from "@/features/cvs/graphql";
import { GetUserCvsResponse, Cv } from "@/features/cvs/types";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";

export default function CvsPage() {
  const { user, profileUserId } = useIsOwnProfile();

  const userId = profileUserId ?? user?.id;

  const { data, loading, error } = useQuery<GetUserCvsResponse>(
    GET_USER_CVS_QUERY,
    {
      variables: { userId },
      skip: !userId, // чтобы не делать запрос пока user не загрузился
    }
  );

  if (!userId) return <p>Loading user...</p>;
  if (loading) return <p>Loading CVs...</p>;
  if (error) return <p>Error loading CVs</p>;

  const cvs = data?.user.cvs || [];

  return (
    // пока так оставлю, потом либо переделаю в отдельный кмопнент.
    // Сейчас сделала здесь, чтобы проверить саму страницу
    <div style={{ padding: "30px" }}>
      <h1>My CVs</h1>

      {cvs.map((cv: Cv) => (
        <div
          key={cv.id}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>Name:</strong> {cv.name}
            </div>

            <div>
              <strong>Education:</strong> {cv.education || "—"}
            </div>

            <div>
              <strong>ID:</strong> {cv.id}
            </div>
          </div>

          <div>
            <strong>Description:</strong>
            <p>{cv.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}