import React, { useState } from 'react';
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
import AphroditeInterface from 'react-with-styles-interface-aphrodite';

import FastDatasetCleanerThemeType from './theme/FastDatasetCleanerTheme';
import App from './App';


const now = new Date().getHours();
const NIGHT_MODE = now <= 8 || now >= 20;

const SET_BACKGROUND_COLOR = (nightMode) =>
  `transition: background ${FastDatasetCleanerThemeType(nightMode).speed.fast}s ease; background: ${FastDatasetCleanerThemeType(nightMode).color.page}`;


function Bootstrap() {
  const [nightMode, setNightMode] = useState(NIGHT_MODE);

  const handleNightMode = () => setNightMode(!nightMode);

  document.body.style = SET_BACKGROUND_COLOR(nightMode);

  return (
    <WithStylesContext.Provider
      value={{
        stylesInterface: AphroditeInterface,
        stylesTheme: FastDatasetCleanerThemeType(nightMode),
      }}
    >
      <App
        nightMode={nightMode}
        changeNightMode={handleNightMode}
      />
    </WithStylesContext.Provider>
  )
}

export default Bootstrap;
