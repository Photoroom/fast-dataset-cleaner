export type ImageAnnotation = {
    id: string;
    image: string;
    combination: string;
    index: number;
    value: boolean | string;
  };  

export type GetAnnotationsResponse = {
    images: ImageAnnotation[];
    total: number;
    processed: number;
};

export type GetColumnsResponse = {
  annotator: string;
  annotation: string;
};
