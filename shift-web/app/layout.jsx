import "./globals.css";

export const metadata = { title: "Shift Scheduler" };

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
