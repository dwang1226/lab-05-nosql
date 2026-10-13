 // Step 2: 
// usebookstore
db = db.getSiblingDB("bookstore");

// Step 3: load authors.json
db.authors.drop();
let authors = JSON.parse(fs.readFileSync("authors.json", "utf8"));
db.authors.insertMany(authors);

// Step 4: load books.json
db.books.drop();
let books = JSON.parse(fs.readFileSync("books.json", "utf8"));
db.books.insertMany(books);

// Step 5: list authors and books
print("Original authors:");
db.authors.find().forEach(printjson);

print("Original books:");
db.books.find().forEach(printjson);

// Step 6: insert two new books
db.books.insertMany([
  {
    title: "First Frost",
    published_year: 2020,
    author_ids: ["author_004"]
  },
  {
    title: "Mockingjay",
    published_year: 2010,
    author_ids: ["author_005"]
  }
]);

// Step 7: add missing authors
db.authors.insertMany([
  {
    _id: "author_004",
    name: "Zhuyi",
    nationality: "Chinese",
    bio: {
      short: "Chinese novelist.",
      long: "Zhuyi is a Chinese novelist known for her romance light novels that were later adapted into TV series."
    }
  },
  {
    _id: "author_005",
    name: "Suzanne Collins",
    nationality: "American",
    bio: {
      short: "American novelist.",
      long: "Suzanne Collins is an American author known for The Hunger Games trilogy."
    }
  }
]);

// Step 8: filter books by a list of authors
print("Books by selected authors:");
db.books.find({
  author_ids: {
    $in: ["author_001", "author_004", "author_005"]
  }
}).forEach(printjson);
