type SampleType = {
    id: number;
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