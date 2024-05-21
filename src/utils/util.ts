export default function parseColumns(columnsString: string) {
    // Split the columnsString by comma, considering possible spaces
    const columns = columnsString.split(/,\s*(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    return columns.map(col => col.replace(/"/g, ''));
}