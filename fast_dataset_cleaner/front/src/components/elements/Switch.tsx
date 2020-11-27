import React, { useState } from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';

import { FastDatasetCleanerThemeType } from '../../theme/FastDatasetCleanerTheme';

type Props = {
    value: boolean;
    stateTrue: string;
    stateFalse: string;
    isHidden: boolean;
    handleClick: (e: any) => void;
} & WithStylesProps;

const Switch = (props: Props) => {
    const { value, stateFalse, stateTrue, isHidden, handleClick, css, styles } = props;
    const [checked, setChecked] = useState(value);

    const handleChangeToggle = () => {
        const newChecked = !checked;
        setChecked(newChecked);
        handleClick(newChecked);
    }

    return (
        <label {...css(styles.switchArea, isHidden && styles.bannerHidden)}>
            <h4 {...css(styles.switchLegend)}>{stateFalse}</h4>
            <div {...css(styles.switch, checked && styles.switchChecked)}>
                <input type="checkbox" onClick={handleChangeToggle} {...css(styles.switchInput)} />
                <span {...css(styles.roundSlider, checked && styles.roundSliderChecked)}></span>
            </div>
            <h4 {...css(styles.switchLegend)}>{stateTrue}</h4>
        </label>
    );
}

const unit = 8;
const switchWidth = {
    large: 5 * unit,
    xlarge: 7 * unit,
};
const switchHeight = {
    large: 3 * unit,
    xlarge: 4 * unit,
};
const switchPadding = {
    large: 0.25 * unit,
    xlarge: 0.5 * unit,
};
const switchDiscSize = {
    large: switchHeight.large - 2 * switchPadding.large,
    xlarge: switchHeight.xlarge - 2 * switchPadding.xlarge,
};
const roundSliderCheckedTransform = {
    large: `translateX(${switchWidth.large - switchDiscSize.large - 2 * switchPadding.large}px)`,
    xlarge: `translateX(${switchWidth.xlarge - switchDiscSize.xlarge - 2 * switchPadding.xlarge}px)`,
};
export default withStyles(({ fontSize, color, speed, breakpoints }: FastDatasetCleanerThemeType) => ({
    switch: {
        position: 'relative',
        display: 'inline-block',
        width: switchWidth.xlarge,
        height: switchHeight.xlarge,
        backgroundColor: color.bannerSeparator,
        borderRadius: switchHeight.xlarge,
        margin: `${0.5 * unit}px ${1.5 * unit}px`,
        transition: `background-color ${speed.fast}s ease-in-out`,

        [breakpoints.large]: {
            width: switchWidth.large,
            height: switchHeight.large,
        },
    },
    switchChecked: {
        backgroundColor: color.FAST_DATASET_CLEANER_LIGHT,
    },
    switchInput: {
        opacity: 0,
        width: 0,
        height: 0,
    },
    roundSlider: {
        position: 'absolute',
        top: switchPadding.xlarge,
        right: 0,
        transition: `transform ${speed.fast}s ease-in-out`,
        borderRadius: switchHeight.xlarge,

        content: "",
        height: switchDiscSize.xlarge,
        width: switchDiscSize.xlarge,
        left: switchPadding.xlarge,
        bottom: switchPadding.xlarge,
        backgroundColor: 'white',

        [breakpoints.large]: {
            left: switchPadding.large,
            bottom: switchPadding.large,
            top: switchPadding.large,
            height: switchDiscSize.large,
            width: switchDiscSize.large,
        },
    },
    roundSliderChecked: {
        transform: roundSliderCheckedTransform.xlarge,

        [breakpoints.large]: {
            transform: roundSliderCheckedTransform.large,
        },
    },
    switchArea: {
        cursor: 'pointer',
    },
    switchLegend: {
        position: 'relative',
        display: 'inline-block',
        fontSize: fontSize.medium,
        top: 0.75 * unit,
        margin: 0,
        color: color.pageDay,

        [breakpoints.large]: {
            top: 0.25 * unit,
        },
    },
    bannerHidden: {
        transform: 'scale(0.9)',
        opacity: 0,
    },
}))(Switch);
