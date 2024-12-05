import {
  HandHistoryContext,
  HandHistoryProvider,
} from "@/context/HandHistoryContext";
import { RecordPageProvider } from "@/context/RecordPageContext";
import "@/styles/globals.css";
import styles from "@/styles/Home.module.css";
import { Segmented } from "antd";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {
  animated,
  useIsomorphicLayoutEffect,
  useTransition,
} from "react-spring";
import "regenerator-runtime/runtime";

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

  const { setHandHistory } = useContext(HandHistoryContext);

  const [componentArray, setComponentArray] = useState([
    <Component key={pathname} {...pageProps} />,
  ]);
  const [segmentedValue, setSegmentedValue] = useState("Record");

  const handleSegmentedChange = (value: string) => {
    if (value === "Record") {
      setHandHistory(null);
      router.push("/record");
    }
    setSegmentedValue(value);
  };

  const transitions = useTransition(componentArray, {
    from: {
      opacity: 0,
      transform: `translate3d(${
        segmentedValue === "Record" ? "-120%" : "120%"
      },0,0)`,
    },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: {
      opacity: 0,
      transform: `translate3d(${
        segmentedValue === "Record" ? "120%" : "-120%"
      },0,0)`,
    },
  });

  useIsomorphicLayoutEffect(() => {
    if (componentArray[0].key === pathname) {
      return;
    }
    setComponentArray([<Component key={pathname} {...pageProps} />]);
  }, [Component, pageProps, router, componentArray]);

  useEffect(() => {
    if (segmentedValue === "Record") {
      router.push("/record");
    } else if (segmentedValue === "Replay") {
      router.push("/replay");
    }
  }, [segmentedValue, router]);

  return (
    <div
      className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
    >
      <main className={styles.main}>
        <Segmented
          options={["Record", "Replay"]}
          onChange={handleSegmentedChange}
          block={true}
          value={pathname === "/record" ? "Record" : "Replay"}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        <HandHistoryProvider>
          <RecordPageProvider>
            {transitions((style, item) => (
              <animated.div style={{ ...style, width: "100%" }}>
                {item}
              </animated.div>
            ))}
          </RecordPageProvider>
        </HandHistoryProvider>
      </main>
    </div>
  );
}
