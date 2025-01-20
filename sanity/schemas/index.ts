import localeStringType from "./localeStringType";
import localeBlockType from "./localeBlockType";
import general from "./general-schema";
import about from "./about-schema";
import additional from "./additional-schema";
import article from "./article-schema";
import localeTextType from "./localeTextType";

const schemas = [
  general,
  about,
  additional,
  article,
  localeStringType,
  localeBlockType,
  localeTextType,
]

export default schemas;