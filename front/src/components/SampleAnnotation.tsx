import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';

import { PhotoRoomThemeType } from '../theme/PhotoRoomTheme';
import Sample, { cardWidth } from './Sample';
import { SampleType } from '../types/Annotation';

type Props = {
    images: SampleType[];
    isBannerOpen: boolean;
    navigationDirection: string;
    handleChangeValue: Function;
} & WithStylesProps;

function SampleAnnotation(props: Props) {
    const { isBannerOpen, images, navigationDirection, handleChangeValue, css, styles } = props;

    return (
        <div {...css(styles.mainColumn)}>
            {images.map(
                (sample: SampleType) => 
                    <Sample
                        sample={sample}
                        isBannerOpen={isBannerOpen}
                        handleChangeValue={handleChangeValue}
                        navigationDirection={navigationDirection}
                        key={sample.name}
                    />
            )}
        </div>
    );
}

const unit = 8;
const sideMargin = `calc((100vw - 2 * ${cardWidth + 3 * unit + 2}px) / 2)`;
export default withStyles(({ color, unit, speed }: PhotoRoomThemeType) => ({
    mainColumn: {
        background: color.page,
        marginLeft: sideMargin,
        marginRight: sideMargin,
        paddingTop: 2 * unit,
        paddingBottom: 2 * unit,
        display: 'inline-flex',
        flexWrap: 'wrap',
        height: `calc(100vh - 2 * ${2 * unit}px)`,
        transition: `background ${speed.fast}s ease-in-out`,
    },
}))(SampleAnnotation);
