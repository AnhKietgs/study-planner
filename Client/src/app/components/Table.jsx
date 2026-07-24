export default function Table({ headers, data, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            {headers.map((header, index) => (
              <th 
                key={index}
                className="px-4 py-3 text-left text-[14px] font-semibold text-[#6B7280] uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors"
            >
              {row.map((cell, cellIndex) => (
                <td 
                  key={cellIndex}
                  className="px-4 py-4 text-[14px] text-[#111827]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
