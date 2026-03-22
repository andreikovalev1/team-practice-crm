import { gql } from "@apollo/client/core";

export const GET_GLOBAL_POSITION_QUERY = gql`
  query GetGlobalPositions {
  positions {
    id
    name
  }
}
`;

export const UPDATE_POSITION_MUTATION = gql`
  mutation UpdatePosition ($position: UpdatePositionInput!) {
    updatePosition (position: $position) {
        id
        name
    }
  }
`;

export const DELETE_POSITION_MUTATION = gql`
  mutation DeletePosition ($position: DeletePositionInput!) {
    deletePosition (position: $position) {
        affected
    }
  }
`;

export const CREATE_POSITION_MUTATION = gql`
  mutation CreatePosition($position: CreatePositionInput!) {
    createPosition (position: $position) {
      id
      name
    }
  }
`;