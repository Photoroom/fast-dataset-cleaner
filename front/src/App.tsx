import React, { useState, useEffect } from 'react';
import './App.css';

import SampleAnnotation from './components/SampleAnnotation';
import Banner from './components/Banner';
import { imgPerPageLS, getAnnotator, getAnnotationColumn, getAnnotatorColumn } from './components/BannerContent';
import FetchService from './services/Fetch';
import HANDLE_KEY_PRESS, { useKeyboard } from './services/Keyboard';
import HANDLE_HORIZONTAL_WHEEL, { useHorizontalWheel } from './services/Wheel';
import { SampleType } from './types/Annotation';
import FinalScreen from './components/FinalScreen';
import Progress from './components/Progress';

const HTTP_API = 'http://t2.artizans.ai:5000/api/';
const NUMBER_IMAGES_PER_PAGE = parseInt(localStorage.getItem(imgPerPageLS) || '8');

const fetchService = new FetchService({
  'api_address': HTTP_API,
  'images_per_page': NUMBER_IMAGES_PER_PAGE
});

const noop = () => {};


type Props = {
  nightMode: boolean;
  changeNightMode: Function;
};

function App(props: Props) {
  const { nightMode, changeNightMode } = props
  const [bannerOpen, setBannerOpen] = useState(!getAnnotator() || !getAnnotationColumn() || !getAnnotatorColumn());
  const [samples, setSamples] = useState<SampleType[]>([]);
  const [navigationDirection, setNavigationDirection] = useState('none');

  const updateSamples = (direction: string) => {
    setNavigationDirection(direction);
    setSamples(fetchService.getSample());
  };

  useEffect(() => {
    fetchService.getAnnotations().finally(() => updateSamples('none'));
  }, []);

  const pressLeft = () => fetchService.decrPage().then(() => updateSamples('left'));
  const pressRight = () => fetchService.incrPage().then(() => updateSamples('right'));
  const pressNext = () => fetchService.nextPage().then(() => updateSamples('right'));

  const handleKeyPress = (event: Event) =>
    !bannerOpen ? HANDLE_KEY_PRESS(event, pressLeft, pressRight, pressNext) : noop;
  useKeyboard(handleKeyPress);

  const handleSideScroll = (event: Event) =>
    !bannerOpen ? HANDLE_HORIZONTAL_WHEEL(event, pressLeft, pressRight) : noop;
  useHorizontalWheel(handleSideScroll);

  const handleChangeValue = (value: boolean, index: number) =>
    fetchService.setValue(value, index);

  const postAnnotatorColumn = () =>
    fetchService.setAnnotatorColumn();

  const postAnnotationColumn = () =>
    fetchService.setAnnotationColumn();


  return (
    <div className="App">
      <Banner
        handleBanner={setBannerOpen}
        isBannerOpen={bannerOpen}
        nightMode={nightMode}
        changeNightMode={changeNightMode}
        postAnnotatorColumn={postAnnotatorColumn}
        postAnnotationColumn={postAnnotationColumn}
      />
      {samples.length !== 0 ? (
        <SampleAnnotation 
          images={samples} 
          isBannerOpen={bannerOpen}
          handleChangeValue={handleChangeValue}
          navigationDirection={navigationDirection}
        />
      ) : (
        <FinalScreen navigationDirection={navigationDirection} />
      )}
      {samples.length !== 0 && (
        <Progress
          progress={fetchService.getProgress()}
          handlePressLeft={pressLeft}
          handlePressRight={pressRight}
        />
      )}
    </div>
  );
}

export default App;
