import Link from "next/link";
import { useRouter } from "next/router";
import useInvite from "../../client/swr/useInvite";
import Layout from "../../components/layout";

export default function Register() {
  const router = useRouter();
  const { inviteToken } = router.query;

  if (!inviteToken) return <p>Laddar...</p>;

  const { user, isLoading, isError } = useInvite(inviteToken);

  if (isLoading) return <p>Laddar...</p>;
  if (isError) return <p>Något gick fel :(</p>;

  return (
    <Layout>
      <div className="main">
        <p>God Jul {user.name}!</p>
        <p>
          Tomten har fastnat i cyberspacerymden och behöver din hjälp! Enligt våra informatörer har hen fastnat i något
          mystiskt land vid namn "fartnite". Nedan ser du en karta över "fartnite".{" "}
        </p>
        <img src="/images/FNBRC2S1Map.png" width="75%" />
        <p>
          Vi har sökt efter tomten med våra cybersatelliter utan lycka, men däremot har vi lokaliserat underliga
          cyberzoner som vi tror har något med Tomtens försvinnande att göra. Vi tror att det finns magiska cyberrunor i
          verkligheten som kan kopplas till cyberzonerna.
        </p>
        <img src="/images/cyberzoner.png" width="75%" />
        <p>
          <b>Ditt uppdrag:</b> hitta och erövra cyberzonerna. Desto längre en cyberzone är under din kontroll, desto
          fler cyberpoäng får du.
        </p>
        <p>
          <Link href={"/"}>fortsätt</Link>
        </p>
      </div>
    </Layout>
  );
}
