/**
 * Dropdown list 
 * @param data -- Collection of array
 * @returns options
 */
export const getDropdownList = (data: any[]) => {
    let options: any[] = [];
    if (data) {
        data.forEach((item) => {
            let itemData = {
                value: item.id,
                label: item.name,
            };
            options.push(itemData);
        });
    }
    return options;
};