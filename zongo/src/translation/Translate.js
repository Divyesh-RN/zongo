import { I18n } from "i18n-js";

import en from './en';

const Translate = new I18n({
	en: en,
});

Translate.fallbacks = true;


export default Translate;