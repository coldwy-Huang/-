
import React from 'react';
import { TIMELINE_CELL_WIDTH, TIMELINE_TOTAL_CELLS } from '../constants';

const TimelineHeader: React.FC = () => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].slice(0, TIMELINE_TOTAL_CELLS);

  return (
    <div className="flex bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
      <div className="w-[300px] flex-shrink-0 border-r border-gray-200 bg-gray-50 p-4 font-semibold text-gray-700 flex flex-col justify-center">
        <span className="text-xs text-indigo-600 font-bold uppercase tracking-widest">2026年度</span>
        <span className="text-sm">项目详情</span>
      </div>
      <div className="flex overflow-hidden">
        {months.map((month, idx) => (
          <div
            key={idx}
            style={{ width: TIMELINE_CELL_WIDTH }}
            className="flex-shrink-0 border-r border-gray-200 text-center py-4 text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-50/50"
          >
            {month}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineHeader;
