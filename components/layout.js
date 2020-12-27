import styles from "./layout.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import useMe from "../client/swr/useMe";
import useCountdown from "../client/hooks/useCountdown";

export default function Layout({ children }) {
  const [expand, setExpand] = useState(false);
  const countdown = useCountdown();
  const { user, isError, isLoading } = useMe();

  if (user && user.shamed_at) {
    const timeout = 120 * 60 * 1000;
    const diff = new Date() - new Date(user.shamed_at);
    const shamed = diff > 0 && diff < timeout;

    if (shamed) {
      const prutt = () => {
        const i = Math.round(1 + Math.random() * 2);
        var audio = new Audio(`/sounds/fart${i}.mp3`);
        audio.play();
      };
      return (
        <div style={{ padding: "25px" }}>
          <h1 onMouseOver={prutt} onClick={prutt}>
            Tomten har märkt att du fuskar. Aja baja! Nu får du timeout i{" "}
            {new Number((timeout - diff) / 1000).toFixed(0)} sekunder. 💩💩
            💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩
            💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩 💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩
          </h1>
        </div>
      );
    }
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.title}>
          {user && (
            <div>
              <FontAwesomeIcon
                className={styles.hamburger}
                icon={faBars}
                rotation={expand ? 90 : 0}
                color={"white"}
                onClick={() => setExpand(!expand)}
                size={"1x"}
                width={24}
              />
            </div>
          )}
          <div>
            <Link href="/">Xmas Agent</Link>
          </div>
          {user && <span className={styles.points}>{new Number(user.score).toFixed(0)}⭐</span>}
        </div>

        {user && (
          <ul className={styles.menu} style={{ display: expand ? "block" : "none" }}>
            <li>
              <Link href="/map" onClick={() => setExpand(false)}>
                🗺️ Karta
              </Link>
            </li>
            <li>
              <Link href="/highscores" onClick={() => setExpand(false)}>
                🏆 HIGHSCORES
              </Link>
            </li>
            <li>
              <Link href="/countdown" onClick={() => setExpand(false)}>
                🔫 00:00:00
              </Link>
            </li>
          </ul>
        )}
      </header>
      {user ? <main>{children}</main> : <main className="main">Ej inloggad.</main>}
    </>
  );
}
