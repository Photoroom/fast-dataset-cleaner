import React from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';

import { FastDatasetCleanerThemeType } from '../../theme/FastDatasetCleanerTheme';

type Props = {
    thin?: boolean;
} & WithStylesProps;

const Separator = ({ thin, css, styles }: Props) => <div {...css(styles.separator, thin && styles.thinSeparator)}></div>;

const unit = 8;
const separatorMargin = {
    large: `${2 * unit}px 0`,
    xlarge: `${3 * unit}px 0`,
};
const thinSeparatorMargin = {
    large: `${2.5 * unit}px 0 ${2 * unit}px 0`,
    xlarge: `${1.5 * unit}px 0 ${2 * unit}px 0`,
};
export default withStyles(({ unit, color, breakpoints }: FastDatasetCleanerThemeType) => ({
    separator: {
        width: '100%',
        margin: separatorMargin.xlarge,
        borderRadius: 3 * unit,
        height: 0.25 * unit,
        background: color.bannerSeparator,

        [breakpoints.large]: {
            margin: separatorMargin.large,
        },
    },
    thinSeparator: {
        height: 0.125 * unit,
        margin: thinSeparatorMargin.xlarge,

        [breakpoints.large]: {
            margin: thinSeparatorMargin.large,
        },
    },
}))(Separator);
