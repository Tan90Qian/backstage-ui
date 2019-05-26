declare module '*.less';

declare module '*.png';
declare module '*.jpg';

declare module '*.svg' {
  const content: any;
  export default content;
}
