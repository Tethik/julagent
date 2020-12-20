import Head from "next/head";
import Link from "next/link";
import userUsers from "../client/swr/useUsers";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function FirstPost() {
  const { users, isError, isLoading } = userUsers();

  return (
    <Layout>
      <div className={utilStyles.main}>
        <p>Tomten's rangordning av agenter</p>

        {isLoading && <p>Laddar...</p>}

        {users && (
          <table>
            {users
              .sort((u1, u2) => u1.score - u2.score)
              .map((u, i) => (
                <tr className>
                  <td>{i + 1}.</td>
                  <td>{u.name}</td>
                  <td>{u.score} poäng</td>
                </tr>
              ))}
          </table>
        )}
      </div>
    </Layout>
  );
}
