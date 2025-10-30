import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { supabase } from "./supabaseClient.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (existingUser) {
          return done(null, existingUser);
        }

        const { data: newUser, error } = await supabase
          .from("users")
          .insert([
            {
              name: profile.displayName,
              email: email,
              password: "",
            },
          ])
          .select()
          .single();

        if (error) throw error;
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
