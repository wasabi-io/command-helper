import Class from "./Class";
import * as merge from "deepmerge";

export interface IPropClass {
    props: any
}
abstract class PropsClass<T> extends Class implements IPropClass {
    props: T;
    constructor(props: T, defaultProps?: any) {
        super();
        let defProps = defaultProps || this.constructor["defaultProps"];
        defProps = merge(defProps, {});
        this.props = defProps ? PropsClass.merge(defProps, props): props;
    }
    static merge<T>(props: any, defaultProps: any) {
        return merge(props, defaultProps);
    }
}

export default PropsClass;
