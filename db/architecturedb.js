// users
// id
// name
// mail
// password


// books
// id
// title
// author
// category
// isRented (automatically $false)



// rentedBooks
// bookId
// userId
// rentDate 
// returnDate




// (a trigger to be done: if a book is emprunted, it will be marked as emprunted)
// (a trigger to be done: if a book is returned, it will be marked as returned)




//To create users collection:

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "mail", "password"],
      properties: {
        name: { bsonType: "string" },
        mail: { bsonType: "string" },
        password: { bsonType: "string" }
      }
    }
  }
})

//To create books collection:

db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object", required: ["title", "author", "category"],
      properties: {
        title: { bsonType: "string", description: "Must be a string and is required" },
        author: { bsonType: "string", description: "Must be a string and is required" },
        category: { bsonType: "string", description: "Must be a string and is required" },
        isRented: { bsonType: "bool", description: "Must be boolean" }
      }
    }
  }
})

//To create rentedBooks:
db.createCollection("rentedBooks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["bookId", "userId", "rentDate", "returnDate"],
      properties: {
        bookId: {
          bsonType: "objectId",
          description: "must be a valid book ObjectId"
        },
        userId: {
          bsonType: "objectId",
          description: "must be a valid user ObjectId"
        },
        rentDate: {
          bsonType: "date",
          description: "must be a date"
        },
        returnDate: {
          bsonType: "date",
          description: "must be a date"
        }
      }
    }
  }
})