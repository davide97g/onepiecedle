import { Card, CardBody, Image, Tooltip } from "@nextui-org/react";
import { GuessResult } from "../../../types/algorithm.model";
import { ComparisonIcon } from "./ComparisonIcon";
import { OnePieceCharacterSummary } from "../../../types/onepiece.model";

export const GuessFeedback = ({
  guess,
  character,
}: {
  guess: GuessResult;
  character?: OnePieceCharacterSummary;
}) => {
  if (!character) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Card>
        <CardBody
          className={`overflow-visible w-full h-full absolute bg-black/50 rounded-xl`}
          style={{
            border: `2px solid white`,
            opacity: 0.5,
          }}
        />
        <CardBody className={`overflow-visible w-24`}>
          <Tooltip
            showArrow
            content={character.name}
            className="text-gray-600 capitalize"
          >
            {/* <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src={character?.image}
              width={150}
            /> */}
            <p className="text-xs">{character.name}</p>
          </Tooltip>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-hidden truncate sm:text-wrap w-24 ${
            guess.gender.valid ? "bg-emerald-500" : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="sm:text-small text-xs text-xs capitalize">
            {guess.gender.value}
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-hidden truncate sm:text-wrap  w-24 ${
            guess.origin.valid ? "bg-emerald-500" : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="sm:text-small text-xs capitalize">
            {guess.origin.value}
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-hidden truncate sm:text-wrap w-24 ${
            guess.devilFruitType.valid ? "bg-emerald-500" : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="sm:text-small text-xs capitalize">
            {guess.devilFruitType.value}
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-hidden truncate sm:text-wrap sm:overflow-visible w-24 ${
            guess.status.valid ? "bg-emerald-500" : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="sm:text-small text-xs capitalize">
            {guess.status.value}
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-hidden truncate sm:text-wrap sm:overflow-visible w-24 ${
            guess.debutSaga.comparison === "equal"
              ? "bg-emerald-500"
              : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="sm:text-small text-xs capitalize">
            {guess.debutSaga.value}
          </p>
        </CardBody>
        <ComparisonIcon comparison={guess.debutSaga.comparison} />
      </Card>
      <Card>
        <CardBody
          className={`overflow-hidden truncate sm:text-wrap sm:overflow-visible w-24 ${
            guess.bounty.comparison === "equal"
              ? "bg-emerald-500"
              : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="sm:text-small text-xs">
            {Number(guess.bounty.value)} $
          </p>
          <ComparisonIcon comparison={guess.bounty.comparison} />
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-hidden truncate sm:text-wrap sm:overflow-visible w-24 ${
            guess.height.comparison === "equal"
              ? "bg-emerald-500"
              : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="sm:text-small text-xs capitalize">
            {Number(guess.height.value / 100)}m
          </p>
          <ComparisonIcon comparison={guess.height.comparison} />
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-hidden truncate sm:text-wrap sm:overflow-visible w-24 ${
            guess.age.comparison === "equal" ? "bg-emerald-500" : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="sm:text-small text-xs capitalize">{guess.age.value}</p>
        </CardBody>
        <ComparisonIcon comparison={guess.age.comparison} />
      </Card>
    </div>
  );
};
