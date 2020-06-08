import { useEffect } from "react";
import { throttle } from "lodash";

const THRESHOLD_X = 15;
const THRESHOLD_Y = 5;
const THROTTLE_WAIT = 320;

const HANDLE_HORIZONTAL_WHEEL = (e: Event, wheelLeft: Function, wheelRight: Function) => {
    // @ts-ignore
    const { deltaX, deltaY } = e;
    if (Math.abs(deltaX) > THRESHOLD_X && Math.abs(deltaY) <= THRESHOLD_Y) {
        deltaX > 0 ? wheelRight() : wheelLeft();
    }
}

type handleHorizontalWheelType = (event: Event) => void;
export const useHorizontalWheel = (handleHorizontalWheel: handleHorizontalWheelType) => 
    useEffect(() => {
        const throttled = throttle(handleHorizontalWheel, THROTTLE_WAIT);

        window.addEventListener("wheel", throttled);
        return () => window.removeEventListener("wheel", throttled);
    }, [handleHorizontalWheel]);

export default HANDLE_HORIZONTAL_WHEEL;