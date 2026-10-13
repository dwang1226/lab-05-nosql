#!/usr/bin/env python3

import os
import logging
from pymongo import MongoClient

MONGODB_ATLAS_URL = os.getenv("MONGODB_ATLAS_URL")
MONGODB_ATLAS_USER = os.getenv("MONGODB_ATLAS_USER")
MONGODB_ATLAS_PWD = os.getenv("MONGODB_ATLAS_PWD")

logging.basicConfig(level=logging.INFO)

def main():
    """print bookstore report for selected authors"""
    client = None

    try:
        # connect to MongoDB Atlas
        client = MongoClient(MONGODB_ATLAS_URL, username=MONGODB_ATLAS_USER, password=MONGODB_ATLAS_PWD)
        client.admin.command("ping")
        logging.info("Connected to MongoDB Atlas")

        # select database and collections
        db = client["bookstore"]
        authors = db["authors"]
        books = db["books"]

        # choose authors to include in report
        author_ids = ["author_002", "author_004"]

        total = authors.count_documents({"_id": {"$in": author_ids}})
        print(f"\nAuthors: {total}\n")

        # find each author and their books
        for author in authors.find({"_id": {"$in": author_ids}}):
            print(author["name"])

            for book in books.find({"author_ids": author["_id"]}):
                print(f"  {book['title']} ({book['published_year']})")

            print()

    except Exception as e:
        logging.error("Error: %s", e)

    finally:
        # close MongoDB connection
        if client is not None:
            client.close()
            logging.info("MongoDB connection closed")

if __name__ == "__main__":
    main()
