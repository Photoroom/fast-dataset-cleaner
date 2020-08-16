import React, { useState } from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../theme/PhotoRoomTheme';
import Input from './elements/Input';
import Separator from './elements/Separator';
import Select from './elements/Select';
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
    setIdColumnName
} from '../services/LocalStorage';
import { getSharedUrl } from '../services/Location';
import Button from './elements/Button';


type Props = {
    isClicked: boolean;
} & WithStylesProps;

function updateUrl() {
    window.history.pushState(null, "Fast Dataset Cleaner", getSharedUrl());
}

function Banner(props: Props){
    const { isClicked, css, styles } = props;
    const [annot, setAnnot] = useState(getAnnotator() || '');
    const [csv, setCsv] = useState(getDatasetPath() || '');
    const [imagesPerPage, setImagesPerPage] = useState(getImgPerPage() || DEFAULT_IMG_PER_PAGE);
    const [shaPass, setShaPass] = useState(getSha() || '');
    const [imgFold, setImgFold] = useState(getImagesFolder() || '');
    const [maskFold, setMaskFold] = useState(getMasksFolder() || '');
    const [useMasks, setUseMasksValue] = useState(getUseMasks() || 'false');
    const [idColumn, setIdColumn] = useState(getIdColumnName() || '');

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

    const handleClickButton = () => window.location.reload(false);


    return (
        <div
            {...css(
                styles.bannerContent,
                isClicked && styles.bannerOpen
            )}
        >
            {isClicked && <Separator />}
            <Input
                title="Password"
                isHidden={!isClicked}
                value={shaPass}
                onChange={handleChangeSha}
            />
            <Input
                title="CSV path"
                isHidden={!isClicked}
                value={csv}
                onChange={handleChangeCsv}
            />
            <Input
                title="Name of the id column"
                isHidden={!isClicked}
                value={idColumn}
                onChange={handleChangeIdColumnName}
            />
            <Input
                title="Annotator"
                isHidden={!isClicked}
                value={annot}
                onChange={handleChangeAnnotator}
            />
            <Select
                title="Images per page"
                name="img_per_page" 
                isHidden={!isClicked}
                value={imagesPerPage.toString()}
                options={OPTIONS_IMG_PER_PAGE}
                onChange={handleChangeImgPerPage}
            />
            <Input
                title="Images folder"
                isHidden={!isClicked}
                value={imgFold}
                onChange={handleChangeImagesFolder}
            />
            <Select
                title="Use masks"
                name="use_masks" 
                isHidden={!isClicked}
                value={useMasks}
                options={OPTIONS_USE_MASKS}
                onChange={handleChangeUseMasks}
            />
            {useMasks === 'true' && (
                <Input
                    title="Masks folder"
                    isHidden={!isClicked}
                    value={maskFold}
                    onChange={handleChangeMasksFolder}
                />
            )}
            <Button title="Get images" isHidden={!isClicked} handleClick={handleClickButton} />
        </div>
    );
}

export default withStyles(({ unit, speed }: PhotoRoomThemeType) => ({
    bannerContent: {
        width: 0,
        margin: 4 * unit,
        marginTop : 20 * unit,
        zIndex: 2,
        transition: `width ${speed.fast}s ease-in-out`,
    },
    bannerOpen: {
        width: `calc(100% - 8 * ${unit}px)`,
    },
}))(Banner);
