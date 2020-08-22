import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../../theme/PhotoRoomTheme';
import Separator from './Separator';


type Props = {
    title: string;
    isHidden: boolean;
    children: React.ReactNode;
} & WithStylesProps;

function Section(props: Props){
    const { title, isHidden, children, css, styles } = props;
        
    return (
        <div
            {...css(
                styles.bannerElement,
                isHidden && styles.bannerHidden
            )}
        >
            {title && <h2 {...css(styles.titleSection)}>{title}</h2>}
            {children}
            <Separator thin />
        </div>
    );
}

export default withStyles(({ unit, fontSize, color, speed }: PhotoRoomThemeType) => ({
    titleSection: {
        color: color.bannerText,
        textAlign: 'center',
        fontSize: fontSize.xlarge,
        marginBlockEnd: 1.5 * unit,
        marginBlockStart: 0.5 * unit,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    bannerElement: {
        margin: `0 0 ${unit}px 0`,
        transition: `transform ${speed.fast} ease-in-out, opacity ${speed.fast} ease-in-out`,
    },
    bannerHidden: {
        transform: 'scale(0.9)',
        opacity: 0,
    },
}))(Section);
