import useMe from "../client/swr/useMe";
import userUsers from "../client/swr/useUsers";
import useZones from "../client/swr/useZones";
import Layout from "../components/layout";
import styles from "./highscores.module.css";

export default function Home() {
  const { users } = userUsers();
  const { user, isError, isLoading } = useMe();
  const { zones } = useZones();

  const cool = ["🥇", "🥈", "🥉"];

  if (isLoading) return <p>Laddar..</p>;

  if (isError) return <p>Ej Tillgång! North Pole Secret Access Önly.</p>;

  const victoryLap = () => {
    var audio = new Audio(`/sounds/victory.mp3`);
    audio.play();
  };

  return (
    <Layout>
      <div className="main">
        <p>Hej {user.name.trim()}!</p>
        <p>Spelet är slut! Julian har vunnit.</p>

        <div>
          {user && user.name.trim() === "julian" && (
            <img width={"100%"} src="/images/trophy.png" onClick={victoryLap} />
          )}
        </div>
        {users && (
          <table className={styles.table}>
            {users
              .sort((u1, u2) => -(u1.score - u2.score))
              .map((u, i) => (
                <tr>
                  <td>{cool[i] || `${i + 1}.`}</td>
                  <td>{u.name}</td>
                  <td align="right">{new Number(u.score).toFixed(0)} ⭐</td>
                </tr>
              ))}
          </table>
        )}
      </div>
    </Layout>
  );
}
