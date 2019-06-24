const user = {
  _id: "1",
  name: "Taha",
  email: "tahauygun@gmail.com",
  picture: "https://cloudinary.com/asdf"
}

module.exports = {
  Query: {
    me: () => user
  }
}
