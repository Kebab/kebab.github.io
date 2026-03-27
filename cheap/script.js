import React, { useState, useCallback } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
function createEmptyRow() {
    return {
        link: "",
        packSize: 1,
        quantity: 1,
        weight: 1,
        price: 0,
        rank: 0,
        rankColour: ""
    };
}
const App = () => {
    const [rows, setRows] = useState([createEmptyRow()]);
    const handleChange = useCallback((e, index) => {
        if (e === undefined) {
            const copy = [...rows];
            copy.splice(index, 1);
            setRows(copy);
            return;
        }
        let value = parseFloat(e.currentTarget.value);
        if (isNaN(value)) {
            value = undefined;
        }
        const newRow = Object.assign(Object.assign({}, rows[index]), { [e.currentTarget.name]: value });
        newRow.pricePerItem = newRow.price / (newRow.packSize * newRow.quantity * newRow.weight);
        const newRows = [...rows];
        newRows[index] = newRow;
        const ranks = newRows.map((x, index) => [x.pricePerItem, index]);
        ranks.sort((x, y) => y[0] - x[0]);
        for (let i = 0; i < ranks.length; i++) {
            const copy = Object.assign(Object.assign({}, newRows[ranks[i][1]]), { rank: i, rankColour: getColor(i / (ranks.length - 1) * 100) });
            newRows[ranks[i][1]] = copy;
        }
        setRows(newRows);
    });
    const sortRows = useCallback(() => {
        const newRows = [...rows];
        newRows.sort((x, y) => y.rank - x.rank);
        setRows(newRows);
    }, rows);
    return (React.createElement("div", { className: "box" },
        React.createElement("h1", { className: "title" }, "Cheapskate-o-matic"),
        React.createElement("table", null,
            React.createElement("tr", null,
                React.createElement("th", { class: "wide-column" }, "Link"),
                React.createElement("th", { class: "narrow-column" }, "Qty"),
                React.createElement("th", { class: "narrow-column" }, "Pack Size"),
                React.createElement("th", { class: "narrow-column" }, "Pack Weight"),
                React.createElement("th", { class: "narrow-column" }, "Deal Price"),
                React.createElement("th", { class: "narrow-column" }, "Per unit weight")),
            rows.map((x, index) => React.createElement(Row, { row: x, index: index, handleChange: handleChange }))),
        React.createElement("div", { class: "controls" },
            React.createElement("button", { onClick: () => setRows([...rows, createEmptyRow()]) }, "+"),
            " ",
            React.createElement("button", { onClick: () => sortRows() }, "Sort"))));
};
const Row = (props) => {
    var _a, _b;
    return (React.createElement("tr", { style: { background: props.row.rankColour } },
        React.createElement("td", null,
            React.createElement("input", Object.assign({ type: "text", name: "link", value: props.row.link, onChange: (e) => { props.handleChange(e, props.index); } }, autoSelect))),
        React.createElement("td", null,
            React.createElement("input", Object.assign({ type: "number", name: "quantity", value: props.row.quantity, onChange: (e) => { props.handleChange(e, props.index); } }, autoSelect))),
        React.createElement("td", null,
            React.createElement("input", Object.assign({ type: "number", name: "packSize", value: props.row.packSize, onChange: (e) => { props.handleChange(e, props.index); } }, autoSelect))),
        React.createElement("td", null,
            React.createElement("input", Object.assign({ type: "number", name: "weight", value: props.row.weight, onChange: (e) => { props.handleChange(e, props.index); } }, autoSelect))),
        React.createElement("td", null,
            React.createElement("input", Object.assign({ type: "number", name: "price", value: props.row.price, onChange: (e) => { props.handleChange(e, props.index); } }, autoSelect))),
        React.createElement("td", { class: "fixed-font" },
            React.createElement("span", null, "\u00A3"), (_b = (_a = props.row.pricePerItem) === null || _a === void 0 ? void 0 : _a.toFixed(4)) !== null && _b !== void 0 ? _b : "?"),
        React.createElement("td", null,
            React.createElement("button", { onClick: () => props.handleChange(undefined, props.index) }, "-"))));
};
const autoSelect = {
    onFocus: (e) => e.currentTarget.select()
};
function getColor(percentage) {
    // Ensure percentage is between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));
    // Calculate red and green values
    let red = Math.min(255, Math.floor(2.55 * (100 - percentage) * 2));
    let green = Math.min(255, Math.floor(2.55 * percentage * 2));
    // Return the color in hex format
    return `rgba(${red},${green},0, 0.5)`;
}
ReactDOM.render(React.createElement(App, null), document.getElementById("root"));