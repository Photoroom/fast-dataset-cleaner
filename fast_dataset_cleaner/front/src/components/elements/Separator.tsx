import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';

import { FastDatasetCleanerThemeType } from '../../theme/FastDatasetCleanerTheme';

type Props = {
    thin?: boolean;
} & WithStylesProps;

const Separator = ({ thin, css, styles }: Props) => <div {...css(styles.separator, thin && styles.thinSeparator)}></div>;

export default withStyles(({ unit, color }: FastDatasetCleanerThemeType) => ({
    separator: {
        width: '100%',
        margin: `${3 * unit}px 0`,
        borderRadius: 3 * unit,
        height: 0.25 * unit,
        background: color.bannerSeparator,
    },
    thinSeparator: {
        height: 0.125 * unit,
        margin: `${2.5 * unit}px 0 ${2 * unit}px 0`,
    },
}))(Separator);
