import "@/styles/globals.css";
import "regenerator-runtime/runtime";
import type { AppProps } from "next/app";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useTransition, animated, useIsomorphicLayoutEffect } from "react-spring";
import localFont from "next/font/local";
import { Segmented } from "antd";
import styles from "@/styles/Home.module.css";

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

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [componentArray, setComponentArray] = useState([
    <Component key={pathname} {...pageProps} />,
  ]);

  const transitions = useTransition(componentArray, {
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  useIsomorphicLayoutEffect(() => {
    if (componentArray[0].key === pathname) {
      return;
    }
    setComponentArray([<Component key={pathname} {...pageProps} />]);
  }, [Component, pageProps, router, componentArray]);

  const handleSegmentChange = (value: string) => {
    if (value === "Record") {
      router.push("/record");
    } else if (value === "Replay") {
      router.push("/replay");
    }
  };

  return (
    <div
      className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
    >
      <main className={styles.main}>
          <Segmented
            options={["Record", "Replay"]}
            onChange={handleSegmentChange}
            block={true}
          value={pathname === "/record" ? "Record" : "Replay"}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        {transitions((style, item) => (
            <animated.div style={{ ...style, width: "100%" }}>
              {item}
            </animated.div>
          ))}
      </main>
    </div>
  );
}
