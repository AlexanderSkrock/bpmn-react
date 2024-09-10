import {CalledElementLoader} from "./ProcessNavigation.types";

export default class DefaultCalledElementLoader implements CalledElementLoader {
    load = () => {
        return Promise.reject(new Error("not supported"));
    }
}
