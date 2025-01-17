"use client";

import { useEffect, useState } from "react";

import sdk from "@farcaster/frame-sdk";

import NFTCampaignStepper from "./nft-campaign-stepper";

export default function Demo(
  { title }: { title?: string } = { title: "Frames v2 Demo" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [lastEvent, setLastEvent] = useState("");

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
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NFTCampaignStepper />
    </div>
  );
}
