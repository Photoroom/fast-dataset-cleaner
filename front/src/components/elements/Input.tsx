import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../../theme/PhotoRoomTheme';


type Props = {
    title: string;
    isHidden: boolean;
    value: string | null;
    onChange?: any;
    onBlur?: any;
} & WithStylesProps;

function Input(props: Props){
    const { title, isHidden, value, onChange, onBlur, css, styles } = props;
    
    return (
        <div
            {...css(
                styles.bannerElement,
                isHidden && styles.bannerHidden
            )}
        >
            <h3 {...css(styles.titleInput)}>{title}</h3>
            <input type="text" value={value || ''} onChange={onChange} onBlur={onBlur} {...css(styles.inputArea)}/>
        </div>
    );
}

export default withStyles(({ unit, fontSize, fontFamily, color, speed }: PhotoRoomThemeType) => ({
    titleInput: {
        color: color.bannerText,
        textAlign: 'left',
        fontSize: fontSize.large,
        marginBlockEnd: 1.5 * unit,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxHeight: fontSize.large + 0.25 * unit,
    },
    inputArea: {
        width: `calc(100% - ${4 * unit}px)`,
        fontSize: fontSize.large,
        padding: `${0.5 * unit}px ${1.5 * unit}px`,
        borderRadius: 1.5 * unit,
        background: color.page,
        color: color.reversePage,
        fontFamily: fontFamily,
        transition: `background ${speed.fast}s ease-in-out,
                    color ${speed.fast}s ease-in-out,
                    box-shadow ${speed.fast}s ease-in-out`,

        ':focus': {
            boxShadow: `0 0 ${unit}px 0 ${color.bannerText}`,
        }
    },
    bannerElement: {
        margin: `${unit}px 0`,
        transition: `transform ${speed.fast} ease-in-out, opacity ${speed.fast} ease-in-out`,
    },
    bannerHidden: {
        transform: 'scale(0.9)',
        opacity: 0,
    },
}))(Input);
