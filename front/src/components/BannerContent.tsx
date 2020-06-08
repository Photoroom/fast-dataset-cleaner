import React, { useState } from 'react';
import { withStyles, WithStylesProps } from 'react-with-styles';
import { PhotoRoomThemeType } from '../theme/PhotoRoomTheme';
import Input from './elements/Input';
import Separator from './elements/Separator';
import Select from './elements/Select';


const DEFAULT_ANNOT = '';
const annotatorLS = 'annotator';
export const getAnnotator = () => localStorage.getItem(annotatorLS);
const setAnnotator = (annotator: string) => localStorage.setItem(annotatorLS, annotator);

const DEFAULT_IMG_PER_PAGE = 8;
export const imgPerPageLS = 'imagesPerPage';
const OPTIONS_IMG_PER_PAGE = ["2", "4", "6", "8"];
export const getImgPerPage = () => parseInt(localStorage.getItem(imgPerPageLS) || "8");
const setImgPerPage = (imgsPerPage: string) => localStorage.setItem(imgPerPageLS, imgsPerPage);

const DEFAULT_ANNOTOR_COLUMN = 'annotator';
export const annotatorColumnLS = 'annotatorColumn';
export const getAnnotatorColumn = () => localStorage.getItem(annotatorColumnLS);
export const setAnnotatorColumn = (columnName: string) => localStorage.setItem(annotatorColumnLS, columnName);

const DEFAULT_ANNOTION_COLUMN = 'is_valid';
export const annotationColumnLS = 'annotationColumn';
export const getAnnotationColumn = () => localStorage.getItem(annotationColumnLS);
export const setAnnotationColumn = (columnName: string) => localStorage.setItem(annotationColumnLS, columnName);

const DEFAULT_PASSWORD = '';
export const shaLS = 'sha_pass';
export const getSha = () => localStorage.getItem(shaLS);
const setSha = (password: string) => localStorage.setItem(shaLS, password);


type Props = {
    isClicked: boolean;
    postAnnotatorColumn: Function;
    postAnnotationColumn: Function;
} & WithStylesProps;

function Banner(props: Props){
    const { isClicked, postAnnotatorColumn, postAnnotationColumn, css, styles } = props;
    const [annot, setAnnot] = useState(getAnnotator() || DEFAULT_ANNOT);
    const [imagesPerPage, setImagesPerPage] = useState(getImgPerPage() || DEFAULT_IMG_PER_PAGE);
    const [annotatorCol, setAnnotatorCol] = useState(getAnnotatorColumn() || DEFAULT_ANNOTOR_COLUMN);
    const [annotationCol, setAnnotationCol] = useState(getAnnotationColumn() || DEFAULT_ANNOTION_COLUMN);
    const [shaPass, setShaPass] = useState(getSha() || DEFAULT_PASSWORD);

    const handleChangeAnnotator = (e: any) => {
        const annotator = e.target.value;
        setAnnotator(annotator);
        setAnnot(annotator);
    };

    const handleChangeImgPerPage = (e: any) => {
        const imgPerPage = e.target.value;
        setImgPerPage(imgPerPage);
        setImagesPerPage(imgPerPage);
    };

    const handleChangeAnnotatorColumn = (e: any) => {
        const columnName = e.target.value;
        setAnnotatorCol(columnName);
        setAnnotatorColumn(columnName);
    };
    const handleBlurAnnotatorColumn = (_: any) => postAnnotatorColumn();

    const handleChangeAnnotationColumn = (e: any) => {
        const columnName = e.target.value;
        setAnnotationCol(columnName);
        setAnnotationColumn(columnName);
    };
    const handleBlurAnnotationColumn = (_: any) => postAnnotationColumn();
    
    const handleChangeSha = (e: any) => {
        const password = e.target.value;
        setShaPass(password);
        setSha(password);
    };


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
                value={`${shaPass}`}
                onChange={handleChangeSha}
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
                title="Annotator column"
                isHidden={!isClicked}
                value={annotatorCol}
                onChange={handleChangeAnnotatorColumn}
                onBlur={handleBlurAnnotatorColumn}
            />
            <Input
                title="Annotation column"
                isHidden={!isClicked}
                value={annotationCol}
                onChange={handleChangeAnnotationColumn}
                onBlur={handleBlurAnnotationColumn}
            />
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
