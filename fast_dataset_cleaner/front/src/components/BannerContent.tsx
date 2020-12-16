import React, { useState, useEffect, useCallback } from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';

import { FastDatasetCleanerThemeType } from '../theme/FastDatasetCleanerTheme';
import {
    getAnnotator,
    getImgPerPage,
    getSha,
    setAnnotator,
    setImgPerPage,
    setSha,
    DEFAULT_IMG_PER_PAGE,
    OPTIONS_IMG_PER_PAGE,
    getDatasetPath,
    setDatasetPath,
    setImagesFolder,
    setMasksFolder,
    getImagesFolder,
    getMasksFolder,
    OPTIONS_USE_MASKS,
    setUseMasks,
    getUseMasks,
    getIdColumnName,
    setIdColumnName,
    setImagesExtension,
    getImagesExtension,
    getMasksExtension,
    setMasksExtension,
    setAnnotationUltraFastModeLS,
    getAnnotationUltraFastModeLS
} from '../services/LocalStorage';
import { updateUrl, UrlArgs } from '../services/Location';
import Button from './elements/Button';
import Input from './elements/Input';
import Section from './elements/Section';
import Select from './elements/Select';
import Separator from './elements/Separator';
import Switch from './elements/Switch';
import TextDisplay from './elements/TextDisplay';


const FOLDER_PLACEHOLDER = '/path/to/folder/';
export const handleClickGetImages = () => window.location.reload(false);

type Props = {
    isClicked: boolean;
} & WithStylesProps;


function Banner(props: Props){
    const { isClicked, css, styles } = props;

    const url = new URL(window.location.href);
    const params = url.searchParams;
    const urlCsvPath = params.get(UrlArgs.CSV_PATH);
    const urlImagesPerPage = params.get(UrlArgs.IMAGES_PER_PAGE);
    const urlPassword = params.get(UrlArgs.PASSWORD);
    const urlImagesFolder = params.get(UrlArgs.IMAGES_FOLDER);
    const urlMasksFolder = params.get(UrlArgs.MASKS_FOLDER);
    const urlUseMasks = params.get(UrlArgs.USE_MASKS);
    const urlIdColumn = params.get(UrlArgs.ID_COLUMN);
    const urlImagesExtension = params.get(UrlArgs.IMAGES_EXTENSION);
    const urlMasksExtension = params.get(UrlArgs.MASKS_EXTENSION);
    
    const [annot, setAnnot] = useState(getAnnotator() || '');
    const [csv, setCsv] = useState(urlCsvPath || getDatasetPath() || '');
    const [imagesPerPage, setImagesPerPage] = useState(urlImagesPerPage || getImgPerPage() || DEFAULT_IMG_PER_PAGE);
    const [shaPass, setShaPass] = useState(urlPassword || getSha() || '');
    const [imgFold, setImgFold] = useState(urlImagesFolder || getImagesFolder() || '');
    const [maskFold, setMaskFold] = useState(urlMasksFolder || getMasksFolder() || '');
    const [useMasks, setUseMasksValue] = useState(urlUseMasks || getUseMasks() || 'false');
    const [idColumn, setIdColumn] = useState(urlIdColumn || getIdColumnName() || 'id');
    const [imgExt, setImgExt] = useState(urlImagesExtension || getImagesExtension() || '');
    const [masksExt, setMasksExt] = useState(urlMasksExtension || getMasksExtension() || '');
    const [annotationUltraFastMode, setAnnotationUltraFastMode] = useState(getAnnotationUltraFastModeLS() || false);
    
    useEffect(() => {
        if (!getIdColumnName()) {
            setIdColumnName('id');
        }
    }, []);

    const handleChangeAnnotator = (e: any) => {
        const annotator = e.target.value;
        setAnnotator(annotator);
        setAnnot(annotator);
    };

    const handleChangeImgPerPage = (e: any) => {
        const imgPerPage = e.target.value;
        setImgPerPage(imgPerPage);
        setImagesPerPage(imgPerPage);
        updateUrl();
    };
    
    const handleChangeCsv = (e: any) => {
        const csvPath = e.target.value;
        setDatasetPath(csvPath);
        setCsv(csvPath);
        updateUrl();
    };
    
    const handleChangeSha = (e: any) => {
        const password = e.target.value;
        setShaPass(password);
        setSha(password);
        updateUrl();
    };

    const handleChangeImagesFolder = (e: any) => {
        const folder = e.target.value;
        setImagesFolder(folder);
        setImgFold(folder);
        updateUrl();
    };

    const handleChangeMasksFolder = (e: any) => {
        const folder = e.target.value;
        setMasksFolder(folder);
        setMaskFold(folder);
        updateUrl();
    };

    const handleChangeUseMasks = (e: any) => {
        const useMasksValue = e.target.value;
        setUseMasksValue(useMasksValue);
        setUseMasks(useMasksValue);
        updateUrl();
    };

    const handleChangeIdColumnName = (e: any) => {
        const name = e.target.value;
        setIdColumn(name);
        setIdColumnName(name);
        updateUrl();
    };

    const handleChangeImagesExtension = (e: any) => {
        const extension = e.target.value;
        setImgExt(extension);
        setImagesExtension(extension);
        updateUrl();
    };

    const handleChangeMasksExtension = (e: any) => {
        const extension = e.target.value;
        setMasksExt(extension);
        setMasksExtension(extension);
        updateUrl();
    };

    const handleChangeAnnotationMode = (mode: boolean) => {
        setAnnotationUltraFastMode(mode);
        setAnnotationUltraFastModeLS(mode);
    }

    const InputBanner = useCallback((props: any) => <Input isHidden={!isClicked} {...props} />, [isClicked]);
    const SelectBanner = useCallback((props: any) => <Select isHidden={!isClicked} {...props} />, [isClicked]);
    const SwitchBanner = useCallback((props: any) => <Switch isHidden={!isClicked} {...props} />, [isClicked]);
    const SectionBanner = useCallback((props: any) => <Section isHidden={!isClicked} {...props} />, [isClicked]);
    const ButtonBanner = useCallback((props: any) => <Button isHidden={!isClicked} {...props} />, [isClicked]);

    return (
        <div
            {...css(
                styles.bannerContent,
                isClicked && styles.bannerOpen
            )}
        >
            {isClicked && <Separator />}
            <SectionBanner title="Password">
                <InputBanner
                    value={shaPass}
                    onChange={handleChangeSha}
                />
            </SectionBanner>
            <SectionBanner title="About the CSV">
                <InputBanner
                    displayInputValue
                    title="CSV path"
                    value={csv}
                    onChange={handleChangeCsv}
                />
                <InputBanner
                    title="Name of the id column"
                    value={idColumn}
                    onChange={handleChangeIdColumnName}
                />
            </SectionBanner>
            <SectionBanner title="Images">
                <TextDisplay text={`${imgFold || FOLDER_PLACEHOLDER}{id}${imgExt}`} />
                <InputBanner
                    title="Images folder"
                    value={imgFold}
                    onChange={handleChangeImagesFolder}
                />
                <InputBanner
                    title="Images extension"
                    value={imgExt}
                    onChange={handleChangeImagesExtension}
                />
            </SectionBanner>
            <SectionBanner title="Masks">
                <SelectBanner
                    title="Use masks"
                    name="use_masks"
                    value={useMasks}
                    options={OPTIONS_USE_MASKS}
                    onChange={handleChangeUseMasks}
                />
                {useMasks === 'true' && (
                    <>
                        <TextDisplay text={`${maskFold || FOLDER_PLACEHOLDER}{id}${masksExt}`} />
                        <InputBanner
                            title="Masks folder"
                            value={maskFold}
                            onChange={handleChangeMasksFolder}
                        />
                        <InputBanner
                            title="Masks extension"
                            value={masksExt}
                            onChange={handleChangeMasksExtension}
                        />
                    </>
                )}
            </SectionBanner>
            <SectionBanner title="Annotation">
                <InputBanner
                    title="Annotator"
                    value={annot}
                    onChange={handleChangeAnnotator}
                />
                <SelectBanner
                    title="Images per page"
                    name="img_per_page"
                    value={imagesPerPage.toString()}
                    options={OPTIONS_IMG_PER_PAGE}
                    onChange={handleChangeImgPerPage}
                />
                <SwitchBanner
                    value={annotationUltraFastMode}
                    stateFalse="Fast mode"
                    stateTrue="Ludicrous mode"
                    handleClick={handleChangeAnnotationMode} />
            </SectionBanner>
            <ButtonBanner title="Get images" handleClick={handleClickGetImages} />
            <div {...css(styles.postSpace)}></div>
        </div>
    );
}

const unit = 8;
const bannerContentSideMargin = {
    large: 2 * unit,
    xlarge: 3 * unit,
};
const bannerContentMarginTop = {
    large: 14 * unit,
    xlarge: 19 * unit,
};
const bannerContentMaxHeight = {
    large: '86vh',
    xlarge: '85vh',
};
export default withStyles(({ speed, breakpoints }: FastDatasetCleanerThemeType) => ({
    bannerContent: {
        width: 0,
        margin: bannerContentSideMargin.xlarge,
        marginTop : bannerContentMarginTop.xlarge,
        zIndex: 2,
        overflowY: 'auto',
        maxHeight: bannerContentMaxHeight.xlarge,
        transition: `width ${speed.fast}s ease-in-out`,

        [breakpoints.large]: {
            margin: bannerContentSideMargin.large,
            marginTop : bannerContentMarginTop.large,
            maxHeight: bannerContentMaxHeight.large,
        },
    },
    bannerOpen: {
        width: `calc(100% - 2 * ${bannerContentSideMargin.xlarge}px)`,

        [breakpoints.large]: {
            width: `calc(100% - 2 * ${bannerContentSideMargin.large}px)`,
        },
    },
    postSpace: {
        height: unit,
    },
}))(Banner);
