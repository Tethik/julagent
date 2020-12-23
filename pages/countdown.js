import useCountdown from "../client/hooks/useCountdown";
import Layout from "../components/layout";

export default function CountdownPage(req, res) {
  const countdown = useCountdown();

  return (
    <Layout>
      <div className="main">
        <h1 style={{ fontSize: 72 }}>{countdown}</h1>
      </div>
    </Layout>
  );
}
