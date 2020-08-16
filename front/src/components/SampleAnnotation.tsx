import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';

import { PhotoRoomThemeType } from '../theme/PhotoRoomTheme';
import Sample from './Sample';
import { SampleType } from '../types/Annotation';
import FetchService from '../services/Fetch';
import { closeBannerWidth } from './Banner';

type Props = {
    images: SampleType[];
    isBannerOpen: boolean;
    fetchService: FetchService;
    navigationDirection: string;
    handleChangeValue: Function;
} & WithStylesProps;

function SampleAnnotation(props: Props) {
    const { isBannerOpen, images, fetchService, navigationDirection, handleChangeValue, css, styles } = props;
    
    return (
        <div {...css(styles.mainColumn)}>
            {images.map(
                (sample: SampleType) => 
                    <Sample
                        sample={sample}
                        isBannerOpen={isBannerOpen}
                        handleChangeValue={handleChangeValue}
                        navigationDirection={navigationDirection}
                        fetchService={fetchService}
                        key={sample.name}
                    />
            )}
        </div>
    );
}

const unit = 8;
export const mainColumnHeight = `calc(100vh - 2 * ${unit}px)`;
export default withStyles(({ color, unit, speed }: PhotoRoomThemeType) => ({
    mainColumn: {
        background: color.page,
        marginLeft: closeBannerWidth + 2 * unit,
        marginRight: 0,
        paddingTop: unit,
        paddingBottom: unit,
        display: 'flex',
        flexWrap: 'wrap',
        height: mainColumnHeight,
        transition: `background ${speed.fast}s ease-in-out`,
    },
}))(SampleAnnotation);
