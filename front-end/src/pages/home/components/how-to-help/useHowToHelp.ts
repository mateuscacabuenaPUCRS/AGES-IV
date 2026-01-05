import { getHowToHelpList, updateHowToHelpTopic, type HowToHelpAPI } from "@/services/how-to-help";
import { useEffect, useState } from "react";

export function useHowToHelp() {
  const [howToHelpList, setHowToHelpList] = useState<HowToHelpAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getHowToHelp() {
    setIsLoading(true);
    try {
      const response = await getHowToHelpList();
      setHowToHelpList(response);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateHowToHelp(id: string, description: string) {
    setIsLoading(true);
    try {
      await updateHowToHelpTopic(id, description);
      setHowToHelpList(
        howToHelpList.map((howToHelp) =>
          howToHelp.id === id ? { ...howToHelp, description } : howToHelp
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getHowToHelp();
  }, []);

  return { howToHelpList, isLoading, updateHowToHelp };
}
