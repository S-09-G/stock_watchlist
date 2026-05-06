import StockCard from "./StockCard";

export default function StockGrid({ stocks, onSelect, onRefresh, onRequestRemove }) {
  return (
    <div className="stock-grid">
      {stocks.map((stock) => (
        <StockCard
          key={stock.id}
          stock={stock}
          onSelect={onSelect}
          onRefresh={onRefresh}
          onRequestRemove={onRequestRemove}
        />
      ))}
    </div>
  );
}
