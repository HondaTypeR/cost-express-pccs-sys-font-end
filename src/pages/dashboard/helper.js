export const formatThousands = (value) => {
    if (value === null || value === undefined) return "";
    const n = Number(value);
    if (Number.isNaN(n)) return String(value);
    return n.toLocaleString("en-US");
};
