import userUsers from "../client/swr/useUsers";
import Layout from "../components/layout";
import styles from "./highscores.module.css";
export default function FirstPost() {
  const { users, isError, isLoading } = userUsers();

  const cool = ["🥇", "🥈", "🥉"];

  return (
    <Layout>
      <div className={"main"}>
        <p>Tomten's rangordning av agenter</p>

        {isLoading && <p>Laddar...</p>}

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
