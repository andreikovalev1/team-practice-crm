import { gql } from "@apollo/client/core";

export const GET_GLOBAL_DEPARTMENT_QUERY = gql`
  query GetGlobaldepartments {
  departments {
    id
    name
  }
}
`;

// export const UPDATE_DEPARTMENT_MUTATION = gql`
//   mutation UpdatePosition ($position: UpdatePositionInput!) {
//     updatePosition (position: $position) {
//         id
//         name
//     }
//   }
// `;

// export const DELETE_DEPARTMENT_MUTATION = gql`
//   mutation DeletePosition ($position: DeletePositionInput!) {
//     deletePosition (position: $position) {
//         affected
//     }
//   }
// `;

// export const CREATE_DEPARTMENT_MUTATION = gql`
//   mutation CreatePosition($position: CreatePositionInput!) {
//     createPosition (position: $position) {
//       id
//       name
//     }
//   }
// `;