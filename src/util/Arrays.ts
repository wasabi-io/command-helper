export default class Arrays {
    /**
     * Checks the given array is empty ( undefined , null or length = 0 ) or not
     * @param {any[]} items
     * @return {boolean}
     */
    public static has(items: any[]): boolean {
        return items !== undefined && items !== null && items.length > 0
    }
    public static cleanValueFromArray(src: any[], value: any) {
        for (let i = 0; i < src.length; i++) {
            if (src[i] == value) {
                src.splice(i, 1);
                i--;
            }
        }
        return src;
    }
}


