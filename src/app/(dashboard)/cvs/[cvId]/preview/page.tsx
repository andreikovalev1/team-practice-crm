"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_CV_BY_ID_QUERY } from "@/features/cvs/graphql";
import { useCvSkillsLogic } from "@/features/skills/useCvSkillsLogic";
import { useLanguagesLogic } from "@/features/languages/useLanguagesLogic";
import { useCvStore } from "@/store/useCvStore";
import { GET_CV_PROJECTS } from "@/features/cvProjects/graphql"; 
import { GetCvByIdResponse } from "@/features/cvs/types";
import { GetCvProjectsResponse } from "@/features/cvProjects/types";
import { useEffect } from "react";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { div } from "framer-motion/client";

export default function CvPreviewPage() {
  const params = useParams();
  const cvId = typeof params?.cvId === "string" ? params.cvId : "";
  const projectsFromStore = useCvStore((state) => state.cvs[cvId]?.projects);
  const setCvProjects = useCvStore((state) => state.setCvProjects);
  // const { profileUserId } = useIsOwnProfile();
  //   const {
  //   userLanguages
  // } = useLanguagesLogic(profileUserId);

  // DETAILS
  const { data, loading: cvLoading } = useQuery<GetCvByIdResponse>(GET_CV_BY_ID_QUERY, {
    variables: { cvId },
    skip: !cvId,
  });
  const cv = data?.cv;

  // LANGUAGES
  const {
    userLanguages
  } = useLanguagesLogic(cv?.user?.id);

  // SKILLS
  const { groupedSkills, loading: skillsLoading } = useCvSkillsLogic(cvId);

  // PROJECTS
  const { data: cvProjects, loading } = useQuery<GetCvProjectsResponse>(GET_CV_PROJECTS, {
    variables: { cvId },
    skip: !!projectsFromStore,
  });

  useEffect(() => {
    if (cvProjects?.cv?.projects) {
      setCvProjects(cvId, cvProjects.cv.projects);
    }
  }, [cvProjects, cvId, setCvProjects]);

  if ((loading && !projectsFromStore) || cvLoading || skillsLoading) {
    return <div className="py-20 text-center text-gray-500 animate-pulse">Loading...</div>;
  }
  const displayProjects = projectsFromStore || cvProjects?.cv.projects || [];
  console.log(displayProjects);

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-normal">{`${cv?.user?.profile?.first_name} ${cv?.user?.profile?.last_name}`}</h1>
          <p className="text-base uppercase">{cv?.user?.position_name}</p>
        </div>
          <button
            className="flex items-center gap-2 px-5 py-2 text-[#c53030] border-2 border-[#c53030] rounded-full font-medium text-sm uppercase cursor-pointer"
          >
            <span className="text-base leading-none mb-1">Export PDF</span>
          </button>
      </div>

      {/* Education & Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border-r-2 border-[#c53030] pr-2 py-6">
          <h3 className="font-semibold mb-1">Education</h3>
          <p className="text-gray-700">{cv?.education}</p>

          <h3 className="font-semibold mt-4 mb-1">Language proficiency</h3>
          <div className="text-gray-700">
            {userLanguages.map(l => (
              <div key={`${l.name} ${l.proficiency}`}>{`${l.name} ${l.proficiency}`}</div>
            ))}
          </div>

          <h3 className="font-semibold mt-4 mb-1">Domains</h3>
          <div className="text-gray-700">
            {displayProjects.map(p => (
              <div key={`${p.project.domain} ${p.project.id}`}>{p.project.domain}</div>
            ))}
          </div>
        </div>

        <div className="col-span-2 pl-2 py-6">
          <h3 className="font-semibold mb-1">{cv?.name}</h3>
          <p className="text-gray-700">{cv?.description}</p>

          <h3 className="font-semibold mt-4 mb-1">Programming languages</h3>
          <p className="text-gray-700">{groupedSkills["Programming languages"]?.map(s => s.name).join(", ") || ""}</p>

          <h3 className="font-semibold mt-4 mb-1">Frontend</h3>
          <p className="text-gray-700">{groupedSkills["Frontend"]?.map(s => s.name).join(", ") || ""}</p>

          <h3 className="font-semibold mt-4 mb-1">Backens</h3>
          <p className="text-gray-700">{groupedSkills["Backend technologies"]?.map(s => s.name).join(", ") || ""}</p>
        </div>
      </div>

      {/* Projects */}
      <div className="mt-10">
        <h1 className="text-4xl font-normal mb-8">Projects</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border-r-2 border-[#c53030] pr-2 py-6">
          <div className="text-gray-700">
            {displayProjects.map(p => (
              <div key={`${p.project.id}-${p.project.name}`}>
                <div>
                  <h3 className="font-semibold text-base uppercase mb-1 text-red-700">{p.project.name}</h3>
                  {p.project.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 pl-2 py-6">
          <h3 className="font-semibold mb-1">Project roles</h3>
          {displayProjects.map(p => (
            <div key={`${p.project.id}-${p.project.id}`}>
              <div>
                {p.roles.map(role => (
                  <p>{role}</p>
                ))}
              </div>
            </div>
          ))}

          <h3 className="font-semibold mt-4 mb-1">Period</h3>
          {displayProjects.map(p => (
            <div key={`${p.project.start_date}-${p.project.end_date}`}>
              <div>
                {`${p.project.start_date} - ${p.project.end_date}`}
              </div>
            </div>
          ))}

          <h3 className="font-semibold mt-4 mb-1">Responsibilities</h3>
          {displayProjects.map(p => (
            <div key={`${p.project.id}-${p.project.id}-${p.project.id}`}>
              <div>
                {p.responsibilities.map(responsibility => (
                  <div>{responsibility}</div>
                ))}
              </div>
            </div>
          ))}

          <h3 className="font-semibold mt-4 mb-1">Environment</h3>
          {displayProjects.map(p => (
            <div key={`${p.project.id}-${p.project.id}-${p.project.id}-${p.project.id}`}>
              <div>
                {p.project.environment}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Professional skills</h2>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="border p-4 rounded shadow-sm">
              <h4 className="font-medium mb-2">{category}</h4>
              <p className="text-gray-700">{skills.map((s) => s.name).join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}