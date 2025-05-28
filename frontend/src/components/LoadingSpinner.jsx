import React from 'react';
import './loader.css';

const LoadingSpinner = () => {
  return (
    <div>
      <div className="loader-wrapper">
        <div className="cube-wrapper">
          <div className="cube">
            <div className="sides">
              <div className="top"></div>
              <div className="right"></div>
              <div className="bottom"></div>
              <div className="left"></div>
              <div className="front"></div>
              <div className="back"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

//DNA LOADER

// import React, { useEffect, useRef } from 'react';
// import './loader.css';

// const LoadingSpinner = () => {
//   const loaderRef = useRef(null);
//   const total = 13;

//   useEffect(() => {
//     if (!CSS.supports('top: calc(sin(1) * 1px)')) {
//       const strands = loaderRef.current.querySelectorAll('.strand');
//       for (let s = 0; s < strands.length; s++) {
//         const delay = Math.sin(((Math.PI / 180) * 45) * ((s + 1) / strands.length));
//         strands[s].style.setProperty('--delay', `calc((${delay} * var(--speed)) * -1s)`);
//       }
//     }

//     const COLORS = [
//       'hsl(44, 98%, 60%)',
//       'hsl(197, 50%, 44%)',
//       'hsl(300, 100%, 100%)',
//       'hsl(331, 76%, 50%)',
//     ];

//     const nodes = loaderRef.current.querySelectorAll('.strand__node');
//     nodes.forEach(node => {
//       node.style.setProperty('--bg', COLORS[Math.floor(Math.random() * COLORS.length)]);
//     });
//   }, []);

//   return (
//     <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800 '>
//     <section className='body'>
//     <div className="dna" style={{ '--total': total }} ref={loaderRef}>
//       {[...Array(total)].map((_, i) => (
//         <div className="strand" key={i} style={{ '--index': i + 1 }}>
//           <div className="strand__node"></div>
//           <div className="strand__node"></div>
//         </div>
//       ))}
//     </div>
//     </section>
//     </header>
//   );
// };

// export default LoadingSpinner;
