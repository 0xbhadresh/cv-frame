import React, { useState, useCallback, useEffect } from "react";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import sdk, { SignIn as SignInCore } from "@farcaster/frame-sdk";
import CreateCampaign from "./create-campaign-stepper";

interface LoginPageProps {
  title?: string;
}

interface User {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  location: {
    placeId: string;
    description: string;
  };
}

interface Client {
  clientFid: number;
  added: boolean;
}

interface Context {
  user: User;
  client: Client;
}

export default function LoginPage({
  title = "Frames v2 Demo",
}: LoginPageProps) {
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signInResult, setSignInResult] = useState<SignInCore.SignInResult>();
  const [signInFailure, setSignInFailure] = useState<string>();
  const { status } = useSession();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [lastEvent, setLastEvent] = useState("");
  const [context, setContext] = useState<Context | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");
    return nonce;
  }, []);

  const handleSignIn = useCallback(async () => {
    try {
      setSigningIn(true);
      setSignInFailure(undefined);
      const nonce = await getNonce();
      const result = await sdk.actions.signIn({ nonce });
      setSignInResult(result);

      const signInResponse = await signIn("credentials", {
        message: JSON.stringify(result.message),
        signature: result.signature,
        redirect: false,
      });

      if (signInResponse?.error) {
        setSignInFailure(`Authentication failed: ${signInResponse.error}`);
        return;
      }

      if (!signInResponse?.ok) {
        setSignInFailure("Authentication failed");
        return;
      }

      // Simulate a login process
      const userContext: Context = {
        user: {
          fid: 884823,
          username: "sarvagna",
          displayName: "Sarvagna Kadiya",
          pfpUrl:
            "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/f803614e-db63-4485-de12-5bf285bb7700/rectcrop3",
          location: {
            placeId: "ChIJSdRbuoqEXjkRFmVPYRHdzk8",
            description: "Ahmedabad, Gujarat, India",
          },
        },
        client: {
          clientFid: 9152,
          added: false,
        },
      };

      setContext(userContext);
      setIsLoggedIn(true);
    } catch (e) {
      console.error("Sign in error:", e);
      if (e instanceof SignInCore.RejectedByUser) {
        setSignInFailure("Rejected by user");
        return;
      }
      setSignInFailure("Unknown error");
    } finally {
      setSigningIn(false);
    }
  }, [getNonce]);

  const handleSignOut = useCallback(async () => {
    try {
      setSigningOut(true);
      await signOut({ redirect: false });
      setSignInResult(undefined);
    } finally {
      setSigningOut(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setAdded(context.client.added);

      console.log(added);
      console.log(lastEvent);
      console.log(title);

      sdk.on("frameAdded", () => {
        setLastEvent("frameAdded");
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        setLastEvent(`frameAddRejected, reason ${reason}`);
      });

      sdk.on("frameRemoved", () => {
        setLastEvent("frameRemoved");
        setAdded(false);
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});
    };

    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, title]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>

        <div className="text-sm mb-2">Status: {status}</div>

        <Button onClick={handleSignIn} disabled={signingIn}>
          {signingIn ? "Signing in..." : "Sign In with Farcaster"}
        </Button>

        {signInFailure && !signingIn && (
          <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 dark:bg-gray-800 rounded-lg font-mono">
            <div className="font-semibold text-gray-500 mb-1">SIWF Result</div>
            <div className="whitespace-pre">{signInFailure}</div>
          </div>
        )}

        {signInResult && (
          <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 dark:bg-gray-800 rounded-lg font-mono">
            <div className="font-semibold text-gray-500 mb-1">
              Sign In Result
            </div>
            <div className="whitespace-pre">
              {JSON.stringify(signInResult, null, 2)}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button onClick={handleSignOut} disabled={signingOut}>
        {signingOut ? "Signing out..." : "Sign out"}
      </Button>
      <CreateCampaign />
      {isLoggedIn && (
        <div className="user-info">
          <h2>Welcome, {context?.user.displayName}!</h2>
          <img
            src={context?.user.pfpUrl}
            alt="Profile"
            className="profile-pic"
          />
          <p>Username: {context?.user.username}</p>
          <p>Location: {context?.user.location.description}</p>
        </div>
      )}
    </div>
  );
}
