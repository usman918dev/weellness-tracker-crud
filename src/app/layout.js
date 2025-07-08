
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";


export const metadata = {
  title: "Wellness Tracker - Your Personal Health Journey",
  description:
    "Track your daily wellness activities including water intake, sleep, exercise, and mood",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html >
  );
}
