import { StarFilled } from "@carbon/icons-react";
import {
  Autocomplete,
  AutocompleteItem,
  // Avatar,
  Button,
} from "@nextui-org/react";
import { OnePieceCharacterSummary } from "../../../types/onepiece.model";

export default function SearchBar({
  characterList,
  gameStatus,
  guessById,
  applyBestGuess,
}: Readonly<{
  characterList: OnePieceCharacterSummary[];
  gameStatus: "PLAYING" | "WON";
  guessById: (id: string) => void;
  applyBestGuess: () => void;
}>) {
  return (
    <div className="flex justify-center items-center flex-row gap-4  sm:gap-12 w-full">
      {characterList.length > 0 && (
        <Autocomplete
          size="sm"
          isDisabled={gameStatus === "WON"}
          defaultItems={characterList}
          variant="bordered"
          label="Choose a character"
          labelPlacement="inside"
          className="max-w-[250px] autocomplete"
          onSelectionChange={(id) => {
            if (id) guessById(String(id));
          }}
        >
          {(character) => (
            <AutocompleteItem
              key={character.id}
              textValue={character.name}
              className="bg-background"
            >
              <div className="flex gap-2 items-center">
                {/* <Avatar
                  alt={character.name}
                  className="flex-shrink-0"
                  size="md"
                  src={character.image}
                /> */}
                <div className="flex flex-col">
                  <span className="text-small text-gray-600 capitalize">
                    {character.name}
                  </span>
                </div>
              </div>
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
      <Button
        size="sm"
        className="w-24"
        color="primary"
        isDisabled={gameStatus === "WON"}
        onClick={applyBestGuess}
        startContent={<StarFilled />}
      >
        Best Guess
      </Button>
    </div>
  );
}
