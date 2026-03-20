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

export default function CvPreviewPage() {
  const params = useParams();
  const cvId = typeof params?.cvId === "string" ? params.cvId : "";
  const projectsFromStore = useCvStore((state) => state.cvs[cvId]?.projects);
  const setCvProjects = useCvStore((state) => state.setCvProjects);

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

  const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

  const formatDate = (date: Date) => new Intl.DateTimeFormat("ru-RU").format(date);

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
          <p>{cv?.education}</p>

          <h3 className="font-semibold mt-4 mb-1">Language proficiency</h3>
          <div>
            {userLanguages.map(l => (
              <div key={`${l.name} ${l.proficiency}`}>{`${l.name} ${l.proficiency}`}</div>
            ))}
          </div>

          <h3 className="font-semibold mt-4 mb-1">Domains</h3>
          <div>
            {displayProjects.map(p => (
              <div key={`${p.project.domain} ${p.project.id}`}>{p.project.domain}</div>
            ))}
          </div>
        </div>

        <div className="col-span-2 pl-2 py-6">
          <h3 className="font-semibold mb-1">{cv?.name}</h3>
          <p>{cv?.description}</p>

          <h3 className="font-semibold mt-4 mb-1">Programming languages</h3>
          <p>{groupedSkills["Programming languages"]?.map(s => s.name).join(", ") || ""}</p>

          <h3 className="font-semibold mt-4 mb-1">Frontend</h3>
          <p>{groupedSkills["Frontend"]?.map(s => s.name).join(", ") || ""}</p>

          <h3 className="font-semibold mt-4 mb-1">Backens</h3>
          <p>{groupedSkills["Backend technologies"]?.map(s => s.name).join(", ") || ""}</p>
        </div>
      </div>

      {/* Projects */}
      <div className="mt-10">
        <h1 className="text-4xl font-normal mb-8">Projects</h1>
      </div>

      {displayProjects.map(p => (
        <div key={p.project.id} className="grid grid-cols-3 gap-4">
          <div className="border-r-2 border-[#c53030] pr-6 py-6">
            <div>
                <h3 className="font-semibold text-base uppercase mb-1 text-red-700">{p.project.name}</h3>
                {p.project.description}
            </div>
          </div>

          <div className="col-span-2 pl-2 py-6">
            <h3 className="font-semibold mb-1">Project roles</h3>
              <div>
                {p.roles.map(role => (
                  <p key={role}>{role}</p>
                ))}
              </div>

            <h3 className="font-semibold mt-4 mb-1">Period</h3>
            <div>
              {(() => {
                const start = new Date(p.project.start_date);
                const end = new Date(p.project.end_date || '');

                if (!p.project.end_date || isSameDay(end, new Date())) {
                  return `${formatDate(start)} - Till now`;
                }

                return `${formatDate(start)} - ${formatDate(end)}`;
              })()}
            </div>

            <h3 className="font-semibold mt-4 mb-1">Responsibilities</h3>
              <ul className="ml-4">
                {p.responsibilities.map((responsibility, index) => (
                  <li
                    key={`${responsibility}-${index}`}
                    className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-1 before:h-1 before:bg-current before:rounded-full before:-translate-y-1/2"
                  >
                    {responsibility}
                  </li>
                ))}
              </ul>

            <h3 className="font-semibold mt-4 mb-1">Environment</h3>
            {p.project.environment.join(", ")}
          </div>
        </div>
      ))}

      {/* Skills */}
      <div className="mt-10 px-6">
        <h1 className="text-4xl font-normal mb-8">Professional skills</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold border-b-2 border-red-700">Category</th>
                <th className="px-4 py-3 font-semibold border-b-2 border-red-700">Skills</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <tr key={category} className="border-t border-zinc-200">
                  <td className="px-4 py-4 max-w-xs truncate overflow-hidden whitespace-nowrap font-semibold align-top text-red-700">
                    {category}
                  </td>
                  <td className="px-4 py-4 max-w-xs truncate overflow-hidden whitespace-nowrap">
                    {skills.map(s => s.name).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}