import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'path';

const compositionId = 'HelloWorld';

console.log('Bundling project...');
const bundleLocation = await bundle({
  entryPoint: path.resolve('./src/index.ts'),
  webpackOverride: (config) => config,
});

const inputProps = {
  titleText: 'Hello from Remotion',
  titleColor: '#ffffff',
};

console.log('Selecting composition...');
const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: compositionId,
  inputProps,
});

console.log('Rendering video...');
await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: `out/${compositionId}.mp4`,
  inputProps,
});

console.log('Render done! Output: out/HelloWorld.mp4');
