import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SW ProCard - Professional Sports Card Grading',
  description: 'Professional sports card grading and authentication services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
