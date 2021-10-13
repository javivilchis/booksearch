import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: BookInput){
    saveBook(bookData: $bookData){
      _id
      username
      email
      bookCount
      saveBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
mutation removeBook($bookId: ID!){
  removeBook(bookId: $bookId){
    _id
    username
    saveBooks {
      bookId
      title
      authors
      description
      image
      link
    }
  }
}
`;