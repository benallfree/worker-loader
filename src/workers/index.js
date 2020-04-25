/* eslint-disable multiline-ternary */
import path from 'path';

const getWorker = (file, content, options) => {
  const publicPath = options.publicPath
    ? JSON.stringify(options.publicPath)
    : '__webpack_public_path__';

  const publicWorkerPath = `${publicPath} + ${JSON.stringify(file)}`;

  if (options.stringify) {
    const s = `
      (function() {
        var blob = new Blob([${JSON.stringify(
    content,
  )}], { type: 'text/javascript' });
        return  new Worker(window.URL.createObjectURL(blob));
      })
    `;
    return s;
  }

  if (options.inline) {
    const InlineWorkerPath = JSON.stringify(`!!${
      path.join(__dirname, 'InlineWorker.js')
    }`);

    const fallbackWorkerPath = options.fallback === false
      ? 'null'
      : publicWorkerPath;

    return `require(${InlineWorkerPath})(${JSON.stringify(content)}, ${fallbackWorkerPath})`;
  }

  return `new Worker(${publicWorkerPath})`;
};

export default getWorker;
