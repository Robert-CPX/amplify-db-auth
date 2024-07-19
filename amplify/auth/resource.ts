import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      oidc: [
        {
          name: "MicrosoftEntraID",
          clientId: secret("MICROSOFT_ENTRA_ID_CLIENT_ID"),
          clientSecret: secret("MICROSOFT_ENTRA_ID_CLIENT_SECRET"),
          issuerUrl: "<your-issuer-url>",
        },
      ],
      logoutUrls: ["http://localhost:3000/", "https://mywebsite.com"],
      callbackUrls: [
        "http://localhost:3000/profile",
        "https://mywebsite.com/profile",
      ],
    },
  },
});
