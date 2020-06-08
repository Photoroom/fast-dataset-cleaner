import { useEffect } from "react";

const KEYS_LEFT = ['ArrowLeft'];
const KEYS_RIGHT = ['ArrowRight'];
const KEYS_NEXT = ['Enter'];

const HANDLE_KEY_PRESS = (event: any, pressLeft: Function, pressRight: Function, pressNext: Function) => {
    const keyPressed = event.key;
    if (KEYS_LEFT.includes(keyPressed)) {
        pressLeft();
    } else if (KEYS_RIGHT.includes(keyPressed)) {
        pressRight();
    } else if (KEYS_NEXT.includes(keyPressed)) {
        pressNext();
    }
}

type handleKeyPressType = (event: Event) => void
export const useKeyboard = (handleKeyPress: handleKeyPressType) =>
    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress]);

export default HANDLE_KEY_PRESS;