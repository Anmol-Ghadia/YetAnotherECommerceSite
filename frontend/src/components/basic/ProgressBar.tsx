import React, { useEffect, useState } from 'react';
import '../../scss/components/basic/ProgressBar.scss';
import { Integer } from '../../types/Integer.ts';

// fractions: is a number (statring from 1)
// state:     is the current fraction (0 indexed)
interface Props {
  fractions: Integer;
  state: Integer;
}

// represents a Progress bar with given fractions and
//   in the current 'state'
const ProgressBar: React.FC<Props> = function _({ fractions, state }) {
  const [elements, setElements] = useState<React.ReactNode>();

  useEffect(() => {
    setElements(
      Array(fractions)
        .fill(null)
        .map((__, index) => {
          if (index < state) {
            return <div key={index} className="completed-bar" />;
          }
          if (state === index) {
            return <div key={index} className="current-bar" />;
          }
          return <div key={index} className="incomplete-bar" />;
        }),
    );
  }, [fractions, state]);

  return (
    <div
      id="page-progress-container"
      data-stage={state}
      style={{ gridTemplateColumns: `repeat(${fractions},1fr)` }}
    >
      {elements}
    </div>
  );
};

export default ProgressBar;
