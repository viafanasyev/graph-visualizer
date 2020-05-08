export function sizeof(object) {
    let objectList = [],
        stack = [object],
        bytes = 0,
        value,
        i;

    while (stack.length) {
        value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        } else if (typeof value === 'string') {
            bytes += value.length * 2;
        } else if (typeof value === 'number') {
            bytes += 8;
        } else if (typeof value === 'object'
            && objectList.indexOf(value) === -1) {
            objectList.push(value);

            for (i in value) {
                if (value.hasOwnProperty(i)) {
                    stack.push(value[i]);
                }
            }
        }
    }
    return bytes;
}