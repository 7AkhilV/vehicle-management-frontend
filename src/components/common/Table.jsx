const Table = ({ columns, data = [], actions }) => {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ minWidth: '100%', backgroundColor: 'white', border: '1px solid rgb(229, 231, 235)', borderRadius: '0.5rem' }}>
        <thead style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  textAlign: 'left', 
                  fontSize: '0.75rem', 
                  fontWeight: '500', 
                  color: 'rgb(107, 114, 128)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}
              >
                {column.header}
              </th>
            ))}
            {actions && (
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: 'rgb(107, 114, 128)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody style={{ borderTop: '1px solid rgb(229, 231, 235)' }}>
          {safeData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'rgb(107, 114, 128)' }}
              >
                No data available
              </td>
            </tr>
          ) : (
            safeData.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ borderTop: rowIndex > 0 ? '1px solid rgb(229, 231, 235)' : 'none' }}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'rgb(17, 24, 39)' }}>
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
                {actions && (
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

