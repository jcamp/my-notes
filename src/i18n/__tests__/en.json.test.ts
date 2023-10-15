import capitalize from "shared/string/capitalize";
import en from "../en.json";

test("all root keys start with Uppercase letter", () => {
  expect(
    Object
      .keys(en)
      .map((key) => key === capitalize(key))
      .every((expectation) => expectation === true),
  ).toBe(true);
});

test("no key contains a dot character", () => { // Reason: "." is used to find translation
  const keys: string[] = [];
  const appendKeys = (object: Record<string, unknown>) => {
    Object.keys(object).forEach((key) => {
      keys.push(key);

      if (typeof object[key] === "object") {
        appendKeys(object[key] as Record<string, unknown>);
      }
    });
  };

  appendKeys(en);

  expect(keys.every((key) => !key.includes("."))).toBe(true);
});
