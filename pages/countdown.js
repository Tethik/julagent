import useCountdown from "../client/hooks/useCountdown";
import useMe from "../client/swr/useMe";
import Layout from "../components/layout";

export default function CountdownPage(req, res) {
  // const countdown = useCountdown();
  const { user } = useMe();

  return (
    <Layout>
      <div className="main">
        {/* {countdown !== "00:00:00" && <h1 style={{ fontSize: 72 }}>{countdown}</h1>} */}
        {user && <img src={`/images/${user.name.trim()}.jpg`} />}
      </div>
    </Layout>
  );
}
