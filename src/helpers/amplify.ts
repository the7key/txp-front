import ja from "@aws-amplify-jp/vocabulary-ja";
import { I18n } from "@aws-amplify/core";
import { Translations } from "@aws-amplify/ui-components";

type AmplifyAuthError = {
  code: string;
  message: string;
  name: string;
};

const isAmplifyAuthError = (arg: unknown): arg is AmplifyAuthError => {
  if (typeof arg !== "object" || arg === null) return false;
  return "message" in arg && "code" in arg && "name" in arg;
};

export const setUpAmplifyI18n = () => {
  I18n.putVocabulariesForLanguage("ja-JP", ja(Translations));
  I18n.setLanguage("ja-JP");
};

export const translateAmplifyErrorMessage = (e: unknown) => {
  if (e instanceof Error || isAmplifyAuthError(e)) {
    e.message = I18n.get(e.message);
  }
  return e;
};
