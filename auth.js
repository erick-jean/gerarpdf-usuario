require("dotenv").config();
const passport = require("passport");
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;

// Configuração do Passport com Azure AD
passport.use(new OIDCStrategy({
    identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: process.env.CLIENT_ID,
    responseType: "code",
    responseMode: "query",
    redirectUrl: process.env.REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.CLIENT_SECRET,
    validateIssuer: false,
    passReqToCallback: false,
    scope: ["profile", "email", "openid"]
}, (iss, sub, profile, accessToken, refreshToken, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
