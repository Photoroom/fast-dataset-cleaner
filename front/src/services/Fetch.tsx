import { GetAnnotationsResponse, ImageAnnotation } from "../types/Response";
import { SampleType } from "../types/Annotation";
import Api from "./Api";
import { makeBody } from "./FetchUtils";
import { getImgPerPage, getSha, getAnnotator, getDatasetPath, getImagesFolder, getMasksFolder, getUseMasks, getIdColumnName, getImagesExtension, getMasksExtension } from "./LocalStorage";
import { GetImageArgs } from "./Arguments";


const formatImage = (image: ImageAnnotation) => ({
  id: image.index%getImgPerPage() + 1,
  sampleNumber: image.index,
  value: typeof(image.value) == "string" ? true : image.value,
  name: image.id,
  annotated: image.value !== "None",
  changing: false,
});


const formatImages = (images: ImageAnnotation[]) => {
  return images.map(image => formatImage(image));
}

type Props = {
    api_address: string;
    page?: number;
    images?: ImageAnnotation[];
    totalImages?: number;
    processedImages?: number;
};

class FetchService {
    api_address: string;
    page: number;
    images: ImageAnnotation[];
    totalImages: number;
    processedImages: number;
    samples?: SampleType[];
    firstLoading = true;

    constructor(props: Props) {
        this.api_address = props.api_address;
        this.page = props.page || 0;
        this.images = props.images || [];
        this.totalImages = props.totalImages || 0;
        this.processedImages = props.processedImages || 0;
        this.samples = (props.images && formatImages(props.images)) || [];
    }

    getSample = () => this.samples || [];

    getProgress = () => ({ currentPage: this.page, numberImagesPerPage: getImgPerPage(), totalImages: this.totalImages });

    changePage = (condition: boolean, newPage: number) => {
      if (condition) {
        this.page = newPage;
        return this.getAnnotations();
      }
      return new Promise(() => {});
    }

    incrPage = () => {
      const condition = this.page * getImgPerPage() <= this.totalImages;
      return this.changePage(condition, this.page + 1);
    }

    decrPage = () => {
      const condition = this.page > 0;
      return this.changePage(condition, this.page - 1);
    }

    nextPage = () => {
      this.annotate();
      const condition = this.page * getImgPerPage() <= this.totalImages;
      return this.changePage(condition, this.page + 1);
    }

    setValue = (value: boolean, sampleNumber: number) => {
      this.samples = this.samples && this.samples.map((sample: SampleType) => {
        if (sample.sampleNumber === sampleNumber) {
          const newSample = sample;
          sample.value = value;
          sample.changing = !sample.changing;
          return newSample;
        }
        return sample;
      });
    }


    treatNewData(data: GetAnnotationsResponse) {
      const { images, total, processed } = data;
      if (images && total && processed !== undefined) {
        this.images = images;
        this.totalImages = total;
        this.processedImages = processed;
        if (processed < total) {
          this.page = images.length !== 0 ? (images[0].index / getImgPerPage()) : this.page;
        } else {
          const lastPage = Math.ceil((total - 1) / getImgPerPage());
          this.page = (images.length !== 0) ? this.page : lastPage;
        }
        this.samples = formatImages(images);
      }
    }


    get = async (endpoint: string) =>
      fetch(`${this.api_address}${endpoint}`).then(res => res.json());

    post = async (endpoint: string, json: any) =>
      fetch(`${this.api_address}${endpoint}`, makeBody(json)).then(res => res.json());


    getAnnotations = async () => {
      const first = this.firstLoading ? -1 : this.page * getImgPerPage();

      const json = {
        "first": first,
        "offset": getImgPerPage(),
        "sha": getSha(),
        "csv_path": getDatasetPath(),
        "images_folder": getImagesFolder(),
        "masks_folder": getMasksFolder(),
        "with_masks": getUseMasks() === 'true',
        "id_column_name": getIdColumnName(),
        "image_ext": getImagesExtension(),
        "mask_ext": getMasksExtension(),
      };

      return this.post(`${Api.getAnnotations}`, json)
        .then((data: GetAnnotationsResponse) => {
          if (data.error) {
            alert(data.error);
          } else {
            if (this.firstLoading) {
              this.firstLoading = false;
            }
            this.treatNewData(data);
          }
        });
    }

    getImage = (imageId: string) =>
      `${this.api_address}${Api.getImage}?${GetImageArgs.ID}=${imageId}&${GetImageArgs.PASSWORD}=${getSha()}`;


    annotate = async () => {
      const annotations: { [key:string]: any} = {};
      this.samples?.map(sample => annotations[sample.name] = sample.value);

      const json = {
        "annotator": getAnnotator(),
        "annotations": annotations,
        "sha": getSha(),
      };

      this.post(Api.annotate, json)
        .then(_ => {});
    }
}

export default FetchService;
