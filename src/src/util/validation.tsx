
export function validateNumber(fieldName: string, enteredValues: object,
                              minMaxValues: Map<string, {min: number, max: number}>,
                               errorMessages: Map<string, {min: string, max: string}>, minFieldName?: string): string {
    let errorMessage = '';

    if (enteredValues[fieldName] === null) {
        return '';
    }

    const min = minMaxValues.get(fieldName)?.min;
    const max = minMaxValues.get(fieldName)?.max;
    if (min === undefined || max === undefined) {
        return '';
    }

    if (enteredValues[fieldName] < min) {
        errorMessage = `${errorMessages.get(fieldName)?.min} ${min}` || '';
    } else if (enteredValues[fieldName] > max) {
        errorMessage = `${errorMessages.get(fieldName)?.max} ${max}` || '';
    } else if (minFieldName && enteredValues[fieldName] < enteredValues[minFieldName]) {
        errorMessage = `${errorMessages.get(fieldName)?.min} ${enteredValues[minFieldName]}` || '';
    }
    return errorMessage;
}

export function validateSubmit(fieldNames: string[],minMaxValues: Map<string, {min: number, max: number}>,
                               enteredValues: object): boolean {
        for (const name of fieldNames) {
            const min = minMaxValues.get(name)?.min;
            const max = minMaxValues.get(name)?.max;
            if (min === undefined || max === undefined) {
                return false;
            }

            if (enteredValues[name] < min || enteredValues[name] > max || enteredValues[name] === 0) {
                return false;
            }
        }
         return true;
}
