const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid"); 

let books = [
    {
      title: 'Clean Code',
      published: 2008,
      author: 'Robert Martin',
      id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
      genres: ['refactoring']
    },
    {
      title: 'Agile software development',
      published: 2002,
      author: 'Robert Martin',
      id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
      genres: ['agile', 'patterns', 'design']
    },
    {
      title: 'Refactoring, edition 2',
      published: 2018,
      author: 'Martin Fowler',
      id: "afa5de00-344d-11e9-a414-719c6709cf3e",
      genres: ['refactoring']
    },
    {
      title: 'Refactoring to patterns',
      published: 2008,
      author: 'Joshua Kerievsky',
      id: "afa5de01-344d-11e9-a414-719c6709cf3e",
      genres: ['refactoring', 'patterns']
    },  
    {
      title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
      published: 2012,
      author: 'Sandi Metz',
      id: "afa5de02-344d-11e9-a414-719c6709cf3e",
      genres: ['refactoring', 'design']
    },
    {
      title: 'Crime and punishment',
      published: 1866,
      author: 'Fyodor Dostoevsky',
      id: "afa5de03-344d-11e9-a414-719c6709cf3e",
      genres: ['classic', 'crime']
    },
    {
      title: 'The Demon ',
      published: 1872,
      author: 'Fyodor Dostoevsky',
      id: "afa5de04-344d-11e9-a414-719c6709cf3e",
      genres: ['classic', 'revolution']
    },
]

  
let authors = [
    {
      name: 'Robert Martin',
      id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
      born: 1952,
    },
    {
      name: 'Martin Fowler',
      id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
      born: 1963
    },
    {
      name: 'Fyodor Dostoevsky',
      id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
      born: 1821
    },
    { 
      name: 'Joshua Kerievsky', // birthyear not known
      id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    { 
      name: 'Sandi Metz', // birthyear not known
      id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
]

const typeDefs = `
    type Book {
        title: String!
        published: Int!
        author: String!
        genres: [String]!
        id: ID!
    }

    type Author {
        name: String!
        born: Int
        bookCount: Int!
        id: ID!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book]!
        allAuthors: [Author]!
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String]!    
        ) : Book
    }
`;

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allBooks: (root, {author, genre}) => {
            if (!author && !genre) return books;
            let filtered = [...books];
            if (author) filtered = filtered.filter(b => b.author === author);
            if (genre) filtered = filtered.filter(b => b.genres.indexOf(genre) >= 0);

            return filtered;
        },
        allAuthors: () => {
            console.log(authors);
            return authors.map(a => {
                const count = books.filter(b => b.author === a.name).length;
                a.bookCount = count;
                return a;
            })
        }},

    Mutation: {
        addBook: (root, {title, author, published, genres}) => {
            if (!authors.find(a => a.name === author)) authors.push({name: author, id: uuid()})

            const book = {title, published, author, genres}
            books.push(book);
            return book;
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

startStandaloneServer(server, {
    listen: {port: 5003}
}).then(({url}) => console.log(`server listening on ${url}`));