import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import claim from "../../client/claim";
import Layout from "../../components/layout";
import Progressbar from "../../components/progressbar";

export default function Claim() {
  const router = useRouter();
  const { claimToken } = router.query;

  if (!claimToken) return <p>Laddar...</p>;

  const [zone, setZone] = useState(null);
  const [bonus, setBonus] = useState(null);

  useEffect(async () => {
    if (claimToken) {
      const { zone, discovery_bonus } = await claim(claimToken);
      setBonus(discovery_bonus);
      setZone(zone);
      setTimeout(() => router.replace(`/map?zone=${zone.id}`), 22000);
    }
  }, [claimToken]);

  // Should replace the url from the history, so cant just press back.

  return (
    <Layout>
      <div className={"main"}>
        {zone === null && <p>Laddar...</p>}
        {zone && (
          <>
            <p>
              Du har scannat cyberzonen
              <br /> <b>"{zone.name}"</b>!
            </p>
            <p>Vänta medans cyberzonen erövras i ditt namn.</p>
            <Progressbar />
            {bonus > 0 && (
              <p>
                <b>Upptäckarbonus:</b> ⭐ {bonus}
              </p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
