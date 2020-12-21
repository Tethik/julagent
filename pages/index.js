import Head from "next/head";
import Link from "next/link";
import useMe from "../client/swr/useMe";
import useZones from "../client/swr/useZones";
import Layout from "../components/layout";

export default function Home() {
  const { user, isError, isLoading } = useMe();
  const { zones } = useZones();

  if (isLoading) return <p>Laddar..</p>;

  if (isError) return <p>Ej Tillgång! North Pole Secret Access Önly.</p>;

  return (
    <Layout>
      <div className="main">
        <p>Hej {user.name.trim()}!</p>
        <p>Du har ⭐ {user.score} poäng!</p>
        {zones && (
          <p>
            Du har upptäckt {zones.filter((z) => z.discovery_date).length} av {zones.length} cyberzoner.{" "}
            {zones.filter((z) => z.discovery_date).length !== zones.length ? "Fortsätt leta!" : "Bra jobbat 🎉"}
          </p>
        )}
      </div>
    </Layout>
  );
}
