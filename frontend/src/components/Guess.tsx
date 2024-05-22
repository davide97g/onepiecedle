import { Card, Switch, Image } from "@nextui-org/react";
import { OnePieceCharacterSummary } from "../../../types/onepiece.model";

export default function Guess({
  showGoal,
  setShowGoal,
  characterToGuess,
}: Readonly<{
  showGoal: boolean;
  setShowGoal: (value: boolean) => void;
  characterToGuess: OnePieceCharacterSummary | undefined;
}>) {
  const isMobile = window.innerWidth < 640;
  return (
    <div
      style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
      }}
      className="flex flex-col gap-4 items-end"
    >
      <Switch size="sm" isSelected={showGoal} onValueChange={setShowGoal}>
        Guess
      </Switch>
      {showGoal && characterToGuess && (
        <Card>
          {/* <Image
            width={isMobile ? 50 : 100}
            alt="Card background"
            className="object-cover rounded-xl"
            src={characterToGuess?.image}
          /> */}
          <p>{characterToGuess.name}</p>
        </Card>
      )}
    </div>
  );
}
