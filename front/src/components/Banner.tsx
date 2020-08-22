import React, { useEffect } from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../theme/PhotoRoomTheme';

import PhotoRoomLogo from './photoroom_logo.png';
import BannerContent, { handleClickGetImages } from './BannerContent';
import Overlay from './elements/Overlay';
import Button from './elements/Button';
import { KEYS_OPEN_CLOSE_BANNER, KEYS_GET_IMAGES } from '../services/Keyboard';

const noop = () => {};
const INPUT_TAGS = ['input', 'select', 'button', 'textarea'];

type Props = {
    isBannerOpen: boolean;
    handleBanner: Function;
    nightMode: boolean;
    changeNightMode: any;
} & WithStylesProps;

function Banner(props: Props){
    const { isBannerOpen, handleBanner, nightMode, changeNightMode, css, styles } = props;

    useEffect(() => {
        const handleKeyPress = (event: any) => {
            const keyPressed = event.key;
            const noActiveInputTag = document.activeElement && INPUT_TAGS.indexOf(document.activeElement.tagName.toLowerCase()) === -1;
            if (noActiveInputTag && KEYS_OPEN_CLOSE_BANNER.includes(keyPressed)) {
                handleBanner(!isBannerOpen);
            } else if (noActiveInputTag && isBannerOpen && KEYS_GET_IMAGES.includes(keyPressed)) {
                handleClickGetImages();
            }
        }
    
        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [isBannerOpen, handleBanner]);

    const onClickCard = () => {
        handleBanner(!isBannerOpen);
    }

    const onClickOverlay = () => {
        handleBanner(false);
    }

    const titleDayNightMode = nightMode ? "Night mode" : "Day mode";
    
    return (
        <>
            <div
                onClick={!isBannerOpen ? onClickCard : noop}
                {...css(
                    styles.banner,
                    isBannerOpen && styles.bannerOpen
                )}
            >
                <img
                    src={PhotoRoomLogo}
                    alt="Logo"
                    onClick={onClickCard}
                    {...css(
                        styles.logo,
                        isBannerOpen ? styles.logoClicked : styles.logoNotClicked
                    )}
                />
                <div {...css(styles.nightButton, !isBannerOpen && styles.nightButtonHidden)}>
                    <Button title={titleDayNightMode} isHidden={!isBannerOpen} handleClick={changeNightMode} />
                </div>

                <BannerContent isClicked={isBannerOpen} />
            </div>
            <Overlay isVisible={isBannerOpen} handleClick={onClickOverlay} />
        </>
    );
}

const unit = 8;
const closeLogoSize = 8 * unit;
const openLogoSize = 12 * unit;
export const closeBannerWidth = 11 * unit;
const openBannerWidth = 42 * unit;
export default withStyles(({ unit, color, speed }: PhotoRoomThemeType) => ({
    banner: {
        width: closeBannerWidth,
        height: '100vh',
        background: color.banner,
        boxShadow: '0px 0px 20px 0px #000',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2,
        cursor: 'pointer',
        transition: `width ${speed.fast}s ease-in-out`,
    },
    bannerOpen: {
        width: openBannerWidth,
        cursor: 'default',
    },
    logoClicked: {
        transform: 'rotate(720deg)',
        height: openLogoSize,
        left: 3 * unit,
        top: 3 * unit,
    },
    logoNotClicked: {
        transform: 'rotate(0deg)',
    },
    logo: {
        position: 'fixed',
        top: 2 * unit,
        left: unit,
        height: closeLogoSize,
        border: '2px solid #fff',
        borderRadius: 3.5 * unit,
        cursor: 'pointer',
        transition: `transform ${speed.fast}s ease-in-out, height ${speed.fast}s ease-in-out, left ${speed.fast}s ease-in-out, top ${speed.fast}s ease-in-out`,
    },
    nightButton: {
        position: 'fixed',
        left: 6 * unit + openLogoSize,
        top: openLogoSize - unit,
        width: `calc(${openBannerWidth - openLogoSize - 6 * unit - 5 * unit}px)`,
        padding: `0 ${unit}px`,
        opacity: 1,
        transition: `opacity ${0.5 * speed.fast}s ease-in-out, width ${speed.fast - 0.05}s ease-in-out 0.05s, left ${speed.fast}s ease-in-out`,
    },
    nightButtonHidden: {
        left: 4 * unit + closeLogoSize,
        width: `calc(${closeBannerWidth - closeLogoSize - 4 * unit - 5 * unit}px * 0.75)`,
        opacity: 0,
    },
}))(Banner);
