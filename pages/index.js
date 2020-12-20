import Head from "next/head";
import Link from "next/link";
import useMe from "../client/swr/useMe";
import Layout from "../components/layout";

export default function Home() {
  const { user, isError, isLoading } = useMe();

  if (isLoading) return <p>Laddar..</p>;

  if (isError) return <p>Ej Tillgång! North Pole Secret Access Önly.</p>;

  return (
    <Layout>
      <main>
        <p>Välkommen {user.name.trim()}</p>
        <p>Du har ⭐ {user.score} poäng!</p>
        <p>Du har upptäckt 4 av 10 cyberzoner. Fortsätt leta!</p>
        <ul>
          <li>
            <Link href={"/info"}>Ditt Uppdrag</Link>
          </li>
          <li>
            <Link href={"/map"}>Öppna kartan</Link>
          </li>
          <li>
            <Link href={"/messages"}>Meddelanden</Link>
          </li>
          <li>
            <Link href={"/scoreboard"}>HIGHSCORES</Link>
          </li>
        </ul>
      </main>
    </Layout>
  );
}
