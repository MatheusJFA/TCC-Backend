export const emptyObject = (obj: Object) => {
    return Object.keys(obj).length === 0;
}

export const objectWithAllValuesEmpty = (obj: Object) => {
    return Object.values(obj).every(value => {
        return !!value;
    });
}