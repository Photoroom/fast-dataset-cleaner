const getLSValue = (key: string) => localStorage.getItem(key);
const setLSValue = (key: string, value: string) => localStorage.setItem(key, value.trim());


const annotatorLS = 'annotator';
export const getAnnotator = () => getLSValue(annotatorLS);
export const setAnnotator = (annotator: string) => setLSValue(annotatorLS, annotator);

export const DEFAULT_IMG_PER_PAGE = 8;
export const OPTIONS_IMG_PER_PAGE = ["2", "4", "6", "8"];
const imgPerPageLS = 'imagesPerPage';
export const getImgPerPage = () => parseInt(getLSValue(imgPerPageLS) || "8");
export const setImgPerPage = (imgsPerPage: string) => setLSValue(imgPerPageLS, imgsPerPage);

const shaLS = 'sha_pass';
export const getSha = () => getLSValue(shaLS);
export const setSha = (password: string) => setLSValue(shaLS, password);

const datasetPathLS = 'datasetPath';
export const getDatasetPath = () => getLSValue(datasetPathLS);
export const setDatasetPath = (path: string) => setLSValue(datasetPathLS, path);

const imagesFolderLS = 'imagesFolder';
export const getImagesFolder = () => getLSValue(imagesFolderLS);
export const setImagesFolder = (path: string) => setLSValue(imagesFolderLS, path);

const masksFolderLS = 'masksFolder';
export const getMasksFolder = () => getLSValue(masksFolderLS);
export const setMasksFolder = (path: string) => setLSValue(masksFolderLS, path);

const useMasksLS = 'useMasks';
export const OPTIONS_USE_MASKS = ['true', 'false'];
export const getUseMasks = () => getLSValue(useMasksLS);
export const setUseMasks = (useMasks: string) => setLSValue(useMasksLS, useMasks);

const idColumnNameLS = 'idColumnName';
export const getIdColumnName = () => getLSValue(idColumnNameLS);
export const setIdColumnName = (name: string) => setLSValue(idColumnNameLS, name);

const extensionImagesLS = 'imagesExtension';
export const getImagesExtension = () => getLSValue(extensionImagesLS);
export const setImagesExtension = (ext: string) => setLSValue(extensionImagesLS, ext);

const extensionMasksLS = 'masksExtension';
export const getMasksExtension = () => getLSValue(extensionMasksLS);
export const setMasksExtension = (ext: string) => setLSValue(extensionMasksLS, ext);
