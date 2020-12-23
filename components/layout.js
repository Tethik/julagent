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
                <a>🔫 {countdown}</a>
              </Link>
            </li>
            <li>
              <Link href="/shop" onClick={() => setExpand(false)}>
                🛒 ?????
              </Link>
            </li>
            <li>
              <Link href="/messages" onClick={() => setExpand(false)}>
                ✉️ ?????
              </Link>
            </li>
          </ul>
        )}
      </header>
      {user ? <main>{children}</main> : <main className="main">Ej inloggad.</main>}
    </>
  );
}
