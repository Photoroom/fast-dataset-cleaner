import React, { useState } from 'react';
import WithStylesContext from 'react-with-styles/lib/WithStylesContext';
import AphroditeInterface from 'react-with-styles-interface-aphrodite';

import PhotoRoomTheme from './theme/PhotoRoomTheme';
import App from './App';


const now = new Date().getHours();
const NIGHT_MODE = now <= 8 || now >= 20;

const SET_BACKGROUND_COLOR = (nightMode) =>
  `transition: background ${PhotoRoomTheme(nightMode).speed.fast}s ease; background: ${PhotoRoomTheme(nightMode).color.page}`;


function Bootstrap() {
  const [nightMode, setNightMode] = useState(NIGHT_MODE);

  const handleNightMode = () => setNightMode(!nightMode);

  document.body.style = SET_BACKGROUND_COLOR(nightMode);

  return (
    <WithStylesContext.Provider
      value={{
        stylesInterface: AphroditeInterface,
        stylesTheme: PhotoRoomTheme(nightMode),
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
