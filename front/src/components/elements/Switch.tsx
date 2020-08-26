import React, { useState } from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../../theme/PhotoRoomTheme';

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
const switchWidth = 7 * unit;
const switchHeight = 4 * unit;
const switchPadding = 0.5 * unit;
const switchDiscSize = switchHeight - 2 * switchPadding;
export default withStyles(({ fontSize, color, speed }: PhotoRoomThemeType) => ({
    switch: {
        position: 'relative',
        display: 'inline-block',
        width: switchWidth,
        height: switchHeight,
        backgroundColor: color.bannerSeparator,
        borderRadius: switchHeight,
        margin: `${0.5 * unit}px ${1.5 * unit}px`,
        transition: `background-color ${speed.fast}s ease-in-out`,
    },
    switchChecked: {
        backgroundColor: color.PHOTOROOM_LIGHT,
    },
    switchInput: {
        opacity: 0,
        width: 0,
        height: 0,
    },
    roundSlider: {
        position: 'absolute',
        top: switchPadding,
        right: 0,
        transition: `transform ${speed.fast}s ease-in-out`,
        borderRadius: switchHeight,

        content: "",
        height: switchDiscSize,
        width: switchDiscSize,
        left: switchPadding,
        bottom: switchPadding,
        backgroundColor: 'white',
    },
    roundSliderChecked: {
        transform: `translateX(${switchWidth - switchDiscSize - 2 * switchPadding}px)`,
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
    },
    bannerHidden: {
        transform: 'scale(0.9)',
        opacity: 0,
    },
}))(Switch);
