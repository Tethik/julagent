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

  useEffect(async () => {
    if (claimToken) {
      const zone = await claim(claimToken);
      setZone(zone);
      setTimeout(() => router.replace(router.route, `/map?zone=${zone.id}`), 11000);
    }
  }, [claimToken]);

  // Should replace the url from the history, so cant just press back.

  console.log(zone);

  return (
    <Layout>
      <div className={"main"}>
        {zone === null && <p>Laddar...</p>}
        {zone && (
          <>
            <p>
              Du har hittat cyberzonen
              <br /> <b>"{zone.name}"</b>!
            </p>
            <p>Vänta medans cyberzonen erövras i ditt namn.</p>
            <Progressbar />{" "}
          </>
        )}
      </div>
    </Layout>
  );
}
