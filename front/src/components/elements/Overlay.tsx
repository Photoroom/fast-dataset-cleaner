import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../../theme/PhotoRoomTheme';

type Props = {
    zIndex?: number;
    isVisible: boolean;
} & WithStylesProps;

function Overlay(props: Props){
    const { zIndex, isVisible, css, styles } = props;
    
    return (
        <div
            style={{zIndex: zIndex || 1}}
            {...css(isVisible ? styles.overlay : styles.overlayHidden)} 
        ></div>
    );
}

export default withStyles(({ opacity, color, speed }: PhotoRoomThemeType) => ({
    overlay: {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: color.overlay,
        opacity: opacity.dark,
        transition: `opacity ${speed.fast}s ease-in-out`,
    },
    overlayHidden: {
        opacity: 0,
    },
}))(Overlay);
