import { computed } from "vue";

export interface NavSection {
  id: string;
  href: string;
  label: string;
}

export const useNavSections = () => {
  const { t } = useI18n();

  const sections = computed<NavSection[]>(() => [
    { id: "about", href: "#about", label: t("nav.about") },
    { id: "skills", href: "#skills", label: t("nav.skills") },
    { id: "experience", href: "#experience", label: t("nav.experience") },
    { id: "education", href: "#education", label: t("nav.education") },
  ]);

  return { sections };
};
