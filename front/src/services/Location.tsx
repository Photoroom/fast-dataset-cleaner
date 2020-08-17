import {
    getSha,
    getDatasetPath,
    getImgPerPage,
    getImagesFolder,
    getMasksFolder,
    getUseMasks,
    getIdColumnName,
    setSha,
    setDatasetPath,
    setImgPerPage,
    setImagesFolder,
    setMasksFolder,
    setUseMasks,
    setIdColumnName,
    getImagesExtension,
    getMasksExtension,
    setImagesExtension,
    setMasksExtension
} from "./LocalStorage";

enum UrlArgs {
    PASSWORD = 'sha',
    IMAGES_PER_PAGE = 'imgPerPage',
    CSV_PATH = 'csv',
    IMAGES_FOLDER = 'imagesFolder',
    MASKS_FOLDER = 'masksFolder',
    USE_MASKS = 'useMasks',
    ID_COLUMN = 'idColumn',
    IMAGES_EXTENSION = 'imgExt',
    MASKS_EXTENSION = 'maskExt',
};

const createSharedUrlArgs = () => {
    let args: string[] = [];
    const sha = getSha();
    const csv = getDatasetPath();
    const imgPerPage = getImgPerPage();
    const imagesFolder = getImagesFolder();
    const masksFolder = getMasksFolder();
    const useMasks = getUseMasks();
    const idColumn = getIdColumnName();
    const imgExt = getImagesExtension();
    const masksExt = getMasksExtension();

    if (csv) {
        args.push(`${UrlArgs.CSV_PATH}=${csv}`);
    }
    if (imgPerPage) {
        args.push(`${UrlArgs.IMAGES_PER_PAGE}=${imgPerPage}`);
    }
    if (idColumn) {
        args.push(`${UrlArgs.ID_COLUMN}=${idColumn}`);
    }
    if (imagesFolder) {
        args.push(`${UrlArgs.IMAGES_FOLDER}=${imagesFolder}`);
    }
    if (useMasks) {
        args.push(`${UrlArgs.USE_MASKS}=${useMasks}`);
    }
    if (useMasks?.toLowerCase() === 'true' && masksFolder) {
        args.push(`${UrlArgs.MASKS_FOLDER}=${masksFolder}`);
    }
    if (imgExt) {
        args.push(`${UrlArgs.IMAGES_EXTENSION}=${imgExt}`);
    }
    if (masksExt) {
        args.push(`${UrlArgs.MASKS_EXTENSION}=${masksExt}`);
    }
    if (sha) {
        args.push(`${UrlArgs.PASSWORD}=${sha}`);
    }

    if (args === []) {
        return "";
    }
    return "?" + args.join('&');
};

export const getSharedUrl = () => {
    const currentUrl = new URL(window.location.href);
    const origin = currentUrl.origin;
    const args = createSharedUrlArgs();
    return `${origin}${args}`;
}

const setLSFromUrl = (url: URL, arg: string, setter: Function) => {
    const value = url.searchParams.get(arg)
    if (value) {
        setter(value);
    }
}

export const readUrl = () => {
    const currentUrl = new URL(window.location.href);
    setLSFromUrl(currentUrl, UrlArgs.PASSWORD, setSha);
    setLSFromUrl(currentUrl, UrlArgs.CSV_PATH, setDatasetPath);
    setLSFromUrl(currentUrl, UrlArgs.IMAGES_PER_PAGE, setImgPerPage);
    setLSFromUrl(currentUrl, UrlArgs.IMAGES_FOLDER, setImagesFolder);
    setLSFromUrl(currentUrl, UrlArgs.MASKS_FOLDER, setMasksFolder);
    setLSFromUrl(currentUrl, UrlArgs.USE_MASKS, setUseMasks);
    setLSFromUrl(currentUrl, UrlArgs.ID_COLUMN, setIdColumnName);
    setLSFromUrl(currentUrl, UrlArgs.IMAGES_EXTENSION, setImagesExtension);
    setLSFromUrl(currentUrl, UrlArgs.MASKS_EXTENSION, setMasksExtension);
}
