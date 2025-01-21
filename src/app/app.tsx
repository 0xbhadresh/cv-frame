"use client";

import dynamic from "next/dynamic";
import "./globals.css";

const LoginPage = dynamic(() => import("../components/LoginPage"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Frames v2 Demo" }
) {
  return <LoginPage title={title} />;
}
