# Book Club Web App

## Project Overview

**Book Club** is a comprehensive web application designed to help users track their reading progress and share updates with other members of the community. The application offers a variety of features that facilitate user registration, login, book tracking, and progress management.

## Features and Pages

### User Registration and Login

- **/register**: Allows new users to sign up for an account. The registration form includes validation to ensure usernames are at least 5 characters long and passwords are at least 10 characters long.
- **/login**: Enables existing users to log in. Upon successful login, a token is generated and stored in LocalStorage for session management.

### Home Page

- **/**: The homepage displays a list of all available books in the system. Users can sort books alphabetically or by popularity (based on the number of users currently reading each book). Each book entry includes its title and the number of readers.

### Book Detail Page

- **/book/[bookId]**: This page provides detailed information about a specific book, including its title, cover image, author, page count, the number of users reading it, and the average reading progress. Logged-in users can start tracking their progress on this page.

### User Progress Page

- **/progress**: This page is accessible only to logged-in users and shows an overview of all books they are currently reading. It displays the number of pages read out of the total page count for each book. Users can also update their reading progress through forms provided on this page.

## Database Schema

### User

Represents a user of the application.

| Field    | Type   | Notes       |
| -------- | ------ | ----------- |
| id       | Int    | Primary key |
| username | String | Unique      |
| password | String |             |

### Book

Represents a book available for tracking.

| Field       | Type   | Notes       |
| ----------- | ------ | ----------- |
| id          | Int    | Primary key |
| title       | String | Unique      |
| coverImgUrl | String |             |
| author      | String |             |
| pageCount   | Int    |             |

### BookProgress

Tracks the progress a user has made on a specific book.

| Field        | Type | Notes            |
| ------------ | ---- | ---------------- |
| id           | Int  | Primary key      |
| bookId       | Int  | Relation to Book |
| userId       | Int  | Relation to User |
| pageProgress | Int  |                  |

## Development Features

### Database

- **Models**: Created models for User, Book, and BookProgress using Prisma, establishing proper relationships.
- **Seed Data**: Implemented a seed file (`seed.ts`) to populate the database with initial data, including 5 users, 10 books, and 5 bookProgress entries.

### Server Setup

- **Authentication Endpoints**: Developed endpoints for user registration (`POST /register`) and login (`POST /login`), including data validation and token generation.

### Frontend

- **Auth Pages**: Implemented registration and login pages with form validation and error handling.
- **Navigation Bar**: Added a navigation bar to all pages, dynamically showing links based on the user's authentication status.
- **Homepage**: Designed a homepage that lists all books, with sorting functionality by name and popularity.
- **Book Detail Page**: Created a detailed view for each book, showing comprehensive information and enabling progress tracking for logged-in users.
- **Progress Page**: Developed a user-specific progress page, displaying books being read and allowing users to update their progress.
