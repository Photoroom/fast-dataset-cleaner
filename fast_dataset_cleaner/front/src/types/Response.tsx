export type ImageAnnotation = {
  id: string;
  index: number;
  value: boolean | string;
};  

type AnnotationsResponse = {
  images?: ImageAnnotation[];
  total?: number;
  processed?: number;
};

export type GetAnnotationsResponse = {
  error?: string;
} & AnnotationsResponse;
