import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';

import { FastDatasetCleanerThemeType } from '../../theme/FastDatasetCleanerTheme';

type Props = {
    zIndex?: number;
    isVisible: boolean;
    handleClick?: () => void;
} & WithStylesProps;

function Overlay(props: Props){
    const { zIndex, isVisible, handleClick, css, styles } = props;
    
    return (
        <div
            onClick={handleClick}
            style={{zIndex: zIndex || 1}}
            {...css(isVisible ? styles.overlay : styles.overlayHidden)} 
        ></div>
    );
}

export default withStyles(({ opacity, color, speed }: FastDatasetCleanerThemeType) => ({
    overlay: {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: color.overlay,
        opacity: opacity.dark,
        transition: `opacity ${speed.fast}s ease-in-out`,

        ':hover': {
            cursor: 'pointer',
        },
    },
    overlayHidden: {
        opacity: 0,
    },
}))(Overlay);
