import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../../theme/PhotoRoomTheme';


type Props = {
    text?: string;
} & WithStylesProps;

function TextDisplay(props: Props){
    const { text, css, styles } = props;
    
    return (
        <>
            {text && (
                <h3 {...css(styles.displayedText)}>{text}</h3>
            )}
        </>
    );
}

export default withStyles(({ unit, fontSize, color }: PhotoRoomThemeType) => ({
    displayedText: {
        color: color.bannerText,
        textAlign: 'left',
        fontSize: fontSize.medium,
        marginBlockEnd: 1.5 * unit,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        'line-break': 'anywhere',
    },
}))(TextDisplay);
