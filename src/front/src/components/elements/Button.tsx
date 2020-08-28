import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../../theme/PhotoRoomTheme';


type Props = {
    title: string;
    isHidden: boolean;
    handleClick: any;
} & WithStylesProps;

function Button(props: Props){
    const { title, isHidden, handleClick, css, styles } = props;
    
    return (
        <div
            {...css(
                styles.bannerElement,
                isHidden && styles.bannerHidden
            )}
        >
            <button type="button" {...css(styles.button)} onClick={handleClick}>{title}</button>
        </div>
    );
}

export default withStyles(({ unit, fontSize, fontFamily, color, speed, isNightMode }: PhotoRoomThemeType) => ({
    button: {
        width: '100%',
        fontFamily: fontFamily,
        fontSize: fontSize.large,
        fontWeight: 'bold',
        padding: `${unit}px ${1.5 * unit}px`,
        borderRadius: 2 * unit,
        background: isNightMode ? color.pageNight : color.pageDay,
        color: isNightMode ? color.pageDay : color.pageNight,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxHeight: fontSize.large + 0.25 * unit + 3 * unit,
        cursor: 'pointer',
        transition: `background ${speed.fast}s ease-in-out, color ${speed.fast}s ease-in-out`,
    },
    bannerElement: {
        transition: `transform ${speed.fast} ease-in-out, opacity ${speed.fast} ease-in-out`,
    },
    bannerHidden: {
        transform: 'scale(0.9)',
        opacity: 0,
    },
}))(Button);
