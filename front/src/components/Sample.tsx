import React, { useState, useEffect, useCallback } from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import {useTransition, animated} from 'react-spring'

import { PhotoRoomThemeType } from '../theme/PhotoRoomTheme';
import { SampleType } from '../types/Annotation';
import { useKeyboard } from '../services/Keyboard';
import { getImgPerPage } from './BannerContent';


type Props = {
    sample: SampleType;
    isBannerOpen: boolean;
    navigationDirection: string;
    handleChangeValue: Function;
} & WithStylesProps;

function Sample(props: Props){
    const { isBannerOpen, sample, navigationDirection, handleChangeValue, css, styles } = props;
    const { id, src, value, sampleNumber, annotated, changing, combination } = sample;

    const [isValid, setIsValid] = useState(value);
    const [hovered, setHovered] = useState(false);

    const handleHover = () => setHovered(!hovered);

    useEffect(() => setIsValid(value), [value]);

    const [inView, setInView] = useState(false)
    useEffect(() => {
        setInView(true)
        return () => setInView(false);
    }, []);

    const toggleValue = () => {
        handleChangeValue(!isValid, sampleNumber);
        setIsValid(!isValid);
    }

    const handleKeyPress = useCallback((event: any) => {
        const keyPressed = event.key;
        if (keyPressed == id && !isBannerOpen) {
            toggleValue();
        }
    }, [id, isBannerOpen, isValid, toggleValue]);

    useKeyboard(handleKeyPress);

    const cardStyle = {
        maxWidth: '40vw',
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
                        onMouseEnter={handleHover}
                        onMouseLeave={handleHover}
                        {...css(
                            styles.card,
                            isValid ? styles.cardValid : styles.cardNotValid,
                            annotated && !changing && styles.cardAnnotated,
                        )}
                    >    
                        <div {...css(styles.idCard)}>
                            <div {...css(styles.id)}>{id}</div>
                            {annotated && <div {...css(styles.annotated)}>{isValid ? '✔' : '✘'}</div>}
                        </div>
                        <img src={hovered ? combination : src} alt="source" {...css(styles.image)} />
                    </div>
                </animated.div>
                )
            }
        </>
    );
}


const unit = 8;
export const cardWidth = 90 * unit;
const maxHeightCardContent = `calc(100vh / ${getImgPerPage() / 2} - ${5 * unit}px)`;
export default withStyles(({ unit, color, speed, fontSize }: PhotoRoomThemeType) => ({
    card: {
        width: cardWidth,
        border: '1px solid #ccc',
        borderRadius: 3 * unit,
        margin: 1.5 * unit,
        maxHeight: `calc(100vh / ${getImgPerPage() / 2})`,
        minHeight: `calc((100vh - ${4 * unit + 3 * unit}px) / ${getImgPerPage() / 2} - ${3 * unit}px)`,
        transition:
            `background ${speed.fast}s ease,
            box-shadow ${speed.fast}s ease,
            transform ${speed.fast}s ease,
            opacity ${speed.fast}s ease`,
        overflow: 'hidden',
        cursor: 'pointer',
        ':hover': {
            boxShadow: `0 0 ${2.5 * unit}px 0 #000`,
        }
    },
    cardValid: {
        background: color.VALID,
    },
    cardNotValid: {
        background: color.NOTVALID,
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
        maxHeight: maxHeightCardContent,
    },
    id: {
        marginTop: 1.5 * unit,
    },
    image: {
        height: '100%',
        marginLeft: 5 * unit,
        maxHeight: maxHeightCardContent,
    },
}))(Sample);
