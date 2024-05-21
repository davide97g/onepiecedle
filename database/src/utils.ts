import databaseArcs from "../data/arcs.json";
import databaseSagas from "../data/sagas.json";
import { OnePieceArc, OnePieceSaga } from "./types";

const archs = databaseArcs as OnePieceArc[];
const sagas = databaseSagas as OnePieceSaga[];

export const generateIdFromName = (name: string): string => {
  // convert it to a specific format in order to use it as an id and offuscate the real name
  // whatever name the lenght should be 16 characters
  return name
    .trim()
    .toLowerCase()
    .split("")
    .map((c) => c.charCodeAt(0).toString(16))
    .join("")
    .padEnd(16, "x")
    .slice(0, 16);
};
//

export const findArchAndSaga = ({
  chapterNumber,
}: {
  chapterNumber: number;
}): { arch: string; saga: string } => {
  const arc = archs.find((arc) => {
    if (
      arc.chapters.start <= chapterNumber &&
      arc.chapters.end >= chapterNumber
    ) {
      return arc;
    }
  });
  const saga = sagas.find((saga) => saga.id === arc?.sagaId);
  return { arch: arc?.name ?? "Unknown", saga: saga?.name ?? "Unknown" };
};
