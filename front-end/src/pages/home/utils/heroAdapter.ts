import type { EventAPI } from "@/services/events";
import type { HeroItem } from "../components/hero";

import { getEventImage } from "@/constant/defaultImages";
import { dateUtils } from "@/utils/dateUtils";

function eventToHeroItem(event: EventAPI): HeroItem {
  return {
    imageUrl: getEventImage(null),
    title: event.title,
    description: event.description,
    location: event.location,
    date: dateUtils.formatCompleteDate(event.dateStart),
    buttonLabel: "Ir para o evento",
    buttonLink: "https://www.paodospobres.org.br/categorias-noticias/evento/",
    id: event.id,
    imageAlt: event.title,
    time: dateUtils.formatTime(event.dateStart),
  };
}

export const heroAdapter = {
  eventToHeroItem,
};
