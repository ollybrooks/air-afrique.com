import localeStringType from "./localeStringType";
import localeBlockType from "./localeBlockType";
import localeTextType from "./localeTextType";

import general from "./general-schema";
import about from "./about-schema";
import additional from "./additional-schema";
import article from "./article-schema";
import editorial from "./editorial-schema";
import museum from "./museum-schema";

import home from "./home-schema";
const schemas = [
  general,
  home,
  about,
  editorial,
  additional,
  article,
  museum,
  localeStringType,
  localeBlockType,
  localeTextType,
]

export default schemas;