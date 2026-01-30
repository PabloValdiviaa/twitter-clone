import { notFound } from "next/navigation";
import { getProfile } from "@/actions/profile.actions";
import { Header } from "@/components/layout/header";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div>
      <Header
        title={profile.name}
        subtitle={`${profile._count.posts} posts`}
        showBackButton
      />
      <ProfileHeader profile={profile} />
      <ProfileTabs userId={profile.id} />
    </div>
  );
}
