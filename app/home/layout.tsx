import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WornHub - Home",
  description: "Generated by create next app",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
