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
      <p>Välkommen {user.name}!</p>
      <p>Intro text</p>
      <p>
        <Link href={"/"}>öppna hemliga appen</Link>
      </p>
    </Layout>
  );
}
