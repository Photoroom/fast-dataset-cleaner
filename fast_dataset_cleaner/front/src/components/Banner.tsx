import React, { useEffect } from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';

import MenuLogo from './menu_logo.png';
import { FastDatasetCleanerThemeType } from '../theme/FastDatasetCleanerTheme';
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
                    src={MenuLogo}
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
const closeLogoSize = {
    large: 8 * unit,
    xlarge: 8 * unit,
};
const openLogoSize = {
    large: 10 * unit,
    xlarge: 12 * unit,
};
export const closeBannerWidth = 11 * unit;
const openBannerWidth = {
    large: 38 * unit,
    xlarge: 42 * unit,
};
export default withStyles(({ unit, color, speed, breakpoints }: FastDatasetCleanerThemeType) => ({
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
        width: openBannerWidth.xlarge,
        cursor: 'default',

        [breakpoints.large]: {
            width: openBannerWidth.large,
        },
    },
    logoClicked: {
        transform: 'rotate(720deg)',
        height: openLogoSize.xlarge,
        left: 3 * unit,
        top: 3 * unit,

        [breakpoints.large]: {
            height: openLogoSize.large,
            left: 2 * unit,
            top: 2 * unit,
        },
    },
    logoNotClicked: {
        transform: 'rotate(0deg)',
    },
    logo: {
        position: 'fixed',
        top: 2 * unit,
        left: unit,
        height: closeLogoSize.xlarge,
        cursor: 'pointer',
        transition: `transform ${speed.fast}s ease-in-out, height ${speed.fast}s ease-in-out, left ${speed.fast}s ease-in-out, top ${speed.fast}s ease-in-out`,

        [breakpoints.large]: {
            height: closeLogoSize.large,
        },
    },
    nightButton: {
        position: 'fixed',
        left: 6 * unit + openLogoSize.xlarge,
        top: openLogoSize.xlarge - unit,
        width: `calc(${openBannerWidth.xlarge - openLogoSize.xlarge - 6 * unit - 5 * unit}px)`,
        padding: `0 ${unit}px`,
        opacity: 1,
        transition: `opacity ${0.5 * speed.fast}s ease-in-out, width ${speed.fast - 0.05}s ease-in-out 0.05s, left ${speed.fast}s ease-in-out`,

        [breakpoints.large]: {
            left: 4 * unit + openLogoSize.large,
            top: openLogoSize.large - 2 * unit,
            width: `calc(${openBannerWidth.large - openLogoSize.large - 4 * unit - 3 * unit}px)`,
        },
    },
    nightButtonHidden: {
        left: 4 * unit + closeLogoSize.xlarge,
        width: `calc(${closeBannerWidth - closeLogoSize.xlarge - 4 * unit - 5 * unit}px * 0.75)`,
        opacity: 0,

        [breakpoints.large]: {
            left: 4 * unit + closeLogoSize.large,
            width: `calc(${closeBannerWidth - closeLogoSize.large - 4 * unit - 5 * unit}px * 0.75)`,
        },
    },
}))(Banner);
