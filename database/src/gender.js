// SCRIPT TO RUN DIRECTLY IN CONSOLE
// URL = "https://onepiece.fandom.com/wiki/Category:Male_Characters";

const getMaleCharacterNames = () => {
  const names = [
    ...document
      .getElementsByClassName("category-page__members")[0]
      .getElementsByTagName("a"),
  ].map((item) => item.innerText);

  return names.filter(
    (name) => name && name !== "Category:Non-Canon Male Characters"
  );
};

getMaleCharacterNames();
