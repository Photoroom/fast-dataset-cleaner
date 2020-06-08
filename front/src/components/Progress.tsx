import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';

import { PhotoRoomThemeType } from '../theme/PhotoRoomTheme';
import { ProgressProps } from '../types/Annotation';


type Props = {
    progress: ProgressProps;
} & WithStylesProps;

function Progress(props: Props){
    const { progress, css, styles } = props;
    const { currentPage, numberImagesPerPage, totalImages } = progress;

    const firstIndex = totalImages > 0 ? currentPage * numberImagesPerPage + 1 : 0;
    const lastIndex = Math.min((currentPage + 1) * numberImagesPerPage, totalImages);
    const pct = (currentPage * numberImagesPerPage * 100 / totalImages).toPrecision(4);
    
    return (
        <div {...css(styles.progress)}>
            <h3 {...css(styles.title)}>Images {firstIndex}-{lastIndex} / {totalImages}</h3>
            <h3 {...css(styles.title)}>({pct}%)</h3>
        </div>
    );
}

export default withStyles(({ unit, fontSize, color, speed, isNightMode }: PhotoRoomThemeType) => ({
    title: {
        marginBlockStart: unit,
        marginBlockEnd: unit,
    },
    progress: {
        position: 'absolute',
        right: 0,
        top: 0,
        fontSize: fontSize.medium,
        paddingRight: 2 * unit,
        fontWeight: 'bold',
        borderRadius: 2 * unit,
        background: isNightMode ? color.pageNight : color.pageDay,
        color: isNightMode ? color.pageDay : color.pageNight,
        transition: `background ${speed.fast}s ease-in-out, color ${speed.fast}s ease-in-out`,
    },
    bannerElement: {
        transition: `transform ${speed.fast} ease-in-out, opacity ${speed.fast} ease-in-out`,
    },
    bannerHidden: {
        transform: 'scale(0.9)',
        opacity: 0,
    },
}))(Progress);
