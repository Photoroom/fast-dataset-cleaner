import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../../theme/PhotoRoomTheme';

type Props = {
} & WithStylesProps;

const Separator = ({ css, styles }: Props) => <div {...css(styles.separator)}></div>;

export default withStyles(({ unit, color }: PhotoRoomThemeType) => ({
    separator: {
        width: '100%',
        margin: `${3 * unit}px 0`,
        borderRadius: 3 * unit,
        height: 0.25 * unit,
        background: color.bannerSeparator,
    },
}))(Separator);
