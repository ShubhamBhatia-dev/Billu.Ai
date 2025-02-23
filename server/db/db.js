import { connect, Schema, model } from "mongoose";

// Function to connect to the database
async function connectDB() {
  try {
    await connect("mongodb://127.0.0.1:27017/billu");
    console.log("connected baby...");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

// Define user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create User Model
const usr = model("user", userSchema, "user");

// Function to add user details to DB
async function addUserDetailsToDb(name, email, token) {
  try {
      // 🔍 Check if user exists
      const existingUser = await usr.findOne({ email });

      if (existingUser) {
          console.log(`🔓 User ${email} exists. Logging in...`);
          return existingUser; // ✅ Return existing user for login
      }

      // 📝 If user doesn't exist, create a new one
      const newUser = await usr.create({ name, email, token });
      console.log(`🎉 New user ${email} registered.`);
      return newUser;
  } catch (err) {
      console.error("❌ Error saving user to DB:", err);
      throw err;
  }
}


async function myfunction(email) {
    const myuser = await usr.findOne({email});
    console.log(myuser.token);
    return myuser.token;
}


export default   {addUserDetailsToDb ,myfunction} ;