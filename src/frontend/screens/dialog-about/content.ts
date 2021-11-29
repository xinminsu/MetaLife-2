// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {t} from '../../drivers/localization';
import version from '../../versionName';

const repoLink = 'https://gitlab.com/staltz/manyverse';
const authorsLink = 'https://gitlab.com/staltz/manyverse/-/raw/master/AUTHORS';

/**
 * This is a function and not a constant because localization loading is async.
 */
export default function getContent() {
  return (
    '[manyver.se](https://manyver.se)\n' +
    t('dialog_about.version', {version}) +
    '\n\n' +
    t('dialog_about.copyright') +
    ' 2018-2021 ' +
    `[${t('dialog_about.authors')}](${authorsLink})\n` +
    '\n' +
    `[${t('dialog_about.repository')}](${repoLink})\n` +
    t('dialog_about.licensed', {license: 'MPL 2.0'})
  );
}
