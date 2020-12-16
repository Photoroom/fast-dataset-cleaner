import React, { useState, useEffect, useCallback } from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import {useTransition, animated} from 'react-spring'

import { FastDatasetCleanerThemeType } from '../theme/FastDatasetCleanerTheme';
import { SampleType } from '../types/Annotation';
import { useKeyboard } from '../services/Keyboard';
import { getImgPerPage, getAnnotationUltraFastModeLS } from '../services/LocalStorage';
import FetchService from '../services/Fetch';
import { closeBannerWidth } from './Banner';


type Props = {
    sample: SampleType;
    isBannerOpen: boolean;
    navigationDirection: string;
    fetchService: FetchService;
    handleChangeValue: Function;
} & WithStylesProps;

function Sample(props: Props){
    const { isBannerOpen, sample, navigationDirection, fetchService, handleChangeValue, css, styles } = props;
    const { id, value, sampleNumber, annotated, changing, name } = sample;

    const [isValid, setIsValid] = useState(value);

    const ultraFastMode = getAnnotationUltraFastModeLS();

    useEffect(() => setIsValid(value), [value]);

    const [inView, setInView] = useState(false)
    useEffect(() => {
        setInView(true)
        return () => setInView(false);
    }, []);

    const toggleValue = useCallback(() => {
        handleChangeValue(!isValid, sampleNumber);
        setIsValid(!isValid);
    }, [isValid, sampleNumber, handleChangeValue]);

    const handleKeyPress = useCallback((event: any) => {
        const keyPressed = event.key;
        if (parseInt(keyPressed) === id && !isBannerOpen) {
            toggleValue();
        }
    }, [id, isBannerOpen, toggleValue]);

    useKeyboard(handleKeyPress);

    const unit = 8;
    const cardStyle = {
        maxWidth: '45vw',
        width: `calc((100vw - ${closeBannerWidth}px) / 2 - ${10 * unit}px)`,
        display: 'inline-block',
    };
    const translationInOut = `translateX(${navigationDirection === 'left' ? '-' : ''}100vw)`;

    const content = {
        from: { opacity: 0, transform: translationInOut, ...cardStyle },
        enter: { opacity: 1, transform: 'translateX(0)', ...cardStyle },
        leave: { opacity: 0, transform: translationInOut, ...cardStyle },
    };

    const transitions = useTransition(inView, null, content)
    
    return (
        <>
            {transitions.map(({ item, key, props: propsBis}) =>
                item && <animated.div key={key} style={propsBis}>
                    <div
                        onClick={toggleValue}
                        onKeyDown={handleKeyPress}
                        {...css(
                            styles.card,
                            ultraFastMode && styles.cardUltraFast,
                            isValid ? styles.cardValid : styles.cardNotValid,
                            annotated && !changing && styles.cardAnnotated,
                            ultraFastMode && !isValid && styles.cardNotValidUltraFast,
                        )}
                    >    
                        <div {...css(styles.idCard)}>
                            <div {...css(styles.id)}>{id}</div>
                            {annotated && <div {...css(styles.annotated)}>{isValid ? '✔' : '✘'}</div>}
                        </div>
                        <img src={fetchService.getImage(name)} alt="source" {...css(styles.image)} />
                    </div>
                </animated.div>
                )
            }
        </>
    );
}


const unit = 8;
export const cardWidth = 95 * unit;
const maxHeightCardContent = {
    large: `calc(100vh / ${getImgPerPage() / 2} - ${1 * unit}px)`,
    xlarge: `calc(100vh / ${getImgPerPage() / 2} - ${2 * unit}px)`,
};
export default withStyles(({ unit, color, speed, fontSize, breakpoints }: FastDatasetCleanerThemeType) => ({
    card: {
        maxHeight: `calc(100vh / ${getImgPerPage() / 2})`,
        border: '1px solid #ccc',
        borderRadius: 3 * unit,
        margin: `${0.5 * unit}px ${1 * unit}px`,
        height: `calc(100% - 2 * ${0.75 * unit}px)`,
        minHeight: `calc((100vh - ${4 * unit + 2 * unit}px) / ${getImgPerPage() / 2} - ${1 * unit}px)`,
        transition:
            `background ${speed.fast}s ease,
            box-shadow ${speed.fast}s ease,
            transform ${speed.fast}s ease,
            opacity ${speed.fast}s ease`,
        overflow: 'hidden',
        cursor: 'pointer',
        ':hover': {
            boxShadow: `0 0 ${2.5 * unit}px 0 #000`,
        },

        [breakpoints.large]: {
            maxHeight: `calc(100vh / ${getImgPerPage() / 2} - 2 * ${0.5 * unit}px)`,
            height: `calc(100% - 2 * ${0.5 * unit}px)`,
            margin: `${0.25 * unit}px ${0.5 * unit}px`,
        },
    },
    cardUltraFast: {
        transition:
            `background ${speed.ultraFast}s ease,
            box-shadow ${speed.ultraFast}s ease,
            transform ${speed.ultraFast}s ease,
            opacity ${speed.ultraFast}s ease`,
    },
    cardValid: {
        background: color.VALID,
    },
    cardNotValid: {
        background: color.NOTVALID,
    },
    cardNotValidUltraFast: {
        opacity: 0.05,
    },
    annotated: {
        marginTop: unit,
        fontSize: fontSize.large,
    },
    cardAnnotated: {
        opacity: 0.5,
    },
    idCard: {
        fontWeight: 'bold',
        position: 'absolute',
        width: 5 * unit,
        borderRight: '1px solid #ccc',
        height: '100%',
        maxHeight: maxHeightCardContent.xlarge,

        [breakpoints.large]: {
            maxHeight: maxHeightCardContent.large,
        },
    },
    id: {
        marginTop: 1.5 * unit,
    },
    image: {
        height: '100%',
        marginLeft: 5 * unit,
        maxHeight: maxHeightCardContent.xlarge,
        maxWidth: `calc(100% - ${5 * unit + 2 * unit}px)`,

        [breakpoints.large]: {
            maxHeight: maxHeightCardContent.large,
        },
    },
}))(Sample);
