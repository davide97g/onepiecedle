import confetti from "canvas-confetti";

import { Add, Restart } from "@carbon/icons-react";
import { Button, CircularProgress, Progress } from "@nextui-org/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { GuessResult } from "../../../types/algorithm.model";
import { GuessFeedback } from "../components/GuessFeedback";
import { GuessFeedbackHeader } from "../components/GuessFeedbackHeader";

import {
  OnePieceModel,
  OnePieceCharacterSummary,
} from "../../../types/onepiece.model";
import { API } from "../services/api";

const SearchBar = lazy(() => import("../components/SearchBar"));
const Guess = lazy(() => import("../components/Guess"));

export const Player = () => {
  const isMobile = window.innerWidth < 640;
  const [isLoading, setIsLoading] = useState(false);

  const [showGoal, setShowGoal] = useState(
    localStorage.getItem("showGoal") === "true"
  );
  const [characterList, setCharacterList] = useState<
    OnePieceCharacterSummary[]
  >([]);
  const [characterToGuess, setCharacterToGuess] = useState<OnePieceModel>();

  const [remaining, setRemaining] = useState<number>();

  const [gameStatus, setGameStatus] = useState<"PLAYING" | "WON">("PLAYING");

  const [guessFeedbackHistory, setGuessFeedbackHistory] = useState<
    GuessResult[]
  >(
    localStorage.getItem("guessFeedbackHistory")
      ? (JSON.parse(
          localStorage.getItem("guessFeedbackHistory") as string
        ) as GuessResult[])
      : []
  );

  useEffect(() => {
    localStorage.setItem("showGoal", showGoal.toString());
  }, [showGoal]);

  useEffect(() => {
    if (gameStatus === "WON") {
      const particleCount = Math.max(
        Math.floor(1000 - guessFeedbackHistory.length * 100),
        100
      );
      confetti({
        particleCount,
        spread: 100000,
      });
    }
  }, [gameStatus, guessFeedbackHistory.length]);

  useEffect(() => {
    if (guessFeedbackHistory.length > 0) {
      if (guessFeedbackHistory.some((feedback) => hasWon(feedback))) {
        setTimeout(() => setGameStatus("WON"), 250);
      }
    }
  }, [guessFeedbackHistory]);

  const reversedGuessFeedbackHistory = useMemo(() => {
    return structuredClone(
      guessFeedbackHistory.sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
    );
  }, [guessFeedbackHistory]);

  const hasWon = (feedbackGuess: GuessResult) => {
    return (
      feedbackGuess.gender.valid &&
      feedbackGuess.origin.valid &&
      feedbackGuess.devilFruitType.valid &&
      feedbackGuess.status.valid &&
      feedbackGuess.debutSaga.comparison === "equal" &&
      feedbackGuess.bounty.comparison === "equal" &&
      feedbackGuess.height.comparison === "equal" &&
      feedbackGuess.age.comparison === "equal"
    );
  };

  const guessedCharacter = useMemo(() => {
    if (gameStatus === "WON")
      return characterList.find(
        (p) => p.id === reversedGuessFeedbackHistory[0].id
      );
    return undefined;
  }, [gameStatus, reversedGuessFeedbackHistory, characterList]);

  const guessById = (guessId: string) => {
    if (guessId) {
      setIsLoading(true);
      API.sendGuessCharacterId(guessId, guessFeedbackHistory)
        .then((response) => {
          const updatedHistory = [
            ...guessFeedbackHistory,
            { ...response.validation, order: guessFeedbackHistory.length },
          ];
          setGuessFeedbackHistory(updatedHistory);
          setRemaining(response.remaining);
          localStorage.setItem(
            "guessFeedbackHistory",
            JSON.stringify(updatedHistory)
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  const applyBestGuess = () => {
    // TODO: check license
    setIsLoading(true);
    API.getBestSuggestion(guessFeedbackHistory)
      .then((res) => {
        if (res) {
          guessById(res.id);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    API.getCharacters()
      .then((res) => {
        if (res) setCharacterList(res);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    API.getStatus(guessFeedbackHistory)
      .then((res) => {
        setCharacterToGuess(res?.characterToGuess);
        setRemaining(res?.remaining);
      })
      .finally(() => setIsLoading(false));
  }, [guessFeedbackHistory]);

  return (
    <>
      {isLoading && (
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="absolute w-screen z-50 top-0"
        />
      )}
      <div className="pt-28 md:pt-20 flex flex-row items-center">
        <img src="./logo.png" alt="logo" height={45} width={45} />
        <h1 className="text-2xl">OnePiecedle</h1>
      </div>

      <div
        className="flex flex-col gap-4"
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
        }}
      >
        <Button
          isIconOnly={isMobile}
          size={isMobile ? "sm" : "md"}
          isDisabled={!guessFeedbackHistory.length}
          onClick={() => {
            localStorage.removeItem("guessFeedbackHistory");
            setGuessFeedbackHistory([]);
            setGameStatus("PLAYING");
          }}
          startContent={<Restart />}
        >
          {isMobile ? "" : "Restart"}
        </Button>
        <Button
          size={isMobile ? "sm" : "md"}
          isIconOnly={isMobile}
          onClick={() => {
            setIsLoading(true);
            API.newCharacter()
              .then(() => {
                window.location.reload();
                localStorage.removeItem("guessFeedbackHistory");
                setGuessFeedbackHistory([]);
              })
              .finally(() => setIsLoading(false));
          }}
          color="danger"
          startContent={<Add />}
        >
          {isMobile ? "" : "New Character"}
        </Button>
      </div>

      {/* GUESS */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <CircularProgress color="default" aria-label="Loading..." />
          </div>
        }
      >
        <Guess
          showGoal={showGoal}
          setShowGoal={setShowGoal}
          characterToGuess={characterToGuess}
        />
      </Suspense>
      {/* SEARCH BAR */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <CircularProgress color="default" aria-label="Loading..." />
          </div>
        }
      >
        <SearchBar
          characterList={characterList}
          gameStatus={gameStatus}
          guessById={guessById}
          applyBestGuess={applyBestGuess}
        />
      </Suspense>

      {/* VALIDATION LINES */}
      {Boolean(reversedGuessFeedbackHistory.length) && (
        <div className="flex flex-col gap-2 max-w-full px-2">
          {remaining ? (
            <p className="text-xs text-white/50 flex justify-end mr-2">
              {remaining}/{characterList.length} left
            </p>
          ) : (
            <p className="text-xs text-white/50 flex justify-end mr-2">
              🎉 Congratulations! You found{" "}
              <span className="font-bold px-1">{guessedCharacter?.name}</span>{" "}
              in {guessFeedbackHistory.length} guesses!
            </p>
          )}
          <Progress
            aria-label="Loading..."
            value={Math.max(
              Math.round(
                (100 * (characterList.length - (remaining ?? 0))) /
                  characterList.length
              ),
              1
            )}
          />
          <div className="flex flex-row sm:flex-col gap-2 overflow-auto">
            <GuessFeedbackHeader />
            <div className="flex flex-row sm:flex-col gap-2 overflow-auto sm:max-h-[36rem]">
              {reversedGuessFeedbackHistory.map((guess) => (
                <GuessFeedback
                  key={guess.id}
                  guess={guess}
                  character={characterList.find((p) => p.id === guess.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
