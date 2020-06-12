type SampleType = {
    id: number;
    src: string;
    combination: string;
    sampleNumber: number;
    value: boolean;
    name: string;
    annotated: boolean;
    changing?: boolean;
  };

type ProgressProps = {
    currentPage: number;
    numberImagesPerPage: number;
    totalImages: number;
};

export type { SampleType, ProgressProps };