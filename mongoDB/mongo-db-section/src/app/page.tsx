"use client";

import { useEffect, useState } from "react";
import Button from "@/components/button/button";

interface Book {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
}

interface Book {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOperation = async (operation: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await operation();
      await fetchBooks();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch("/api/books");
    const data = await response.json();
    setBooks(data);
  };

  const addInitialBooks = () =>
    handleOperation(async () => {
      const initialBooks = [
        {
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          publishedYear: 1937,
        },
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genre: "Fiction",
          publishedYear: 1960,
        },
        {
          title: "1984",
          author: "George Orwell",
          genre: "Dystopian",
          publishedYear: 1949,
        },
      ];

      await fetch("/api/books", {
        method: "POST",
        body: JSON.stringify(initialBooks),
      });
      fetchBooks();
    });

  const updateBook = () =>
    handleOperation(async () => {
      await fetch("/api/books", {
        method: "PUT",
        body: JSON.stringify({
          title: "1984",
          updates: { genre: "Science Fiction" },
        }),
      });
      fetchBooks();
    });

  const deleteBook = () =>
    handleOperation(async () => {
      await fetch("/api/books", {
        method: "DELETE",
        body: JSON.stringify({ title: "The Hobbit" }),
      });
      fetchBooks();
    });

  const deleteBookByTitle = (title: string) =>
    handleOperation(async () => {
      await fetch("/api/books", {
        method: "DELETE",
        body: JSON.stringify({ title }),
      });
    });

  return (
    <main className="container">
      <div className="button-group">
        <Button onClick={addInitialBooks} variant="add" disabled={isLoading}>
          Add Initial Books
        </Button>
        <Button onClick={updateBook} variant="update" disabled={isLoading}>
          Update 1984 Genre
        </Button>
        <Button onClick={deleteBook} variant="delete" disabled={isLoading}>
          Delete Hobbit
        </Button>
      </div>

      <div className="book-grid">
        {books.map((book) => (
          <div key={book.title} className="book-card">
            <h2 className="book-title">{book.title}</h2>
            <p className="book-info">Author: {book.author}</p>
            <p className="book-info">Genre: {book.genre}</p>
            <p className="book-info">Published: {book.publishedYear}</p>
            <Button
              onClick={() => deleteBookByTitle(book.title)}
              variant="delete"
              disabled={isLoading}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
