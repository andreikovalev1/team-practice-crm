import { CvProjectsContainer } from "@/features/cvProjects/CvProjectsContainer";

export default async function CvProjectsPage({ 
  params 
}: { 
  params: Promise<{ cvId: string }> 
}) {
  const { cvId } = await params;

  return (
    <div className="flex justify-center w-full px-6">
      <CvProjectsContainer cvId={cvId} />
    </div>
  );
}