// "use client";

// import { useMutation } from "@apollo/client/react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// import Modal from "@/components/ui/Modal";
// import OvalButton from "@/components/button/OvalButton";
// import { DELETE_SKILL_MUTATION } from "@/features/skills/graphql";
// import { GlobalSkill } from "@/features/skills/types";

// interface DeleteSkillModalProps {
//   skill: GlobalSkill;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function DeleteSkillModal({ skill, isOpen, onClose }: DeleteSkillModalProps) {
//   const router = useRouter();
//   const [deleteSkill, { loading: isDeleting }] = useMutation(DELETE_SKILL_MUTATION, {
//     refetchQueries: ["GetGlobalSkills"],
//   });

//   const handleDelete = async () => {
//     const loadingToast = toast.loading("Deleting skill...");
//     try {
//       await deleteSkill({ variables: { skill: { skillId: skill.id } } });
//       toast.success("Skill successfully deleted", { id: loadingToast });
//       onClose();
//       router.refresh();
//     } catch (error: unknown) {
//       const message = error instanceof Error ? error.message : "Failed to delete skill";
//       toast.error(message, { id: loadingToast });
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={`Delete Skill: ${skill.name}`}>
//       <div className="flex flex-col gap-4">
//         <p className="text-sm leading-relaxed">
//           Are you sure you want to delete the skill: <span className="font-bold">{skill.name}</span>?
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 mt-3 w-full">
//           <OvalButton
//             text="Cancel"
//             type="button"
//             variant="ovalOutline"
//             onClick={onClose}
//             disabled={isDeleting}
//             className="w-full"
//           />
//           <OvalButton
//             text={isDeleting ? "Deleting..." : "Delete"}
//             type="button"
//             onClick={handleDelete}
//             disabled={isDeleting}
//             className="w-full"
//           />
//         </div>
//       </div>
//     </Modal>
//   );
// }