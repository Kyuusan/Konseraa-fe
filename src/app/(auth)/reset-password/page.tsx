import ResetPasswordPage from "../resetPasswordPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token, email } = await searchParams;
  return (
    <ResetPasswordPage
      token={typeof token === "string" ? token : undefined}
      email={typeof email === "string" ? email : undefined}
    />
  );
}
