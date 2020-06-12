import { GetAnnotationsResponse, ImageAnnotation, GetColumnsResponse } from "../types/Response";
import { SampleType } from "../types/Annotation";
import {
  getAnnotator,
  getAnnotatorColumn,
  getAnnotationColumn,
  getImgPerPage,
  setAnnotationColumn as LSSetAnnotationColumn,
  setAnnotatorColumn as LSSetAnnotatorColumn,
  getSha,
} from "../components/BannerContent";
import Api from "./Api";
import { makeBody } from "./FetchUtils";


const formatImage = (image: ImageAnnotation) => ({
  id: image.index%getImgPerPage() + 1,
  sampleNumber: image.index,
  src: image.image,
  combination: image.combination,
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
    images_per_page: number;
    page?: number;
    images?: ImageAnnotation[];
    totalImages?: number;
    processedImages?: number;
};

class FetchService {
    api_address: string;
    images_per_page: number;
    page: number;
    images: ImageAnnotation[];
    totalImages: number;
    processedImages: number;
    samples?: SampleType[];
    firstLoading = true;

    constructor(props: Props) {
        this.api_address = props.api_address;
        this.images_per_page = props.images_per_page || 8;
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


    get = async (endpoint: string) =>
      fetch(`${this.api_address}${endpoint}`).then(res => res.json());

    post = async (endpoint: string, json: any) =>
      fetch(`${this.api_address}${endpoint}`, makeBody(json)).then(res => res.json());


    getAnnotations = async () => {
      const first = this.firstLoading ? -1 : this.page * getImgPerPage();
      const args = `first=${first}&offset=${getImgPerPage()}&sha=${getSha()}`;
      return this.get(`${Api.getAnnotations}?${args}`)
        .then((data: GetAnnotationsResponse) => {
          if (this.firstLoading) {
            this.firstLoading = false;
          }
          this.treatNewData(data);
        });
    }


    annotate = async () => {
      const annotations: { [key:string]: any} = {};
      this.samples?.map(sample => annotations[sample.name] = sample.value);

      const json = {
        "annotator": getAnnotator(),
        "annotations": annotations,
      };

      this.post(Api.annotate, json)
        .then(_ => {});
    }


    setAnnotatorColumn = async () => {
      const json = {
        "annotator_column": getAnnotatorColumn(),
      };

      this.post(Api.setAnnotatorColumn, json)
        .then(_ => {});
    }


    setAnnotationColumn = async () => {
      const json = {
        "annotation_column": getAnnotationColumn(),
      };

      this.post(Api.setAnnotationColumn, json)
        .then(_ => {});
    }


    getColumns = async () => {
      return this.get(`${Api.getColumns}?sha=${getSha()}`)
        .then((data: GetColumnsResponse) => {
          const { annotator, annotation } = data;
            LSSetAnnotationColumn(annotation);
            LSSetAnnotatorColumn(annotator);
        });
    }

}

export default FetchService;
