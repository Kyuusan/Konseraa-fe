import VerifyOtpPage from "../verifyOtpPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { email } = await searchParams;
  return <VerifyOtpPage email={typeof email === "string" ? email : undefined} />;
}
