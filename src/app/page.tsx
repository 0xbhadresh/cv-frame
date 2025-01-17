import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `https://static.chainbroker.io/mediafiles/projects/coinvise/coinvise.jpeg`,
  button: {
    title: "Launch Frame",
    action: {
      type: "launch_frame",
      name: "Coinvise Campaign Creation",
      url: appUrl,
      splashImageUrl: `https://static.chainbroker.io/mediafiles/projects/coinvise/coinvise.jpeg`,
      splashBackgroundColor: "#ffffff",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Coinvise Campaign Creation",
    openGraph: {
      title: "Coinvise Campaign Creation",
      description: "A Coinvise Campaign Creation app.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
