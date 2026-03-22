import { CvSkillsContainer } from "@/features/skills/CvSkillsContainer";

export default async function CvSkillsPage({ params }: { params: Promise<{ cvId: string }> }) {
  const { cvId } = await params;

  return (
    <div className="flex justify-center w-full px-6">
      <CvSkillsContainer cvId={cvId} />
    </div>
  );
}