import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import RecordPageContainer from "@/components/RecordPage/ManualInputs/RecordPageContainer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <RecordPageContainer />
        </main>
      </div>
    </>
  );
}
